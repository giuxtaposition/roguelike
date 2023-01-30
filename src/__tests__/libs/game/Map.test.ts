import { vi } from "vitest"
import Map from "../../../libs/game/Map"
import { Floor, Tile, Wall } from "../../../libs/game/Tile"

describe("Map", () => {
    test("On new map, should generate map with all floor tiles connected", () => {
        const map = new Map()

        let wallTiles = map
            .getTiles()
            .filter(row => row.filter(tile => tile instanceof Wall))
            .flat()
        let floorTiles = map
            .getTiles()
            .filter(row => row.filter(tile => tile instanceof Floor))
            .flat()

        expect(wallTiles.length).toBeGreaterThan(1)
        expect(floorTiles.length).toBeGreaterThan(1)

        const connectedFloorTiles = floorTiles.filter(floor => {
            const { x, y } = floor.getCoordinates()
            const adjacentTiles = [
                map.getTile(x + 1, y),
                map.getTile(x - 1, y),
                ,
                map.getTile(x, y + 1),
                ,
                map.getTile(x, y - 1),
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

    test("getAdjacentTiles should return adjacent tiles to passed tile, in random order", () => {
        const map = new Map()
        const randomTile = map.getRandomPassableTile()
        const { x, y } = randomTile.getCoordinates()

        const adjacentTiles = map.getAdjacentTiles(randomTile)

        expect(adjacentTiles).toEqual(
            expect.arrayContaining([
                map.getTile(x, y + 1),
                map.getTile(x, y - 1),
                map.getTile(x + 1, y),
                map.getTile(x - 1, y),
            ])
        )
    })

    test("getAdjacentPassableTiles should return all floor tiles adjacent to current tile", () => {
        const map = new Map()
        const adjacentPassableTiles = [
            new Floor(1, 2, map),
            new Floor(2, 3, map),
        ]

        map.getTile = vi
            .fn()
            .mockReturnValueOnce(adjacentPassableTiles[1])
            .mockReturnValueOnce(adjacentPassableTiles[0])
            .mockReturnValueOnce(new Wall(2, 1, map))
            .mockReturnValueOnce(new Wall(3, 2, map))

        expect(map.getAdjacentPassableTiles(new Floor(2, 2, map))).toEqual(
            expect.arrayContaining(adjacentPassableTiles)
        )
    })

    test("getRandomPassableTile, should return a random floor tile", () => {
        const map = new Map()

        expect(map.getRandomPassableTile()).toBeInstanceOf(Floor)
    })

    test("getTileAtDistanceXY should return the tile at expected distance from current tile", () => {
        const map = new Map()
        const currentTile = map.getTile(1, 1)
        const expectedTile = map.getTile(3, 3)
        expect(map.getTileAtDistanceXY(currentTile, 2, 2)).toEqual(expectedTile)
    })

    test("inBounds should return false if coordinates are outside of map", () => {
        expect(Map.inBounds(-1, 9)).toBeFalsy()
    })

    test("inBounds should return true if coordinates are inside of map", () => {
        expect(Map.inBounds(8, 8))
    })
})
