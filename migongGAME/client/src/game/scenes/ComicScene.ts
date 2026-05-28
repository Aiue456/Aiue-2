import Phaser from 'phaser'

export class ComicScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ComicScene' })
  }

  create(data: { panels: string[]; onComplete: () => void }) {
    const { width, height } = this.scale
    let currentPanel = 0

    const drawPanel = (index: number) => {
      this.children.removeAll()

      this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

      // Panel frame
      const frameW = width * 0.8
      const frameH = height * 0.7
      this.add.rectangle(width / 2, height / 2, frameW, frameH, 0x2a2a4e).setStrokeStyle(3, 0x5b8c5a)

      // Panel content area
      const contentW = frameW - 40
      const contentH = frameH - 40
      this.add.rectangle(width / 2, height / 2, contentW, contentH, 0xffffff)

      // Story text based on panel
      const texts = [
        '那年秋天，我转学到了这所老学校...',
        '操场边的老槐树下，总是有人需要帮助',
        '我开始了一段奇妙的旅程——',
        '在迷宫中穿行，帮助每一个需要帮助的人',
      ]
      this.add.text(width / 2, height / 2, texts[index] || '', {
        fontSize: '18px', fontFamily: 'Noto Sans SC', color: '#3e2723', wordWrap: { width: contentW - 40 }, align: 'center',
      }).setOrigin(0.5)

      // Navigation
      this.add.text(width / 2, height * 0.85, '点击继续 ▸', {
        fontSize: '14px', fontFamily: 'Noto Sans SC', color: '#8b7355',
      }).setOrigin(0.5)

      this.input.once('pointerdown', () => {
        if (currentPanel < 3) {
          currentPanel++
          drawPanel(currentPanel)
        } else {
          data.onComplete?.()
          this.scene.stop()
        }
      })
    }

    drawPanel(0)
  }
}
