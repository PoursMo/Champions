class Archer extends Unit {
  constructor(startPositionX, startPositionY) {
    super();
    this.unit = game.scene.scenes[0].add.sprite(startPositionX, startPositionY);
    this.unit.anims.createFromAseprite("archer");
    this.unit.play({ key: "Idle", repeat: -1 });
  }
}
