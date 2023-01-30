import type { Tile } from "../../Tile"
import { Entity } from "../Entity"
import type { Player } from "../Player"

export class OneEyedDemon extends Entity {
    constructor(tile: Tile) {
        super(tile, 8, 3)
    }

    public update(
        adjacentPassableTiles: Tile[],
        player: Player,
        getTileAtDistanceXY: (
            tile: Tile,
            distanceX: number,
            distanceY: number
        ) => Tile
    ): void {
        let startedStunned = this.isStunned

        super.update(adjacentPassableTiles, player, getTileAtDistanceXY)

        if (!startedStunned) {
            this.isStunned = true
        }
    }
}
