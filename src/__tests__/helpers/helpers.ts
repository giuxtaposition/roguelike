import type { Entity } from "../../libs/game/entities/Entity"
import type { Player } from "../../libs/game/entities/Player"
import type { Floor } from "../../libs/game/Tile"

export function update(
    enemy: Entity,
    adjacentPassableTiles: Floor[],
    player: Player,
    getTileAtDistanceXY,
    numberOfTimes
) {
    for (let index = 0; index < numberOfTimes; index++) {
        enemy.update(adjacentPassableTiles, player, getTileAtDistanceXY)
    }
}
