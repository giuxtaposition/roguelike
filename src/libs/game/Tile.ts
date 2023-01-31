import type { Entity } from "./entities/Entity"
import type Map from "./Map"

export abstract class Tile {
    private _x: number
    private _y: number
    private _sprite: number
    private _effect: number
    private _effectCounter: number
    private _entity?: Entity
    private _map: Map
    private _hasTreasure: boolean = false
    private _isPassable: boolean

    constructor(
        x: number,
        y: number,
        sprite: number,
        passable: boolean,
        map: Map
    ) {
        this._x = x
        this._y = y
        this._sprite = sprite
        this._isPassable = passable
        this._map = map
    }

    //manhattan distance
    public distance(other: Tile) {
        return Math.abs(this._x - other._x) + Math.abs(this._y - other._y)
    }

    public replace(newTileType: typeof Floor | typeof Wall) {
        this._map.tiles[this._x][this._y] = new newTileType(
            this._x,
            this._y,
            this._map
        )
    }

    public get effect() {
        return this._effect
    }

    public set effect(effectSprite: number) {
        this._effect = effectSprite
        this._effectCounter = 35
    }

    public get effectCounter() {
        return this._effectCounter
    }

    public set effectCounter(effectCounter: number) {
        this._effectCounter = effectCounter
    }

    public get hasTreasure() {
        return this._hasTreasure
    }

    public set hasTreasure(treasure: boolean) {
        this._hasTreasure = treasure
    }

    public get entity() {
        return this._entity
    }

    public set entity(entity: Entity | null) {
        this._entity = entity
    }

    public get coordinates() {
        return { x: this._x, y: this._y }
    }

    public get isPassable() {
        return this._isPassable
    }

    public get sprite() {
        return this._sprite
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
