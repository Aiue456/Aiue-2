import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

export interface NoteItem {
  levelId: number
  noteText: string
  date: string
  earnedAt: number
}

export interface GameProgress {
  completedLevels: number[]
  levelStars: Record<number, number>
  notesCollection: NoteItem[]
  unlockedChapters: number[]
  totalPlayTime: number
  achievements: string[]
}

export const useGameStore = defineStore('game', () => {
  const progress = ref<GameProgress>({
    completedLevels: [],
    levelStars: {},
    notesCollection: [],
    unlockedChapters: [],
    totalPlayTime: 0,
    achievements: [],
  })
  const currentLevel = ref(0)

  const chapterFirstLevels = [1, 11, 31]

  const unlockedLevels = computed(() => {
    const maxUnlocked = Math.max(1, ...progress.value.completedLevels.map((l) => l + 1), 1)
    const sequential = Array.from({ length: Math.min(maxUnlocked, 60) }, (_, i) => i + 1)
    const set = new Set(sequential)
    chapterFirstLevels.forEach((l) => set.add(l))
    return Array.from(set).sort((a, b) => a - b)
  })

  const completedCount = computed(() => progress.value.completedLevels.length)
  const totalStars = computed(() => Object.values(progress.value.levelStars).reduce((a, b) => a + b, 0))

  const chapters = computed(() => {
    return [
      { id: 1, name: '第一章·初遇温暖', unlocked: true, levels: Array.from({ length: 10 }, (_, i) => i + 1) },
      { id: 2, name: '第二章·并肩前行', unlocked: true, levels: Array.from({ length: 20 }, (_, i) => i + 11) },
      { id: 3, name: '第三章·传承时光', unlocked: true, levels: Array.from({ length: 30 }, (_, i) => i + 31) },
    ]
  })

  function init() {
    const saved = localStorage.getItem('gameProgress')
    if (saved) {
      progress.value = JSON.parse(saved)
    }
    syncChapterUnlocks()
  }

  function save() {
    localStorage.setItem('gameProgress', JSON.stringify(progress.value))
  }

  function syncChapterUnlocks() {
    const total = progress.value.completedLevels.length
    const unlocked: number[] = []
    if (total >= 10) unlocked.push(1)
    if (total >= 30) unlocked.push(2)
    if (total >= 60) unlocked.push(3)
    progress.value.unlockedChapters = unlocked
  }

  function completeLevel(levelId: number, stars: number) {
    if (!progress.value.completedLevels.includes(levelId)) {
      progress.value.completedLevels.push(levelId)
    }
    const prev = progress.value.levelStars[levelId] || 0
    if (stars > prev) {
      progress.value.levelStars[levelId] = stars
    }
    syncChapterUnlocks()
    save()
  }

  function addNote(item: NoteItem) {
    if (!progress.value.notesCollection.find((n) => n.levelId === item.levelId)) {
      progress.value.notesCollection.push(item)
      save()
    }
  }

  async function uploadSave() {
    try {
      await api.post('/api/save', progress.value)
    } catch { /* offline */ }
  }

  async function downloadSave() {
    try {
      const res = await api.get('/api/save')
      if (res.data?.data) {
        progress.value = { ...progress.value, ...res.data.data }
        save()
      }
    } catch { /* offline */ }
  }

  return { progress, currentLevel, unlockedLevels, completedCount, totalStars, chapters, init, save, completeLevel, addNote, syncChapterUnlocks, uploadSave, downloadSave }
})
