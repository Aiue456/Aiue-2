/**
 * Local storage helpers for guest mode and offline data persistence.
 */

const KEYS = {
  GAME_PROGRESS: 'gameProgress',
  AUTH: 'auth',
  SETTINGS: 'gameSettings',
} as const

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEYS.GAME_PROGRESS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProgress(data: any) {
  try {
    localStorage.setItem(KEYS.GAME_PROGRESS, JSON.stringify(data))
  } catch {
    // storage full or unavailable
  }
}

export function clearProgress() {
  localStorage.removeItem(KEYS.GAME_PROGRESS)
}

export function exportSave(): string {
  const data = {
    progress: loadProgress(),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

export function importSave(json: string): boolean {
  try {
    const data = JSON.parse(json)
    if (data.progress) {
      saveProgress(data.progress)
      return true
    }
    return false
  } catch {
    return false
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS)
    return raw ? JSON.parse(raw) : { musicVolume: 0.5, sfxVolume: 0.7 }
  } catch {
    return { musicVolume: 0.5, sfxVolume: 0.7 }
  }
}

export function saveSettings(settings: { musicVolume: number; sfxVolume: number }) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
}
