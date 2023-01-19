import type { Tile } from "./Tile"

export class Entity {
    tile: Tile
    sprite: number
    health: number
    isPlayer: boolean = false

    constructor(tile: Tile, sprite: number, health: number) {
        this.move(tile)
        this.sprite = sprite
        this.health = health
    }

    tryToMove(distanceX: number, distanceY: number) {
        let newTile = this.tile.getNeighbor(distanceX, distanceY)

        if (newTile.passable) {
            if (!newTile.entity) {
                this.move(newTile)
            }

            return true
        }
    }

    move(tile: Tile) {
        if (this.tile) {
            this.tile.entity = null
        }

        this.tile = tile
        tile.entity = this
    }
}

export class Player extends Entity {
    constructor(tile: Tile) {
        super(tile, 0, 3)
        this.isPlayer = true
    }
}

export class CoolDuck extends Entity {
    constructor(tile: Tile) {
        super(tile, 4, 3)
    }
}

export class DogWithMustache extends Entity {
    constructor(tile: Tile) {
        super(tile, 5, 1)
    }
}

export class Black extends Entity {
    constructor(tile: Tile) {
        super(tile, 6, 2)
    }
}

export class Slime extends Entity {
    constructor(tile: Tile) {
        super(tile, 7, 1)
    }
}

export class OneEyedDemon extends Entity {
    constructor(tile: Tile) {
        super(tile, 8, 3)
    }
}

export type Enemy =
    | typeof CoolDuck
    | typeof DogWithMustache
    | typeof Black
    | typeof Slime
    | typeof OneEyedDemon
