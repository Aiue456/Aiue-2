<template>
  <div class="lb-page">
    <div class="header">
      <el-button text @click="$router.push('/')">← 返回首页</el-button>
      <h2>排行榜</h2>
    </div>
    <div class="content">
      <el-table :data="list" stripe style="width:100%;max-width:700px;margin:0 auto;" v-loading="loading">
        <el-table-column prop="rank" label="排名" width="70" />
        <el-table-column label="玩家">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;gap:8px;">
              <el-avatar :size="32">{{ row.username?.[0] }}</el-avatar>
              {{ row.username }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="completedLevels" label="通关数" width="100" />
        <el-table-column prop="totalStars" label="总星数" width="100" />
      </el-table>
      <div v-if="!loading && list.length === 0" style="text-align:center;color:#8b7355;margin-top:40px;">
        暂无数据，请先登录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const list = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/api/leaderboard')
    list.value = res.data?.data?.list || []
  } catch {
    // show local data fallback
    const saved = localStorage.getItem('gameProgress')
    if (saved) {
      const p = JSON.parse(saved)
      list.value = [{
        rank: 1,
        username: '本地玩家',
        completedLevels: p.completedLevels?.length || 0,
        totalStars: (Object.values(p.levelStars || {}) as number[]).reduce((a, b) => a + b, 0),
      }]
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.lb-page { width: 100vw; height: 100vh; overflow-y: auto; padding: 20px; background: linear-gradient(180deg, #87ceeb 0%, #f5f0e8 40%); }
.header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
.header h2 { color: #3e2723; margin: 0; }
.content { max-width: 800px; margin: 0 auto; }
</style>
