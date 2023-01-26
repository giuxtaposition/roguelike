import { vi } from "vitest"
import {
    Black,
    CoolDuck,
    DogWithMustache,
    OneEyedDemon,
    Player,
    Slime,
} from "../../../libs/game/Entity"
import { Floor } from "../../../libs/game/Tile"

describe("Entities", () => {
    test("new player should have sprite 0 and health 3", () => {
        const player = new Player(new Floor(0, 0))

        expect(player.sprite).toBe(0)
        expect(player.health).toBe(3)
        expect(player.isPlayer).toBeTruthy()
        expect(player.isAlive).toBeTruthy()
    })

    test("new CoolDuck should have sprite 4 and health 3", () => {
        const coolDuck = new CoolDuck(new Floor(0, 0))

        expect(coolDuck.sprite).toBe(4)
        expect(coolDuck.health).toBe(3)
        expect(coolDuck.isPlayer).toBeFalsy()
        expect(coolDuck.isAlive).toBeTruthy()
    })

    test("new DogWithMustache should have sprite 5 and health 1", () => {
        const dogWithMustache = new DogWithMustache(new Floor(0, 0))

        expect(dogWithMustache.sprite).toBe(5)
        expect(dogWithMustache.health).toBe(1)
        expect(dogWithMustache.isPlayer).toBeFalsy()
        expect(dogWithMustache.isAlive).toBeTruthy()
    })

    test("new Black should have sprite 6 and health 2", () => {
        const black = new Black(new Floor(0, 0))

        expect(black.sprite).toBe(6)
        expect(black.health).toBe(2)
        expect(black.isPlayer).toBeFalsy()
        expect(black.isAlive).toBeTruthy()
    })

    test("new Slime should have sprite 7 and health 1", () => {
        const slime = new Slime(new Floor(0, 0))

        expect(slime.sprite).toBe(7)
        expect(slime.health).toBe(1)
        expect(slime.isPlayer).toBeFalsy()
        expect(slime.isAlive).toBeTruthy()
    })

    test("new OneEyedDemon should have sprite 8 and health 3", () => {
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0))

        expect(oneEyedDemon.sprite).toBe(8)
        expect(oneEyedDemon.health).toBe(3)
        expect(oneEyedDemon.isPlayer).toBeFalsy()
        expect(oneEyedDemon.isAlive).toBeTruthy()
    })

    test("move should move entity to chosen tile", () => {
        const player = new Player(new Floor(0, 0))
        const newTile = new Floor(4, 5)
        player.move(newTile)

        expect(player.tile).toEqual(newTile)
        expect(newTile.entity).toEqual(player)
    })

    test("update should move enemy one step closer to player", () => {
        const player = new Player(new Floor(1, 1))
        const enemy = new OneEyedDemon(new Floor(0, 0))
        const adjacentPassableTiles = [new Floor(0, 1), new Floor(1, 0)]

        const tryToMove = vi.fn()

        //[E][]
        //[][P]

        enemy.update(adjacentPassableTiles, player, tryToMove)

        expect(tryToMove).toHaveBeenCalledWith(enemy, 0, 1)
    })

    test("update should not move enemy one step closer to player if all tiles are already occupied", () => {
        const player = new Player(new Floor(1, 1))
        const enemy = new OneEyedDemon(new Floor(0, 0))

        const tile1 = new Floor(0, 1)
        const tile2 = new Floor(1, 0)
        new CoolDuck(tile1)
        new CoolDuck(tile2)

        const adjacentPassableTiles = [tile1, tile2]

        const tryToMove = vi.fn()

        enemy.update(adjacentPassableTiles, player, tryToMove)

        expect(tryToMove).not.toHaveBeenCalled()
    })
})
