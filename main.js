class TheGame extends Phaser.Scene {
  preload() {
    this.load.aseprite("warrior", "Assets/Blue/Warrior_Blue.png", "Assets/Blue/Warrior_Blue.json");
    this.load.aseprite("archer", "Assets/Blue/Archer_Blue.png", "Assets/Blue/Archer_Blue.json");
    // this.load.aseprite("goblin", "Assets/Torch_Red.png", "Assets/Torch_Red.json");
    this.load.aseprite("waterFoam", "Assets/Tilemap/Foam.png", "Assets/Tilemap/Foam.json");
    this.load.image("gridPointer", "Assets/UI/02.png");
    this.load.image("flat", "Assets/Tilemap/Tilemap_Flat.png");
    this.load.image("water", "Assets/Tilemap/Water.png");
    this.load.image("elevation", "Assets/Tilemap/Tilemap_Elevation.png");
    this.load.tilemapTiledJSON("map", "Assets/Tilemap/Tilemap.json");
  }

  create() {
    //Change cursor
    this.input.setDefaultCursor("url(Assets/UI/01.png), pointer");
    //remove right click menu
    this.input.mouse.disableContextMenu();
    //set camera Bounds
    this.cameras.main.setBounds(0, 0, 1920, 1280);
    //Tilemap
    const map = this.make.tilemap({ key: "map", tileWidth: 64, tileHeight: 64 });
    const elevation = map.addTilesetImage("Tilemap_Elevation", "elevation");
    const flat = map.addTilesetImage("Tilemap_Flat", "flat");
    const water = map.addTilesetImage("Water", "water");
    map.createLayer("Water", water, 0, 0).setDepth(-5);
    this.grid = [];
    const level0Layer = map.createLayer("Level0", flat, 0, 0).setDepth(0);
    level0Layer.forEachTile((tile) => {
      //Water Foam on edges
      if ([33, 34, 35, 43, 45, 53, 54, 55].includes(tile.index)) {
        const waterFoam = this.add.sprite(tile.x * 64 + 32, tile.y * 64 + 32);
        waterFoam.anims.createFromAseprite("waterFoam");
        waterFoam.play({ key: "Foam", repeat: -1 });
        waterFoam.depth = -4;
      }
      //Grid
      if (tile.index != -1)
        this.grid.push(
          this.add.rectangle(tile.x * 64 + 32, tile.y * 64 + 32, 60, 60, "0x000000", 0.1)
        );
    });
    const cliffs0Layer = map.createLayer("Cliffs0", elevation, 0, 0).setDepth(0);
    cliffs0Layer.forEachTile((tile) => {
      if ([29, 30, 31].includes(tile.index))
        this.grid.push(
          this.add.rectangle(tile.x * 64 + 32, tile.y * 64 + 32, 60, 60, "0x000000", 0.1)
        );
    });
    const level1Layer = map.createLayer("Level1", flat, 0, 0).setDepth(0);
    level1Layer.forEachTile((tile) => {
      if (tile.index != -1)
        this.grid.push(
          this.add.rectangle(tile.x * 64 + 32, tile.y * 64 + 32, 60, 60, "0x000000", 0.1)
        );
    });
    //Zoom with scroll wheel
    const camera = this.cameras.main;
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      // Get the current world point under pointer.
      const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
      const newZoom = camera.zoom - camera.zoom * 0.001 * deltaY;
      camera.zoom = Phaser.Math.Clamp(newZoom, 0.55, 2);
      // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
      camera.preRender();
      const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);
      // Scroll the camera to keep the pointer under the same world point.
      camera.scrollX -= newWorldPoint.x - worldPoint.x;
      camera.scrollY -= newWorldPoint.y - worldPoint.y;
    });
    //Grid Pointer
    this.gridPointer = this.add.sprite(0, 0, "gridPointer");
    this.tweens.add({
      targets: this.gridPointer,
      ease: "Sine.In",
      scaleX: 0.85,
      scaleY: 0.85,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
    //Warrior
    // this.selectedUnit = this.add.sprite(0, 0);
    // this.selectedUnit.anims.createFromAseprite("warrior");
    // this.selectedUnit.play({ key: "Idle", repeat: -1 });
    // this.selectedUnit.controller = new Warrior();
    // this.input.on("pointerdown", (pointer) => {
    //   if (pointer.rightButtonDown()) this.selectedUnit.controller.move(this.cellX, this.cellY);
    // });
    //Archer
  }

  update() {
    //Move camera depending on pointer position when middle button is down
    if (this.input.activePointer.middleButtonDown()) {
      this.cameras.main.scrollX += (game.input.mousePointer.x - config.width / 2) * scrollSpeed;
      this.cameras.main.scrollY += (game.input.mousePointer.y - config.height / 2) * scrollSpeed;
    }
    //calculate which cell the mouser is over
    const worldPoint = this.cameras.main.getWorldPoint(
      game.input.mousePointer.x,
      game.input.mousePointer.y
    );
    this.cellX = Phaser.Math.FloorTo(worldPoint.x / 64) * 64 + 32;
    this.cellY = Phaser.Math.FloorTo(worldPoint.y / 64) * 64 + 32;
    //cursor rectangle position
    this.gridPointer.x = this.cellX;
    this.gridPointer.y = this.cellY;
  }
}

const scrollSpeed = 0.1;

const config = {
  type: Phaser.AUTO,
  width: 1050,
  height: 700,
  zoom: 0.9,
  scene: TheGame,
  autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  pixelArt: true,
};

const game = new Phaser.Game(config);
