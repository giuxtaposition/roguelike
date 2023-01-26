import Game, { Direction } from "../../../libs/game/Game"
import { Floor, Tile, Wall } from "../../../libs/game/Tile"
import { vi } from "vitest"
import { CoolDuck } from "../../../libs/game/Entity"

describe("Game", () => {
    test("at start should create map add random enemies to map", () => {
        const game = new Game()

        expect(game.map).toBeDefined()
        expect(game.enemies.length).toBeGreaterThan(0)
    })

    test("movePlayer should move player to chosen direction", () => {
        const game = new Game()
        const [x, y] = [game.player.tile.x, game.player.tile.y]

        //always return floor tile
        game.map.getTile = vi
            .fn()
            .mockReturnValueOnce(new Floor(x, y + 1))
            .mockReturnValueOnce(new Floor(x, y))
            .mockReturnValueOnce(new Floor(x + 1, y))
            .mockReturnValueOnce(new Floor(x, y))

        const TickDoNothing = vi.spyOn(Game.prototype as any, "tick")
        TickDoNothing.mockImplementation(() => {})

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

    test("movePlayer should not move player to chosen direction if it is towards a wall", () => {
        const game = new Game()
        const [x, y] = [game.player.tile.x, game.player.tile.y]

        game.map.getTile = vi.fn().mockReturnValue(new Wall(x, y + 1))

        game.movePlayer(Direction.DOWN)
        expect(game.player.tile.x).toBe(x)
        expect(game.player.tile.y).toBe(y)
    })

    test("movePlayer should not move player to chosen direction if tile is already occupied", () => {
        const game = new Game()
        const [x, y] = [game.player.tile.x, game.player.tile.y]

        const occupiedTile = new Floor(x, y + 1)
        new CoolDuck(occupiedTile)

        game.map.getTile = vi.fn().mockReturnValue(occupiedTile)

        game.movePlayer(Direction.DOWN)
        expect(game.player.tile.x).toBe(x)
        expect(game.player.tile.y).toBe(y)
    })

    test("if player has moved successfully advance game tick", () => {
        const game = new Game()
        const [x, y] = [game.player.tile.x, game.player.tile.y]
        const tick = vi.spyOn(Game.prototype as any, "tick")

        game.map.getTile = vi.fn().mockImplementation(() => new Floor(x, y + 1))

        game.map.getAdjacentPassableTiles = vi
            .fn()
            .mockReturnValue([new Floor(x, y + 1)])

        game.movePlayer(Direction.DOWN)

        expect(tick).toHaveBeenCalledOnce()
    })

    test("if player has not moved because of wall or entity, do not advance game tick", () => {
        const game = new Game()
        const [x, y] = [game.player.tile.x, game.player.tile.y]
        const tick = vi.spyOn(Game.prototype as any, "tick")

        game.map.getTile = vi.fn().mockImplementation(() => new Wall(x, y + 1))

        game.map.getAdjacentPassableTiles = vi.fn().mockReturnValue([])

        game.movePlayer(Direction.DOWN)

        expect(tick).not.toHaveBeenCalled()
    })
})
