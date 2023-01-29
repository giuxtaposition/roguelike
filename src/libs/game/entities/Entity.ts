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

    constructor(tile: Tile, sprite: number, health: number) {
        this.move(tile)
        this.sprite = sprite
        this.health = health
    }

    public update(
        adjacentTiles: Tile[],
        player: Player,
        getTileAtDistanceXY: (
            entity: Entity,
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

    protected move(tile: Tile) {
        if (this.tile) {
            this.tile.setEntity(null)
        }

        this.tile = tile
        tile.setEntity(this)
    }

    protected doEntityBehavior(
        adjacentTiles: Tile[],
        player: Player,
        getTileAtDistanceXY: (
            entity: Entity,
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
                    this,
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
