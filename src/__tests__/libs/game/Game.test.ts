import Game, { Direction } from "../../../libs/game/Game"
import { Floor, Tile, Wall } from "../../../libs/game/Tile"
import { vi } from "vitest"

describe("Game", () => {
    test("at start should generate random map with the floor all connected", () => {
        const game = new Game()
        let wallTiles = game.tiles
            .filter(row => row.filter(tile => tile instanceof Wall))
            .flat()
        let floorTiles = game.tiles
            .filter(row => row.filter(tile => tile instanceof Floor))
            .flat()

        expect(wallTiles.length).toBeGreaterThan(1)
        expect(floorTiles.length).toBeGreaterThan(1)

        const connectedFloorTiles = floorTiles.filter(floor => {
            const adjacentTiles = [
                game.getTile(floor.x + 1, floor.y),
                game.getTile(floor.x - 1, floor.y),
                ,
                game.getTile(floor.x, floor.y + 1),
                ,
                game.getTile(floor.x, floor.y - 1),
            ]

            adjacentTiles.filter(tile => tile instanceof Floor)

            return adjacentTiles.length
        })

        expect(connectedFloorTiles.length).toBe(floorTiles.length)
    })

    test("at start should add random enemies to map", () => {
        const game = new Game()
        expect(game.enemies.length).toBeGreaterThan(0)
    })

    test("movePlayer should move player to chosen direction", () => {
        const game = new Game()
        const [x, y] = [game.player.tile.x, game.player.tile.y]

        //always return floor tile
        game.getTile = vi
            .fn()
            .mockReturnValueOnce(new Floor(x, y + 1))
            .mockReturnValueOnce(new Floor(x, y))
            .mockReturnValueOnce(new Floor(x + 1, y))
            .mockReturnValueOnce(new Floor(x, y))

        game.movePlayer(Direction.DOWN)
        expect(game.player.tile.x).toBe(x)
        expect(game.player.tile.y).toBe(y + 1)

        game.movePlayer(Direction.UP)
        expect(game.player.tile.x).toBe(x)
        expect(game.player.tile.y).toBe(y)

        game.movePlayer(Direction.RIGHT)
        expect(game.player.tile.x).toBe(x + 1)
        expect(game.player.tile.y).toBe(y)

        game.movePlayer(Direction.LEFT)
        expect(game.player.tile.x).toBe(x)
        expect(game.player.tile.y).toBe(y)
    })
})
