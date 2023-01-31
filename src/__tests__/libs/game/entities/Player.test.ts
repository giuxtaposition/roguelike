import { Player } from "../../../../libs/game/entities/Player"
import Map from "../../../../libs/game/Map"
import { Floor } from "../../../../libs/game/Tile"

describe("Player", () => {
    const map = new Map()

    test("new player should have sprite 0 and health 3", () => {
        const player = new Player(new Floor(0, 0, map), 3)

        expect(player.sprite).toBe(0)
        expect(player.health).toBe(3)
        expect(player.isPlayer).toBeTruthy()
        expect(player.isAlive).toBeTruthy()
    })
})
