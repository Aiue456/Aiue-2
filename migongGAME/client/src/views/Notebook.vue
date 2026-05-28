<template>
  <div class="notebook-page">
    <GameContainer scene="NotebookScene" @navigate="handleNavigate" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import GameContainer from '@/components/GameContainer.vue'

const router = useRouter()

function handleNavigate(e: CustomEvent) {
  router.push(e.detail)
}
</script>

<style scoped>
.notebook-page {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: #1a1a2e;
}
</style>
