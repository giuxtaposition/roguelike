import { vi } from "vitest"
import { Slime } from "../../../../../libs/game/entities/enemies"
import { Player } from "../../../../../libs/game/entities/Player"
import Map from "../../../../../libs/game/Map"
import { Floor, Wall } from "../../../../../libs/game/Tile"
import { update } from "../../../../helpers/helpers"

describe("Black", () => {
    const map = new Map()

    test("new Slime should have sprite 7 and health 1", () => {
        const slime = new Slime(new Floor(0, 0, map))

        expect(slime.sprite).toBe(7)
        expect(slime.health).toBe(1)
        expect(slime.isStunned).toBeFalsy()
        expect(slime.isPlayer).toBeFalsy()
        expect(slime.isAlive).toBeTruthy()
    })

    test("doEntityBehavior should try to eat nearby walls and restore health", () => {
        const player = new Player(new Floor(2, 2, map), 6)
        const slime = new Slime(new Floor(1, 1, map))
        const adjacentTiles = [new Floor(1, 2, map), new Wall(2, 1, map)]

        const tryToMove = vi.spyOn(slime, "tryToMove")

        update(slime, adjacentTiles, player, vi.fn(), 2)

        expect(slime.health).toBe(1.5)
        expect(map.getTile(2, 1)).toBeInstanceOf(Floor)
        expect(tryToMove).not.toHaveBeenCalled()
    })

    test("doEntityBehavior should do normal entity update if there are no walls nearby", () => {
        const player = new Player(new Floor(2, 2, map), 6)
        const slime = new Slime(new Floor(1, 1, map))
        const adjacentTiles = [new Floor(1, 2, map), new Floor(2, 1, map)]

        const tryToMove = vi.spyOn(slime, "tryToMove")

        update(
            slime,
            adjacentTiles,
            player,
            vi.fn().mockReturnValue(adjacentTiles[0]),
            2
        )

        expect(tryToMove).toHaveBeenCalled()
    })
})
