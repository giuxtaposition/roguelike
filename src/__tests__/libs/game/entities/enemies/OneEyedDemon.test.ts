import { vi } from "vitest"
import { OneEyedDemon } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import Map from "../../../../../libs/game/Map"
import { Floor } from "../../../../../libs/game/Tile"
import { update } from "../../../../helpers/helpers"

describe("OneEyedDemon", () => {
    const map = new Map()

    test("new OneEyedDemon should have sprite 8 and health 3", () => {
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0, map))

        expect(oneEyedDemon.sprite).toBe(8)
        expect(oneEyedDemon.health).toBe(3)
        expect(oneEyedDemon.isStunned).toBeFalsy()
        expect(oneEyedDemon.isPlayer).toBeFalsy()
        expect(oneEyedDemon.isAlive).toBeTruthy()
    })

    test("update should stun OneEyedDemon if not already stunned", () => {
        const player = new Player(new Floor(1, 1, map), 6)
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0, map))
        const adjacentPassableTiles = [new Floor(0, 1, map)]

        const getTileAtDistanceXY = vi
            .fn()
            .mockReturnValue(adjacentPassableTiles[0])

        update(
            oneEyedDemon,
            adjacentPassableTiles,
            player,
            getTileAtDistanceXY,
            1
        )

        expect(oneEyedDemon.isStunned).toBeTruthy()
    })
})
