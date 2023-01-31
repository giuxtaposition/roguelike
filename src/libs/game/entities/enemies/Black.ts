import type { Tile } from "../../Tile"
import { Entity } from "../Entity"
import type { Player } from "../Player"

export class Black extends Entity {
    constructor(tile: Tile) {
        super(tile, 6, 2)
    }

    protected doEntityBehavior(
        adjacentTiles: Tile[],
        _: Player,
        getTileAtDistanceXY: (
            tile: Tile,
            distanceX: number,
            distanceY: number
        ) => Tile
    ) {
        let adjacentPassableTiles = adjacentTiles.filter(
            tile => tile.isPassable && (!tile.entity || tile.entity.isPlayer)
        )

        if (adjacentPassableTiles.length) {
            const { x: neighborX, y: neighborY } =
                adjacentPassableTiles[0].coordinates
            const { x: currentTileX, y: currentTileY } = this._tile.coordinates

            this.tryToMove(
                getTileAtDistanceXY(
                    this._tile,
                    neighborX - currentTileX,
                    neighborY - currentTileY
                )
            )
        }
    }
}
