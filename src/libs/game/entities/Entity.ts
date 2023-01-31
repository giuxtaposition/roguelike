import { playSound } from "../../stores/sounds"
import type { Tile } from "../Tile"
import type { Player } from "./Player"

export abstract class Entity {
    static readonly maxHealth = 6
    protected _isPlayer: boolean = false
    protected _isAlive: boolean = true
    protected _hasAttackedThisTurn: boolean = false
    protected _isStunned: boolean = false
    protected _teleportCounter: number = 2
    protected _offsetX = 0
    protected _offsetY = 0

    protected _tile: Tile
    protected _sprite: number
    protected _health: number

    constructor(tile: Tile, sprite: number, health: number) {
        this.move(tile)
        this._sprite = sprite
        this._health = health
    }

    public update(
        adjacentTiles: Tile[],
        player: Player,
        getTileAtDistanceXY: (
            tile: Tile,
            distanceX: number,
            distanceY: number
        ) => Tile
    ) {
        this._teleportCounter--

        if (this._teleportCounter > 0) {
            return
        }

        if (this._isStunned) {
            this._isStunned = false
            return
        }

        this.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)
    }

    public tryToMove(destinationTile: Tile) {
        if (destinationTile.isPassable) {
            if (!destinationTile.entity) {
                this.move(destinationTile)
            } else {
                if (destinationTile.entity.isPlayer !== this._isPlayer) {
                    this._hasAttackedThisTurn = true
                    destinationTile.entity._isStunned = true
                    destinationTile.entity.receiveDamage(1)

                    const { x: currentTileX, y: currentTileY } =
                        this._tile.coordinates
                    const { x: newTileX, y: newTileY } =
                        destinationTile.coordinates

                    this.bumpAnimation(
                        newTileX,
                        currentTileX,
                        newTileY,
                        currentTileY
                    )
                }
            }

            return true
        }
    }

    public receiveDamage(damage: number) {
        this._health -= damage

        if (this._health <= 0) {
            this.die()
        }

        if (this._isPlayer) {
            playSound("hit1")
        } else {
            playSound("hit2")
        }
    }

    public receiveHealth(health: number) {
        this._health = Math.min(Entity.maxHealth, this._health + health)
    }

    public smoothMoveAnimation() {
        this._offsetX -= Math.sign(this._offsetX) * (1 / 8)
        this._offsetY -= Math.sign(this._offsetY) * (1 / 8)
    }

    public get offsetX() {
        return this._offsetX
    }

    public get offsetY() {
        return this._offsetY
    }

    public get displayCoordinates() {
        const { x, y } = this._tile.coordinates
        return { x: x + this._offsetX, y: y + this._offsetY }
    }

    public get teleportCounter() {
        return this._teleportCounter
    }

    public get isStunned() {
        return this._isStunned
    }

    public get tile() {
        return this._tile
    }

    public get isAlive() {
        return this._isAlive
    }

    public get isPlayer() {
        return this._isPlayer
    }

    public get health() {
        return this._health
    }

    public set health(health: number) {
        this._health = health
    }

    public get sprite() {
        return this._sprite
    }

    protected bumpAnimation(
        newTileX: number,
        currentTileX: number,
        newTileY: number,
        currentTileY: number
    ) {
        this._offsetX = (newTileX - currentTileX) / 2
        this._offsetY = (newTileY - currentTileY) / 2
    }

    protected move(newTile: Tile) {
        if (this._tile) {
            this._tile.entity = null
            const { x: currentTileX, y: currentTileY } = this._tile.coordinates
            const { x: newTileX, y: newTileY } = newTile.coordinates

            this._offsetX = currentTileX - newTileX
            this._offsetY = currentTileY - newTileY
        }
        this._tile = newTile
        newTile.entity = this
    }

    protected doEntityBehavior(
        adjacentTiles: Tile[],
        player: Player,
        getTileAtDistanceXY: (
            tile: Tile,
            distanceX: number,
            distanceY: number
        ) => Tile
    ) {
        const adjacentPassableTiles = adjacentTiles.filter(
            tile => tile.isPassable && (!tile.entity || tile.entity.isPlayer)
        )

        if (adjacentPassableTiles.length) {
            adjacentPassableTiles.sort(
                (a, b) => a.distance(player._tile) - b.distance(player._tile)
            )

            const { x: newTileX, y: newTileY } =
                adjacentPassableTiles[0].coordinates
            const { x: currentTileX, y: currentTileY } = this._tile.coordinates

            this.tryToMove(
                getTileAtDistanceXY(
                    this._tile,
                    newTileX - currentTileX,
                    newTileY - currentTileY
                )
            )
        }
    }

    protected die() {
        this._isAlive = false
        this._tile.entity = null
        this._sprite = 1
    }
}
