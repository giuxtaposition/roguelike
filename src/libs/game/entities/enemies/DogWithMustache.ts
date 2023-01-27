import type { Tile } from "../../Tile"
import { Entity } from "../Entity"
import type { Player } from "../Player"

export class DogWithMustache extends Entity {
    constructor(tile: Tile) {
        super(tile, 5, 1)
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
        this.hasAttackedThisTurn = false
        super.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)

        if (!this.hasAttackedThisTurn) {
            super.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)
        }
    }
}
