import type { Entity } from "./entities/Entity"
import type Game from "./Game"
import { GameState } from "./Game"
import type Map from "./Map"

export abstract class Tile {
    private x: number
    private y: number
    private sprite: number
    private isPassable: boolean
    private entity?: Entity
    private map: Map

    constructor(
        x: number,
        y: number,
        sprite: number,
        passable: boolean,
        map: Map
    ) {
        this.x = x
        this.y = y
        this.sprite = sprite
        this.isPassable = passable
        this.map = map
    }

    //manhattan distance
    public distance(other: Tile) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
    }

    public replace(newTileType: typeof Floor | typeof Wall) {
        this.map.getTiles()[this.x][this.y] = new newTileType(
            this.x,
            this.y,
            this.map
        )
    }

    public getEntity() {
        return this.entity
    }

    public setEntity(entity: Entity | null) {
        this.entity = entity
    }

    public getCoordinates() {
        return { x: this.x, y: this.y }
    }

    public getIsPassable() {
        return this.isPassable
    }

    public getSprite() {
        return this.sprite
    }
}

export class Floor extends Tile {
    constructor(x: number, y: number, map: Map) {
        super(x, y, 2, true, map)
    }
}

export class Wall extends Tile {
    constructor(x: number, y: number, map: Map) {
        super(x, y, 3, false, map)
    }
}

export class Exit extends Tile {
    constructor(x: number, y: number, map: Map) {
        super(x, y, 11, true, map)
    }
}
