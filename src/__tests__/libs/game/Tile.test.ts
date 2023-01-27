import { Floor, Wall } from "../../../libs/game/Tile"
import Map from "../../../libs/game/Map"

describe("Tiles", () => {
    const map = new Map()
    test("new floor tile should be passable and have sprite number 2", () => {
        const floor = new Floor(0, 0, map)

        expect(floor.getIsPassable()).toBeTruthy()
        expect(floor.getSprite()).toBe(2)
    })

    test("new wall tile should not be passable and have sprite number 3", () => {
        const wall = new Wall(0, 0, map)

        expect(wall.getIsPassable()).toBeFalsy()
        expect(wall.getSprite()).toBe(3)
    })

    test("distance should return the manhattan distance between the tile and other element x and y", () => {
        const tile = new Floor(0, 0, map)

        expect(tile.distance(new Wall(15, -15, map))).toBe(15 + 15)
    })

    test.todo(
        "replace should replace current type of tile in map with new type of tile",
        () => {}
    )
})
