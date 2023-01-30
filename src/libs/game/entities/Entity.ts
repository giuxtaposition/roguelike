import type { Tile } from "../Tile"
import type { Player } from "./Player"

export abstract class Entity {
    static readonly maxHealth = 6
    protected tile: Tile
    protected sprite: number
    protected health: number
    protected isPlayer: boolean = false
    protected isAlive: boolean = true
    protected hasAttackedThisTurn: boolean = false
    protected isStunned: boolean = false
    protected teleportCounter: number = 2
    protected offsetX = 0
    protected offsetY = 0

    constructor(tile: Tile, sprite: number, health: number) {
        this.move(tile)
        this.sprite = sprite
        this.health = health
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
        this.teleportCounter--

        if (this.teleportCounter > 0) {
            return
        }

        if (this.isStunned) {
            this.isStunned = false
            return
        }

        this.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)
    }

    public tryToMove(destinationTile: Tile) {
        if (destinationTile.getIsPassable()) {
            if (!destinationTile.getEntity()) {
                this.move(destinationTile)
            } else {
                if (
                    destinationTile.getEntity().getIsPlayer() !== this.isPlayer
                ) {
                    this.hasAttackedThisTurn = true
                    destinationTile.getEntity().isStunned = true
                    destinationTile.getEntity().receiveDamage(1)

                    const { x: currentTileX, y: currentTileY } =
                        this.tile.getCoordinates()
                    const { x: newTileX, y: newTileY } =
                        destinationTile.getCoordinates()

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
        this.health -= damage

        if (this.health <= 0) {
            this.die()
        }
    }

    public getTeleportCounter() {
        return this.teleportCounter
    }

    public getIsStunned() {
        return this.isStunned
    }

    public getTile() {
        return this.tile
    }

    public getIsAlive() {
        return this.isAlive
    }

    public getIsPlayer() {
        return this.isPlayer
    }

    public getHealth() {
        return this.health
    }

    public getSprite() {
        return this.sprite
    }

    public smoothMoveAnimation() {
        this.offsetX -= Math.sign(this.offsetX) * (1 / 8)
        this.offsetY -= Math.sign(this.offsetY) * (1 / 8)
    }

    public getOffsetX() {
        return this.offsetX
    }

    public getOffsetY() {
        return this.offsetY
    }

    public getDisplayCoordinates() {
        const { x, y } = this.tile.getCoordinates()
        return { x: x + this.offsetX, y: y + this.offsetY }
    }

    protected bumpAnimation(
        newTileX: number,
        currentTileX: number,
        newTileY: number,
        currentTileY: number
    ) {
        this.offsetX = (newTileX - currentTileX) / 2
        this.offsetY = (newTileY - currentTileY) / 2
    }

    protected move(newTile: Tile) {
        if (this.tile) {
            this.tile.setEntity(null)
            const { x: currentTileX, y: currentTileY } =
                this.tile.getCoordinates()
            const { x: newTileX, y: newTileY } = newTile.getCoordinates()

            this.offsetX = currentTileX - newTileX
            this.offsetY = currentTileY - newTileY
        }
        this.tile = newTile
        newTile.setEntity(this)
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
            tile =>
                tile.getIsPassable() &&
                (!tile.getEntity() || tile.getEntity().getIsPlayer())
        )

        if (adjacentPassableTiles.length) {
            adjacentPassableTiles.sort(
                (a, b) => a.distance(player.tile) - b.distance(player.tile)
            )

            const { x: newTileX, y: newTileY } =
                adjacentPassableTiles[0].getCoordinates()
            const { x: currentTileX, y: currentTileY } =
                this.tile.getCoordinates()

            this.tryToMove(
                getTileAtDistanceXY(
                    this.getTile(),
                    newTileX - currentTileX,
                    newTileY - currentTileY
                )
            )
        }
    }

    protected receiveHealth(health: number) {
        this.health = Math.min(Entity.maxHealth, this.health + health)
    }

    protected die() {
        this.isAlive = false
        this.tile.setEntity(null)
        this.sprite = 1
    }
}
