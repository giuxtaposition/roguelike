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
            entity: Entity,
            distanceX: number,
            distanceY: number
        ) => Tile
    ) {
        let adjacentPassableTiles = adjacentTiles.filter(
            tile =>
                tile.getIsPassable() &&
                (!tile.getEntity() || tile.getEntity().getIsPlayer())
        )

        if (adjacentPassableTiles.length) {
            const { x: neighborX, y: neighborY } =
                adjacentPassableTiles[0].getCoordinates()
            const { x: currentTileX, y: currentTileY } =
                this.tile.getCoordinates()

            this.tryToMove(
                getTileAtDistanceXY(
                    this,
                    neighborX - currentTileX,
                    neighborY - currentTileY
                )
            )
        }
    }
}
