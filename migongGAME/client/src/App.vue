<template>
  <router-view />

  <!-- Friend request notification dialog -->
  <el-dialog v-model="showRequestDialog" title="新的好友请求" width="420px" :close-on-click-modal="false" top="15vh">
    <div v-for="req in unseenRequests" :key="req.id" class="notification-item">
      <div class="notify-user">
        <el-avatar :size="40">{{ req.user?.username?.[0] }}</el-avatar>
        <div class="notify-meta">
          <div class="notify-name">{{ req.user?.username }}</div>
          <div class="notify-time">请求添加你为好友 · {{ formatTime(req.createdAt) }}</div>
        </div>
      </div>
      <div class="notify-actions">
        <el-button size="small" type="success" @click="handleNotifyRequest(req.id, 'accept')">接受</el-button>
        <el-button size="small" type="danger" @click="handleNotifyRequest(req.id, 'reject')">拒绝</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api'
import { ElMessage } from 'element-plus'

const auth = useAuthStore()
const showRequestDialog = ref(false)
const unseenRequests = ref<any[]>([])
const seenIds = new Set<string>()
let pollTimer: ReturnType<typeof setInterval> | null = null

auth.init()

function formatTime(ts: number) {
  if (!ts) return ''
  const diff = Date.now() - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return `${Math.floor(diff / 86400000)} 天前`
}

async function pollRequests() {
  if (!auth.isLoggedIn) return
  try {
    const res = await api.get('/api/friends/requests')
    const all: any[] = res.data || []
    const fresh = all.filter(r => !seenIds.has(r.id))
    if (fresh.length > 0) {
      unseenRequests.value = fresh
      showRequestDialog.value = true
    }
    // Track all current request IDs
    all.forEach(r => seenIds.add(r.id))
  } catch {}
}

async function handleNotifyRequest(id: string, action: 'accept' | 'reject') {
  try {
    await api.put(`/api/friends/request/${id}`, { action })
    ElMessage.success(action === 'accept' ? '已接受好友请求' : '已拒绝好友请求')
    unseenRequests.value = unseenRequests.value.filter(r => r.id !== id)
    if (unseenRequests.value.length === 0) {
      showRequestDialog.value = false
    }
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || '操作失败')
  }
}

function startPolling() {
  stopPolling()
  pollRequests()
  pollTimer = setInterval(pollRequests, 5000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

watch(() => auth.isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    startPolling()
  } else {
    stopPolling()
    seenIds.clear()
    unseenRequests.value = []
    showRequestDialog.value = false
  }
}, { immediate: true })

onUnmounted(() => stopPolling())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --primary: #5b8c5a;
  --accent: #e8a87c;
  --bg: #f5f0e8;
  --text: #3e2723;
  --note-bg: #fef9e7;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
  gap: 12px;
}
.notification-item:last-child { border-bottom: none; }
.notify-user { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.notify-meta { min-width: 0; }
.notify-name { font-weight: 600; color: #3e2723; font-size: 15px; }
.notify-time { font-size: 12px; color: #999; margin-top: 2px; }
.notify-actions { display: flex; gap: 6px; flex-shrink: 0; }
</style>
