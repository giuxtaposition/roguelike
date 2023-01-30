import { type Tile, Floor } from "../../Tile"
import { Entity } from "../Entity"
import type { Player } from "../Player"
import Map from "../../Map"

export class Slime extends Entity {
    constructor(tile: Tile) {
        super(tile, 7, 1)
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
        const walls = adjacentTiles.filter(
            tile =>
                !tile.getIsPassable() &&
                Map.inBounds(tile.getCoordinates().x, tile.getCoordinates().y)
        )

        if (walls.length) {
            walls[0].replace(Floor)
            this.receiveHealth(0.5)
        } else {
            super.doEntityBehavior(adjacentTiles, player, getTileAtDistanceXY)
        }
    }
}
