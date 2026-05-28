<template>
  <div class="levels-page">
    <div class="header">
      <el-button text @click="$router.push('/')">← 返回首页</el-button>
      <h2>关卡选择</h2>
      <div class="progress-info">已通关 {{ game.completedCount }} 关 | ⭐ {{ game.totalStars }}</div>
    </div>

    <!-- Chapters -->
    <div class="chapters">
      <div v-for="chap in game.chapters" :key="chap.id" class="chapter">
        <h3 :class="{ locked: !chap.unlocked }">
          {{ chap.name }}
          <el-tag v-if="!chap.unlocked" size="small" type="info">未解锁</el-tag>
        </h3>
        <div class="level-grid">
          <div
            v-for="lvl in chap.levels"
            :key="lvl"
            class="level-card"
            :class="{
              completed: game.progress.completedLevels.includes(lvl),
              locked: !game.unlockedLevels.includes(lvl),
              current: lvl === game.progress.completedLevels.length + 1,
            }"
            @click="playLevel(lvl)"
          >
            <div class="level-id">{{ lvl }}</div>
            <div class="level-stars" v-if="game.progress.levelStars[lvl]">
              {{ '★'.repeat(game.progress.levelStars[lvl]) }}
            </div>
            <div class="level-status" v-else-if="!game.unlockedLevels.includes(lvl)">
              🔒
            </div>
            <div class="level-title">{{ getLevelTitle(lvl) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { sampleLevels } from '@/utils/levelData'

const router = useRouter()
const game = useGameStore()

function getLevelTitle(id: number): string {
  return sampleLevels.find((l) => l.id === id)?.title || `第${id}关`
}

function playLevel(id: number) {
  if (game.unlockedLevels.includes(id)) {
    router.push(`/play/${id}`)
  }
}
</script>

<style scoped>
.levels-page {
  width: 100vw; height: 100vh;
  overflow-y: auto; padding: 20px;
  background: linear-gradient(180deg, #87ceeb 0%, #f5f0e8 40%);
}
.header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
.header h2 { color: #3e2723; margin: 0; }
.progress-info { color: #8b7355; font-size: 14px; margin-left: auto; }
.chapters { max-width: 900px; margin: 0 auto; }
.chapter { margin-bottom: 32px; }
.chapter h3 { color: #5b3a29; margin-bottom: 12px; }
.chapter h3.locked { color: #aaa; }
.level-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
.level-card {
  background: white; border-radius: 12px; padding: 16px;
  text-align: center; cursor: pointer; transition: all 0.2s;
  border: 2px solid #e8dcc8;
}
.level-card:hover:not(.locked) { border-color: #5b8c5a; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.level-card.completed { border-color: #ffd700; background: #fffef5; }
.level-card.current { border-color: #5b8c5a; animation: pulse 1.5s infinite; }
.level-card.locked { opacity: 0.5; cursor: not-allowed; }
.level-id { font-size: 20px; font-weight: bold; color: #3e2723; }
.level-stars { color: #ffd700; font-size: 12px; margin-top: 4px; }
.level-status { font-size: 18px; margin-top: 4px; }
.level-title { font-size: 11px; color: #8b7355; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(91,140,90,0.4); } 50% { box-shadow: 0 0 0 6px rgba(91,140,90,0); } }
</style>
