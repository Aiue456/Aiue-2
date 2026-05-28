import Phaser from 'phaser'
import { TILE_SIZE } from '../config'

export class Hazard {
  sprite: Phaser.Physics.Arcade.Sprite
  private scene: Phaser.Scene
  private patrolPath: { x: number; y: number }[]
  private currentTarget = 0
  speed = 80

  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    this.scene = scene

    // Generate texture
    if (!scene.textures.exists('hazard')) {
      const gfx = scene.add.graphics()
      gfx.fillStyle(0xcc4444)
      gfx.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 3)
      gfx.fillStyle(0xff6666)
      gfx.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 5)
      gfx.lineStyle(2, 0xaa2222)
      gfx.strokeCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 3)
      gfx.generateTexture('hazard', TILE_SIZE, TILE_SIZE)
      gfx.destroy()
    }

    const px = tileX * TILE_SIZE + TILE_SIZE / 2
    const py = tileY * TILE_SIZE + TILE_SIZE / 2

    this.sprite = scene.physics.add.sprite(px, py, 'hazard')
    this.sprite.setDepth(4)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setSize(TILE_SIZE * 0.6, TILE_SIZE * 0.6)
    body.setOffset(TILE_SIZE * 0.2, TILE_SIZE * 0.2)
    body.setImmovable(true)

    // Patrol points around spawn
    this.patrolPath = [
      { x: px, y: py },
      { x: px + TILE_SIZE * 2, y: py },
      { x: px + TILE_SIZE * 2, y: py + TILE_SIZE * 2 },
      { x: px, y: py + TILE_SIZE * 2 },
      { x: px - TILE_SIZE * 2, y: py },
      { x: px, y: py - TILE_SIZE * 2 },
    ]

    // Pulsing animation
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  update() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    const target = this.patrolPath[this.currentTarget]
    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y, target.x, target.y
    )

    if (dist < 4) {
      this.currentTarget = (this.currentTarget + 1) % this.patrolPath.length
    } else {
      const angle = Phaser.Math.Angle.Between(
        this.sprite.x, this.sprite.y, target.x, target.y
      )
      body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed)
    }
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y }
  }
}
