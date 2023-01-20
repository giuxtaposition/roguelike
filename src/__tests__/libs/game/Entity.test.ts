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
    })

    test("new CoolDuck should have sprite 4 and health 3", () => {
        const coolDuck = new CoolDuck(new Floor(0, 0))

        expect(coolDuck.sprite).toBe(4)
        expect(coolDuck.health).toBe(3)
        expect(coolDuck.isPlayer).toBeFalsy()
    })

    test("new DogWithMustache should have sprite 5 and health 1", () => {
        const dogWithMustache = new DogWithMustache(new Floor(0, 0))

        expect(dogWithMustache.sprite).toBe(5)
        expect(dogWithMustache.health).toBe(1)
        expect(dogWithMustache.isPlayer).toBeFalsy()
    })

    test("new Black should have sprite 6 and health 2", () => {
        const black = new Black(new Floor(0, 0))

        expect(black.sprite).toBe(6)
        expect(black.health).toBe(2)
        expect(black.isPlayer).toBeFalsy()
    })

    test("new Slime should have sprite 7 and health 1", () => {
        const slime = new Slime(new Floor(0, 0))

        expect(slime.sprite).toBe(7)
        expect(slime.health).toBe(1)
        expect(slime.isPlayer).toBeFalsy()
    })

    test("new OneEyedDemon should have sprite 8 and health 3", () => {
        const oneEyedDemon = new OneEyedDemon(new Floor(0, 0))

        expect(oneEyedDemon.sprite).toBe(8)
        expect(oneEyedDemon.health).toBe(3)
        expect(oneEyedDemon.isPlayer).toBeFalsy()
    })

    test("move should move entity to chosen tile", () => {
        const player = new Player(new Floor(0, 0))
        const newTile = new Floor(4, 5)
        player.move(newTile)

        expect(player.tile).toEqual(newTile)
        expect(newTile.entity).toEqual(player)
    })
})
