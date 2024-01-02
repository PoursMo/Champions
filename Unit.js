class UnitController {
  constructor() {}

  move(x, y) {
    if (Phaser.Math.Distance.Between(this.unit.x, this.unit.y, x, y) > 32) {
      this.unit.play({ key: "Run", repeat: -1 });
      if (this.unit.x < x) this.unit.flipX = false;
      else if (this.unit.x > x) this.unit.flipX = true;
      game.scene.scenes[0].tweens.add({
        targets: this.unit,
        duration: 1000,
        x: x,
        y: y - 16,
        completeDelay: 100,
        onComplete: () => this.unit.play({ key: "Idle", repeat: -1 }),
      });
    }
  }
}
