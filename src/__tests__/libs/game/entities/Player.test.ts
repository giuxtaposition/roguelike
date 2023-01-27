import { Player } from "../../../../libs/game/entities/Player"
import Map from "../../../../libs/game/Map"
import { Floor } from "../../../../libs/game/Tile"

describe("Player", () => {
    const map = new Map()

    test("new player should have sprite 0 and health 3", () => {
        const player = new Player(new Floor(0, 0, map))

        expect(player.getSprite()).toBe(0)
        expect(player.getHealth()).toBe(3)
        expect(player.getIsPlayer()).toBeTruthy()
        expect(player.getIsAlive()).toBeTruthy()
    })
})
