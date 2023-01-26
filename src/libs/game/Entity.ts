import type { Tile } from "./Tile"

export abstract class Entity {
    tile: Tile
    sprite: number
    health: number
    isPlayer: boolean = false
    isAlive: boolean = true

    constructor(tile: Tile, sprite: number, health: number) {
        this.move(tile)
        this.sprite = sprite
        this.health = health
    }

    public update(
        adjacentPassableTiles: Tile[],
        player: Player,
        tryToMove: (
            entity: Entity,
            distanceX: number,
            distanceY: number
        ) => void
    ) {
        this.getCloserToPlayer(adjacentPassableTiles, player, tryToMove)
    }

    public move(tile: Tile) {
        if (this.tile) {
            this.tile.entity = null
        }

        this.tile = tile
        tile.entity = this
    }

    private getCloserToPlayer(
        adjacentPassableTiles: Tile[],
        player: Player,
        tryToMove: (
            entity: Entity,
            distanceX: number,
            distanceY: number
        ) => void
    ) {
        adjacentPassableTiles = adjacentPassableTiles.filter(
            t => !t.entity || t.entity.isPlayer
        )

        if (adjacentPassableTiles.length) {
            adjacentPassableTiles.sort(
                (a, b) => a.distance(player.tile) - b.distance(player.tile)
            )

            let newTile = adjacentPassableTiles[0]
            tryToMove(this, newTile.x - this.tile.x, newTile.y - this.tile.y)
        }
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
