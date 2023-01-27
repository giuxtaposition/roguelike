import { vi } from "vitest"
import { OneEyedDemon } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import Map from "../../../../../libs/game/Map"
import { Floor } from "../../../../../libs/game/Tile"

describe("OneEyedDemon", () => {
    const map = new Map()

    test("new OneEyedDemon should have sprite 8 and health 3", () => {
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0, map))

        expect(oneEyedDemon.getSprite()).toBe(8)
        expect(oneEyedDemon.getHealth()).toBe(3)
        expect(oneEyedDemon.getIsStunned()).toBeFalsy()
        expect(oneEyedDemon.getIsPlayer()).toBeFalsy()
        expect(oneEyedDemon.getIsAlive()).toBeTruthy()
    })

    test("update should stun OneEyedDemon if not already stunned", () => {
        const player = new Player(new Floor(1, 1, map))
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0, map))
        const adjacentPassableTiles = [new Floor(0, 1, map)]

        const getTileAtDistanceXY = vi
            .fn()
            .mockReturnValue(adjacentPassableTiles[0])

        oneEyedDemon.update(adjacentPassableTiles, player, getTileAtDistanceXY)

        expect(oneEyedDemon.getIsStunned()).toBeTruthy()
    })
})
