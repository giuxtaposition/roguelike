import { Floor } from "../../../../../libs/game/Tile"
import Map from "../../../../../libs/game/Map"
import { DogWithMustache } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import { vi } from "vitest"
import { update } from "../../../../helpers/helpers"

describe("DogWithMustache", () => {
    const map = new Map()

    test("new DogWithMustache should have sprite 5 and health 1", () => {
        const dogWithMustache = new DogWithMustache(new Floor(0, 0, map))

        expect(dogWithMustache.sprite).toBe(5)
        expect(dogWithMustache.health).toBe(1)
        expect(dogWithMustache.isStunned).toBeFalsy()
        expect(dogWithMustache.isPlayer).toBeFalsy()
        expect(dogWithMustache.isAlive).toBeTruthy()
    })

    test("doEntityBehavior should move DogWithMustache twice but attack once", () => {
        const playerTile = new Floor(1, 1, map)
        const player = new Player(playerTile, 6)
        const dogWithMustache = new DogWithMustache(new Floor(0, 0, map))
        const adjacentPassableTiles = [
            new Floor(0, 1, map),
            playerTile,
            new Floor(1, 0, map),
        ]

        const getTileAtDistanceXY = vi
            .fn()
            .mockReturnValueOnce(adjacentPassableTiles[0])
            .mockReturnValueOnce(playerTile)
            .mockReturnValueOnce(adjacentPassableTiles[0])
            .mockReturnValueOnce(playerTile)
        const tryToMove = vi.spyOn(dogWithMustache, "tryToMove")

        const playerReceiveDamage = vi.spyOn(player, "receiveDamage")

        update(
            dogWithMustache,
            adjacentPassableTiles,
            player,
            getTileAtDistanceXY,
            2
        )

        expect(tryToMove).toHaveBeenCalledTimes(2)
        expect(playerReceiveDamage).toHaveBeenCalledTimes(1)
    })
})
