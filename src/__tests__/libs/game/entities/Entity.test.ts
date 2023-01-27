import { vi } from "vitest"

import { Floor, Wall } from "../../../../libs/game/Tile"
import Map from "../../../../libs/game/Map"
import { Player } from "../../../../libs/game/entities/Player"
import { CoolDuck, OneEyedDemon } from "../../../../libs/game/entities/enemies"

describe("Entities", () => {
    const map = new Map()

    test("tryToMove should move entity to chosen tile if passable", () => {
        const player = new Player(new Floor(0, 0, map))
        const newTile = new Floor(4, 5, map)
        player.tryToMove(newTile)

        expect(player.getTile()).toEqual(newTile)
        expect(newTile.getEntity()).toEqual(player)
    })

    test("tryToMove should not move entity to chosen tile if not passable", () => {
        const startingTile = new Floor(0, 0, map)
        const player = new Player(startingTile)
        player.tryToMove(new Wall(4, 5, map))

        expect(player.getTile()).toEqual(startingTile)
        expect(startingTile.getEntity()).toEqual(player)
    })

    test("tryToMove should not move entity to chosen tile if occupied but should attack", () => {
        const startingTile = new Floor(0, 0, map)
        const player = new Player(startingTile)
        const newTile = new Floor(0, 1, map)
        const enemy = new OneEyedDemon(newTile)
        player.tryToMove(newTile)

        expect(player.getTile()).toEqual(startingTile)
        expect(startingTile.getEntity()).toEqual(player)
        expect(enemy.getHealth()).toBe(2)
        expect(enemy.getIsStunned()).toBeTruthy()
    })

    test("update should move enemy one step closer to player", () => {
        const player = new Player(new Floor(1, 1, map))
        const enemy = new OneEyedDemon(new Floor(0, 0, map))
        const adjacentPassableTiles = [
            new Floor(1, 0, map),
            new Floor(0, 1, map),
        ]

        const getTileAtDistanceXY = vi
            .fn()
            .mockReturnValue(adjacentPassableTiles[0])
        const tryToMove = vi.spyOn(enemy, "tryToMove")

        enemy.update(adjacentPassableTiles, player, getTileAtDistanceXY)

        expect(getTileAtDistanceXY).toHaveBeenCalledWith(enemy, 1, 0)
        expect(tryToMove).toHaveBeenCalledWith(adjacentPassableTiles[0])
    })

    test("update should not move enemy one step closer to player if all tiles are already occupied", () => {
        const player = new Player(new Floor(1, 1, map))
        const enemy = new OneEyedDemon(new Floor(0, 0, map))

        const tile1 = new Floor(0, 1, map)
        const tile2 = new Floor(1, 0, map)
        new CoolDuck(tile1)
        new CoolDuck(tile2)

        const adjacentPassableTiles = [tile1, tile2]

        const getTileAtDistanceXY = vi.fn()
        const tryToMove = vi.spyOn(enemy, "tryToMove")

        enemy.update(adjacentPassableTiles, player, getTileAtDistanceXY)

        expect(getTileAtDistanceXY).not.toHaveBeenCalled()
        expect(tryToMove).not.toHaveBeenCalled()
    })

    test("update should not move enemy one step closer to player if it is stunned", () => {
        const enemyTile = new Floor(0, 0, map)
        const player = new Player(new Floor(1, 1, map))
        const enemy = new OneEyedDemon(enemyTile)

        player.tryToMove(enemyTile)

        const tile1 = new Floor(0, 1, map)
        const tile2 = new Floor(1, 0, map)
        const adjacentPassableTiles = [tile1, tile2]

        const getTileAtDistanceXY = vi.fn()
        const tryToMove = vi.spyOn(enemy, "tryToMove")

        enemy.update(adjacentPassableTiles, player, getTileAtDistanceXY)

        expect(getTileAtDistanceXY).not.toHaveBeenCalled()
        expect(tryToMove).not.toHaveBeenCalled()
    })

    test("receiveDamage should diminish health points by damage", () => {
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0, map))

        oneEyedDemon.receiveDamage(1)
        expect(oneEyedDemon.getHealth()).toBe(2)
    })

    test("receiveDamage should update alive status if health points are lower than 0", () => {
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0, map))

        oneEyedDemon.receiveDamage(3)
        expect(oneEyedDemon.getHealth()).toBe(0)
        expect(oneEyedDemon.getIsAlive()).toBeFalsy()
    })
})
