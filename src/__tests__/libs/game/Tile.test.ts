import { vi } from "vitest"
import Game from "../../../libs/game/Game"
import { Floor, Wall } from "../../../libs/game/Tile"

describe("Tiles", () => {
    test("new floor tile should be passable and have sprite number 2", () => {
        const game = new Game()
        const floor = new Floor(0, 0)

        expect(floor.passable).toBeTruthy()
        expect(floor.sprite).toBe(2)
    })

    test("new wall tile should not be passable and have sprite number 3", () => {
        const game = new Game()
        const wall = new Wall(0, 0)

        expect(wall.passable).toBeFalsy()
        expect(wall.sprite).toBe(3)
    })
})
