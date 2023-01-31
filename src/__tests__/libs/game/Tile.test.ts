import { Exit, Floor, Wall } from "../../../libs/game/Tile"
import Map from "../../../libs/game/Map"

describe("Tiles", () => {
    const map = new Map()
    test("new floor tile should be passable and have sprite number 2", () => {
        const floor = new Floor(1, 1, map)

        expect(floor.isPassable).toBeTruthy()
        expect(floor.sprite).toBe(2)
    })

    test("new wall tile should not be passable and have sprite number 3", () => {
        const wall = new Wall(1, 1, map)

        expect(wall.isPassable).toBeFalsy()
        expect(wall.sprite).toBe(3)
    })

    test("new exit tile should not be passable and have sprite number 3", () => {
        const wall = new Exit(1, 1, map)

        expect(wall.isPassable).toBeTruthy()
        expect(wall.sprite).toBe(11)
    })

    test("distance should return the manhattan distance between the tile and other element x and y", () => {
        const tile = new Floor(0, 0, map)

        expect(tile.distance(new Wall(15, -15, map))).toBe(15 + 15)
    })

    test("replace should replace current type of tile in map with new type of tile", () => {
        const tile = new Floor(1, 1, map)

        tile.replace(Wall)
        expect(map.getTile(1, 1)).toBeInstanceOf(Wall)
    })
})
