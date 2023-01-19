import type { Tile } from "./Tile"

export class Entity {
    tile: Tile
    sprite: number
    health: number
    isPlayer: boolean

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
