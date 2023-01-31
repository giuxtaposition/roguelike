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
            tile: Tile,
            distanceX: number,
            distanceY: number
        ) => Tile
    ) {
        this._hasAttackedThisTurn = false
        super.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)

        if (!this._hasAttackedThisTurn) {
            super.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)
        }
    }
}
