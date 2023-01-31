import { vi } from "vitest"
import { Black } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import Map from "../../../../../libs/game/Map"
import { Floor } from "../../../../../libs/game/Tile"
import { update } from "../../../../helpers/helpers"

describe("Black", () => {
    const map = new Map()

    test("new Black should have sprite 6 and health 2", () => {
        const black = new Black(new Floor(0, 0, map))

        expect(black.sprite).toBe(6)
        expect(black.health).toBe(2)
        expect(black.isStunned).toBeFalsy()
        expect(black.isPlayer).toBeFalsy()
        expect(black.isAlive).toBeTruthy()
    })

    test("update should move Black randomly without using manhattan distance", () => {
        const tileA = new Floor(0, 1, map)
        const tileB = new Floor(1, 0, map)
        const player = new Player(new Floor(1, 1, map), 6)
        const black = new Black(new Floor(0, 0, map))

        const getTileAtDistanceXY = vi.fn().mockReturnValueOnce(tileA)

        const tileADistance = vi.spyOn(tileA, "distance")
        const tileBDistance = vi.spyOn(tileB, "distance")

        update(black, [tileA, tileB], player, getTileAtDistanceXY, 2)

        expect(tileADistance).not.toHaveBeenCalled()
        expect(tileBDistance).not.toHaveBeenCalled()
    })
})
