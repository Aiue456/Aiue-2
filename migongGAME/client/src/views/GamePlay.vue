<template>
  <div class="gameplay-page">
    <GameContainer :scene="'GameScene'" :sceneData="{ levelId }" @navigate="handleNavigate" @levelComplete="onLevelComplete" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import GameContainer from '@/components/GameContainer.vue'

const route = useRoute()
const router = useRouter()
const game = useGameStore()
const levelId = Number(route.params.id) || 1

function handleNavigate(e: CustomEvent) {
  router.push(e.detail)
}

function onLevelComplete(e: CustomEvent) {
  const { levelId: lId, stars } = e.detail
  game.completeLevel(lId, stars)
  if (e.detail.postNote) {
    game.addNote({
      levelId: lId,
      noteText: e.detail.postNote,
      date: e.detail.noteDate || '',
      earnedAt: Date.now(),
    })
  }
  game.uploadSave()
}
</script>

<style scoped>
.gameplay-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a2e;
}
</style>
