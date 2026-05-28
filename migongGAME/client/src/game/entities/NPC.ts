import Phaser from 'phaser'
import { TILE_SIZE } from '../config'

const CARDINAL_DIRS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

export class NPC {
  sprite: Phaser.Physics.Arcade.Sprite
  private scene: Phaser.Scene
  private moveSpeed = 60
  private moveTimer = 0
  private direction = { x: 0, y: 0 }
  private exclamationMark!: Phaser.GameObjects.Text
  private stuckTimer = 0
  private prevX = 0
  private prevY = 0
  name: string
  dialog: string
  mission: string

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    tileY: number,
    config: { name: string; dialog: string; mission: string }
  ) {
    this.scene = scene
    this.name = config.name
    this.dialog = config.dialog
    this.mission = config.mission

    const px = tileX * TILE_SIZE + TILE_SIZE / 2
    const py = tileY * TILE_SIZE + TILE_SIZE / 2
    this.prevX = px
    this.prevY = py

    if (!scene.textures.exists('npc_char')) {
      const gfx = scene.add.graphics()
      gfx.fillStyle(0xe8a87c)
      gfx.fillCircle(TILE_SIZE / 2, TILE_SIZE / 3, TILE_SIZE / 3)
      gfx.fillStyle(0xff6b6b)
      gfx.fillRect(TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 3)
      gfx.fillStyle(0x4444aa)
      gfx.fillRect(TILE_SIZE / 4, TILE_SIZE * 0.8, TILE_SIZE / 4, TILE_SIZE / 5)
      gfx.fillRect(TILE_SIZE / 2, TILE_SIZE * 0.8, TILE_SIZE / 4, TILE_SIZE / 5)
      gfx.fillStyle(0x333333)
      gfx.fillCircle(TILE_SIZE / 2 - 3, TILE_SIZE / 3 - 2, 2)
      gfx.fillCircle(TILE_SIZE / 2 + 3, TILE_SIZE / 3 - 2, 2)
      gfx.generateTexture('npc_char', TILE_SIZE, TILE_SIZE)
      gfx.destroy()
    }

    this.sprite = scene.physics.add.sprite(px, py, 'npc_char')
    this.sprite.setDepth(5)
    this.sprite.setCollideWorldBounds(true)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setSize(TILE_SIZE * 0.7, TILE_SIZE * 0.7)
    body.setOffset(TILE_SIZE * 0.15, TILE_SIZE * 0.15)
    body.setImmovable(true)

    this.exclamationMark = scene.add.text(this.sprite.x, this.sprite.y - TILE_SIZE, '💬', {
      fontSize: '16px',
    }).setOrigin(0.5).setDepth(6).setAlpha(0)

    scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 3,
      duration: 600 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.pickNewDirection()
  }

  private pickNewDirection() {
    const d = CARDINAL_DIRS[Math.floor(Math.random() * 4)]
    this.direction = d
    this.moveTimer = 800 + Math.random() * 1500
    this.stuckTimer = 0
  }

  update(playerX: number, playerY: number) {
    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, playerX, playerY)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body

    if (dist < TILE_SIZE * 3) {
      this.exclamationMark.setPosition(this.sprite.x, this.sprite.y - TILE_SIZE * 0.8)
      this.exclamationMark.setAlpha(1)
    } else {
      this.exclamationMark.setAlpha(0)
    }

    if (this.moveTimer > 0) {
      this.moveTimer -= this.scene.game.loop.delta

      // Stuck detection: if barely moved in 500ms, pick a new direction
      this.stuckTimer += this.scene.game.loop.delta
      if (this.stuckTimer > 500) {
        const moved = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.prevX, this.prevY)
        if (moved < 2) {
          this.pickNewDirection()
        }
        this.prevX = this.sprite.x
        this.prevY = this.sprite.y
        this.stuckTimer = 0
      }

      body.setVelocity(
        this.direction.x * this.moveSpeed,
        this.direction.y * this.moveSpeed
      )
    } else {
      body.setVelocity(0)
      this.pickNewDirection()
    }
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y }
  }
}
