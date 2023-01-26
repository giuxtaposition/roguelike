import { Floor, Wall } from "../../../libs/game/Tile"

describe("Tiles", () => {
    test("new floor tile should be passable and have sprite number 2", () => {
        const floor = new Floor(0, 0)

        expect(floor.passable).toBeTruthy()
        expect(floor.sprite).toBe(2)
    })

    test("new wall tile should not be passable and have sprite number 3", () => {
        const wall = new Wall(0, 0)

        expect(wall.passable).toBeFalsy()
        expect(wall.sprite).toBe(3)
    })

    test("distance should return the manhattan distance between the tile and other element x and y", () => {
        const tile = new Floor(0, 0)

        expect(tile.distance(new Wall(15, -15))).toBe(15 + 15)
    })
})
