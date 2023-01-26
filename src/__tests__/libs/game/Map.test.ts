import { vi } from "vitest"
import Map from "../../../libs/game/Map"
import { Floor, Tile, Wall } from "../../../libs/game/Tile"

describe("Map", () => {
    test("On new map, should generate map with all floor tiles connected", () => {
        const map = new Map()

        let wallTiles = map.tiles
            .filter(row => row.filter(tile => tile instanceof Wall))
            .flat()
        let floorTiles = map.tiles
            .filter(row => row.filter(tile => tile instanceof Floor))
            .flat()

        expect(wallTiles.length).toBeGreaterThan(1)
        expect(floorTiles.length).toBeGreaterThan(1)

        const connectedFloorTiles = floorTiles.filter(floor => {
            const adjacentTiles = [
                map.getTile(floor.x + 1, floor.y),
                map.getTile(floor.x - 1, floor.y),
                ,
                map.getTile(floor.x, floor.y + 1),
                ,
                map.getTile(floor.x, floor.y - 1),
            ]

            adjacentTiles.filter(tile => tile instanceof Floor)

            return adjacentTiles.length
        })

        expect(connectedFloorTiles.length).toBe(floorTiles.length)
    })

    test("getTile should return tile at desired coordinates if inside map", () => {
        const map = new Map()

        expect(map.getTile(5, 2)).toBeInstanceOf(Tile)
    })

    test("getTile should return a wall at desired coordinates if outside map", () => {
        const map = new Map()

        expect(map.getTile(-10, 200)).toBeInstanceOf(Wall)
    })

    test("getAdjacentPassableTiles should return all floor tiles adjacent to current tile", () => {
        const map = new Map()
        const adjacentPassableTiles = [new Floor(1, 2), new Floor(2, 3)]

        map.getTile = vi
            .fn()
            .mockReturnValueOnce(adjacentPassableTiles[1])
            .mockReturnValueOnce(adjacentPassableTiles[0])
            .mockReturnValueOnce(new Wall(2, 1))
            .mockReturnValueOnce(new Wall(3, 2))

        expect(map.getAdjacentPassableTiles(2, 2)).toEqual(
            expect.arrayContaining(adjacentPassableTiles)
        )
    })

    test("getRandomPassableTile, should return a random floor tile", () => {
        const map = new Map()

        expect(map.getRandomPassableTile()).toBeInstanceOf(Floor)
    })
})
