<template>
  <div ref="gameContainer" class="game-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { createGameConfig } from '@/game/config'

const props = defineProps<{
  scene: string
  sceneData?: Record<string, any>
}>()

const emit = defineEmits<{
  navigate: [e: CustomEvent]
  levelComplete: [e: CustomEvent]
}>()

const gameContainer = ref<HTMLElement>()
let game: Phaser.Game | null = null

onMounted(() => {
  if (!gameContainer.value) return

  // Store target scene so BootScene can read it
  ;(window as any).__TARGET_SCENE__ = props.scene
  ;(window as any).__TARGET_SCENE_DATA__ = props.sceneData

  game = new Phaser.Game({
    ...createGameConfig('game-container', 1),
    parent: gameContainer.value,
  })

  window.addEventListener('navigate', onNavigate)
  window.addEventListener('levelComplete', onLevelComplete)
})

onUnmounted(() => {
  window.removeEventListener('navigate', onNavigate)
  window.removeEventListener('levelComplete', onLevelComplete)
  delete (window as any).__TARGET_SCENE__
  delete (window as any).__TARGET_SCENE_DATA__
  game?.destroy(true)
  game = null
})

function onNavigate(e: Event) {
  emit('navigate', e as CustomEvent)
}

function onLevelComplete(e: Event) {
  emit('levelComplete', e as CustomEvent)
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.game-container :deep(canvas) {
  display: block;
}
</style>
