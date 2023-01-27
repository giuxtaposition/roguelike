import Game, { Direction } from "../../../libs/game/Game"
import { Floor, Tile, Wall } from "../../../libs/game/Tile"
import { vi } from "vitest"
import { CoolDuck } from "../../../libs/game/entities/enemies"

describe("Game", () => {
    test("at start should create map add random enemies to map", () => {
        const game = new Game()

        expect(game.map).toBeDefined()
        expect(game.enemies.length).toBeGreaterThan(0)
    })

    test.each`
        direction          | x     | y
        ${Direction.UP}    | ${0}  | ${-1}
        ${Direction.RIGHT} | ${1}  | ${0}
        ${Direction.LEFT}  | ${-1} | ${0}
        ${Direction.DOWN}  | ${0}  | ${1}
    `(
        "movePlayer should move player to chosen direction if tile is passable and free",
        ({ direction, x, y }) => {
            const game = new Game()
            const { x: playerX, y: playerY } = game.player
                .getTile()
                .getCoordinates()

            game.map.getTile = vi
                .fn()
                .mockReturnValue(new Floor(playerX + x, playerY + y, game.map))

            const TickDoNothing = vi.spyOn(Game.prototype as any, "tick")
            TickDoNothing.mockImplementation(() => {})

            game.movePlayer(direction)
            let { x: newX, y: newY } = game.player.getTile().getCoordinates()
            expect(newX).toBe(playerX + x)
            expect(newY).toBe(playerY + y)
        }
    )

    test("movePlayer should not move player to chosen direction if it is towards a wall", () => {
        const game = new Game()
        const { x: startingX, y: startingY } = game.player
            .getTile()
            .getCoordinates()

        game.map.getTile = vi
            .fn()
            .mockReturnValue(new Wall(startingX, startingY + 1, game.map))

        game.movePlayer(Direction.DOWN)
        let { x: newX, y: newY } = game.player.getTile().getCoordinates()
        expect(startingX).toBe(newX)
        expect(startingY).toBe(newY)
    })

    test("movePlayer should not move player to chosen direction if tile is already occupied, instead should attack monster", () => {
        const game = new Game()
        const { x: startingX, y: startingY } = game.player
            .getTile()
            .getCoordinates()

        const occupiedTile = new Floor(startingX, startingY + 1, game.map)
        new CoolDuck(occupiedTile)

        game.map.getTile = vi.fn().mockReturnValue(occupiedTile)

        game.movePlayer(Direction.DOWN)
        let { x: newX, y: newY } = game.player.getTile().getCoordinates()
        expect(startingX).toBe(newX)
        expect(startingY).toBe(newY)
        expect(occupiedTile.getEntity().getHealth()).toBe(2)
    })

    test("if player has moved successfully advance game tick", () => {
        const game = new Game()
        const { x, y } = game.player.getTile().getCoordinates()
        const tick = vi.spyOn(Game.prototype as any, "tick")
        game.map.getTile = vi
            .fn()
            .mockImplementation(() => new Floor(x, y + 1, game.map))
        game.map.getAdjacentPassableTiles = vi
            .fn()
            .mockReturnValue([new Floor(x, y + 1, game.map)])

        game.movePlayer(Direction.DOWN)

        expect(tick).toHaveBeenCalledOnce()
    })

    test("if player has not moved because of wall or entity, do not advance game tick", () => {
        const game = new Game()
        const { x, y } = game.player.getTile().getCoordinates()
        const tick = vi.spyOn(Game.prototype as any, "tick")
        game.map.getTile = vi
            .fn()
            .mockImplementation(() => new Wall(x, y + 1, game.map))
        game.map.getAdjacentPassableTiles = vi.fn().mockReturnValue([])

        game.movePlayer(Direction.DOWN)

        expect(tick).not.toHaveBeenCalled()
    })
})
