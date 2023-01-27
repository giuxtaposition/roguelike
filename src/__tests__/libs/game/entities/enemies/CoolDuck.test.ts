import { Floor } from "../../../../../libs/game/Tile"
import Map from "../../../../../libs/game/Map"
import { CoolDuck } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import { vi } from "vitest"

describe("CoolDuck", () => {
    const map = new Map()

    test("new CoolDuck should have sprite 4 and health 3", () => {
        const coolDuck = new CoolDuck(new Floor(0, 0, map))

        expect(coolDuck.getSprite()).toBe(4)
        expect(coolDuck.getHealth()).toBe(3)
        expect(coolDuck.getIsStunned()).toBeFalsy()
        expect(coolDuck.getIsPlayer()).toBeFalsy()
        expect(coolDuck.getIsAlive()).toBeTruthy()
    })

    test("update should follow normal entity update", () => {
        const player = new Player(new Floor(1, 1, map))
        const coolDuck = new CoolDuck(new Floor(0, 0, map))
        const adjacentPassableTiles = [new Floor(0, 1, map)]

        const getTileAtDistanceXY = vi
            .fn()
            .mockReturnValue(adjacentPassableTiles[0])
        const tryToMove = vi.spyOn(coolDuck, "tryToMove")

        coolDuck.update(adjacentPassableTiles, player, getTileAtDistanceXY)

        expect(getTileAtDistanceXY).toHaveBeenCalledWith(coolDuck, 0, 1)
        expect(tryToMove).toHaveBeenCalledWith(adjacentPassableTiles[0])
    })
})
