import Game, { Direction, GameState } from "../../../libs/game/Game"
import { Exit, Floor, Wall } from "../../../libs/game/Tile"
import { vi } from "vitest"
import { CoolDuck } from "../../../libs/game/entities/enemies"
import { scores } from "../../../libs/stores/scores"
import { Player } from "../../../libs/game/entities/Player"

describe("Game", () => {
    let game: Game

    beforeEach(() => {
        game = new Game(scores)
    })

    test("new Game should have loading game state", () => {
        expect(game.gameState).toEqual(GameState.Loading)
    })

    describe("has started", () => {
        beforeEach(() => {
            game.start()
        })

        test("after start should have game state running and generate map with enemies and treasures", () => {
            expect(game.map).toBeDefined()
            expect(game.enemies.length).toBeGreaterThan(0)
            expect(game.gameState).toEqual(GameState.Running)
            expect(
                game.map.tiles.flatMap(row =>
                    row.filter(tile => tile.hasTreasure)
                ).length
            ).toBe(3)
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
                const { x: playerX, y: playerY } = game.player.tile.coordinates

                game.map.getTile = vi
                    .fn()
                    .mockReturnValue(
                        new Floor(playerX + x, playerY + y, game.map)
                    )

                game.movePlayer(direction)
                let { x: newX, y: newY } = game.player.tile.coordinates
                expect(newX).toBe(playerX + x)
                expect(newY).toBe(playerY + y)
            }
        )

        test("movePlayer should not move player to chosen direction if it is towards a wall", () => {
            const { x: startingX, y: startingY } = game.player.tile.coordinates

            game.map.getTile = vi
                .fn()
                .mockReturnValue(new Wall(startingX, startingY + 1, game.map))

            game.movePlayer(Direction.DOWN)
            let { x: newX, y: newY } = game.player.tile.coordinates
            expect(startingX).toBe(newX)
            expect(startingY).toBe(newY)
        })

        test("movePlayer should not move player to chosen direction if tile is already occupied, instead should attack monster", () => {
            const { x: startingX, y: startingY } = game.player.tile.coordinates

            const occupiedTile = new Floor(startingX, startingY + 1, game.map)
            new CoolDuck(occupiedTile)

            game.map.getTile = vi.fn().mockReturnValue(occupiedTile)

            game.movePlayer(Direction.DOWN)
            let { x: newX, y: newY } = game.player.tile.coordinates
            expect(startingX).toBe(newX)
            expect(startingY).toBe(newY)
            expect(occupiedTile.entity.health).toBe(2)
        })

        test("if player has moved successfully advance game tick", () => {
            const { x, y } = game.player.tile.coordinates
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
            const { x, y } = game.player.tile.coordinates
            const tick = vi.spyOn(Game.prototype as any, "tick")
            game.map.getTile = vi
                .fn()
                .mockImplementation(() => new Wall(x, y + 1, game.map))
            game.map.getAdjacentPassableTiles = vi.fn().mockReturnValue([])

            game.movePlayer(Direction.DOWN)

            expect(tick).not.toHaveBeenCalled()
        })

        test("if player is dead game state should be game over", () => {
            vi.spyOn(Player.prototype, "isAlive", "get").mockReturnValue(false)
            game.player.tryToMove = vi.fn().mockReturnValue(true)

            game.movePlayer(Direction.RIGHT)

            expect(game.gameState).toEqual(GameState.GameOver)
        })

        test("spawn another enemy after 15 turns", () => {
            game.player.tryToMove = vi.fn().mockReturnValue(true)

            for (let index = 0; index <= 15; index++) {
                game.movePlayer(Direction.RIGHT)
            }

            expect(game.enemies.length).toBe(3)
        })

        test("if player steps on Exit start next level", () => {
            game.map.getTileAtDistanceXY = vi
                .fn()
                .mockReturnValue(new Exit(1, 1, game.map))

            game.movePlayer(Direction.DOWN)

            expect(game.level).toBe(2)
            expect(game.player.health).toBe(4)
            expect(game.enemies.length).toBe(3)
        })

        test("if player steps on Exit and it is the last level, game over", () => {
            for (let index = 1; index <= game.maxLevel; index++) {
                game.map.getTileAtDistanceXY = vi
                    .fn()
                    .mockReturnValue(new Exit(index, index, game.map))
                game.movePlayer(Direction.DOWN)
            }

            expect(game.gameState).toEqual(GameState.GameOver)
        })

        test("if player steps on treasure add 1 to score and spawn new enemy", () => {
            const treasureTile = new Floor(1, 1, game.map)
            treasureTile.hasTreasure = true
            game.map.getTileAtDistanceXY = vi.fn().mockReturnValue(treasureTile)

            game.movePlayer(Direction.DOWN)

            expect(game.score).toBe(1)
            expect(game.enemies.length).toBe(3)
        })
    })
})
