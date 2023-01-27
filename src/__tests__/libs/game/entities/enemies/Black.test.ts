import { vi } from "vitest"
import { Black } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import Map from "../../../../../libs/game/Map"
import { Floor } from "../../../../../libs/game/Tile"

describe("Black", () => {
    const map = new Map()

    test("new Black should have sprite 6 and health 2", () => {
        const black = new Black(new Floor(0, 0, map))

        expect(black.getSprite()).toBe(6)
        expect(black.getHealth()).toBe(2)
        expect(black.getIsStunned()).toBeFalsy()
        expect(black.getIsPlayer()).toBeFalsy()
        expect(black.getIsAlive()).toBeTruthy()
    })

    test("update should move Black randomly without using manhattan distance", () => {
        const tileA = new Floor(0, 1, map)
        const tileB = new Floor(1, 0, map)
        const player = new Player(new Floor(1, 1, map))
        const black = new Black(new Floor(0, 0, map))

        const getTileAtDistanceXY = vi.fn().mockReturnValueOnce(tileA)

        const tileADistance = vi.spyOn(tileA, "distance")
        const tileBDistance = vi.spyOn(tileB, "distance")

        black.update([tileA, tileB], player, getTileAtDistanceXY)

        expect(tileADistance).not.toHaveBeenCalled()
        expect(tileBDistance).not.toHaveBeenCalled()
    })
})
