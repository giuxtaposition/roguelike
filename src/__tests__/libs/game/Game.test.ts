import Game, { Direction, GameState } from "../../../libs/game/Game"
import { Exit, Floor, Wall } from "../../../libs/game/Tile"
import { vi } from "vitest"
import { CoolDuck, DogWithMustache } from "../../../libs/game/entities/enemies"

describe("Game", () => {
    let game: Game

    beforeEach(() => {
        game = new Game()
    })

    test("new Game should have loading game state", () => {
        expect(game.getGameState()).toEqual(GameState.Loading)
    })

    describe("has started", () => {
        beforeEach(() => {
            game.start()
        })

        test("after start should have game state running and generate map with enemies and treasures", () => {
            expect(game.getMap()).toBeDefined()
            expect(game.getEnemies().length).toBeGreaterThan(0)
            expect(game.getGameState()).toEqual(GameState.Running)
            expect(
                game
                    .getMap()
                    .getTiles()
                    .flatMap(row => row.filter(tile => tile.getTreasure()))
                    .length
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
                const { x: playerX, y: playerY } = game
                    .getPlayer()
                    .getTile()
                    .getCoordinates()

                game.getMap().getTile = vi
                    .fn()
                    .mockReturnValue(
                        new Floor(playerX + x, playerY + y, game.getMap())
                    )

                game.movePlayer(direction)
                let { x: newX, y: newY } = game
                    .getPlayer()
                    .getTile()
                    .getCoordinates()
                expect(newX).toBe(playerX + x)
                expect(newY).toBe(playerY + y)
            }
        )

        test("movePlayer should not move player to chosen direction if it is towards a wall", () => {
            const { x: startingX, y: startingY } = game
                .getPlayer()
                .getTile()
                .getCoordinates()

            game.getMap().getTile = vi
                .fn()
                .mockReturnValue(
                    new Wall(startingX, startingY + 1, game.getMap())
                )

            game.movePlayer(Direction.DOWN)
            let { x: newX, y: newY } = game
                .getPlayer()
                .getTile()
                .getCoordinates()
            expect(startingX).toBe(newX)
            expect(startingY).toBe(newY)
        })

        test("movePlayer should not move player to chosen direction if tile is already occupied, instead should attack monster", () => {
            const { x: startingX, y: startingY } = game
                .getPlayer()
                .getTile()
                .getCoordinates()

            const occupiedTile = new Floor(
                startingX,
                startingY + 1,
                game.getMap()
            )
            new CoolDuck(occupiedTile)

            game.getMap().getTile = vi.fn().mockReturnValue(occupiedTile)

            game.movePlayer(Direction.DOWN)
            let { x: newX, y: newY } = game
                .getPlayer()
                .getTile()
                .getCoordinates()
            expect(startingX).toBe(newX)
            expect(startingY).toBe(newY)
            expect(occupiedTile.getEntity().getHealth()).toBe(2)
        })

        test("if player has moved successfully advance game tick", () => {
            const { x, y } = game.getPlayer().getTile().getCoordinates()
            const tick = vi.spyOn(Game.prototype as any, "tick")
            game.getMap().getTile = vi
                .fn()
                .mockImplementation(() => new Floor(x, y + 1, game.getMap()))
            game.getMap().getAdjacentPassableTiles = vi
                .fn()
                .mockReturnValue([new Floor(x, y + 1, game.getMap())])

            game.movePlayer(Direction.DOWN)

            expect(tick).toHaveBeenCalledOnce()
        })

        test("if player has not moved because of wall or entity, do not advance game tick", () => {
            const { x, y } = game.getPlayer().getTile().getCoordinates()
            const tick = vi.spyOn(Game.prototype as any, "tick")
            game.getMap().getTile = vi
                .fn()
                .mockImplementation(() => new Wall(x, y + 1, game.getMap()))
            game.getMap().getAdjacentPassableTiles = vi.fn().mockReturnValue([])

            game.movePlayer(Direction.DOWN)

            expect(tick).not.toHaveBeenCalled()
        })

        test("if player is dead game state should be game over", () => {
            game.getPlayer().getIsAlive = vi.fn().mockReturnValue(false)
            game.getPlayer().tryToMove = vi.fn().mockReturnValue(true)

            game.movePlayer(Direction.RIGHT)

            expect(game.getGameState()).toEqual(GameState.GameOver)
        })

        test("spawn another enemy after 15 turns", () => {
            game.getPlayer().tryToMove = vi.fn().mockReturnValue(true)

            for (let index = 0; index <= 15; index++) {
                game.movePlayer(Direction.RIGHT)
            }

            expect(game.getEnemies().length).toBe(3)
        })

        test("if player steps on Exit start next level", () => {
            game.getMap().getTileAtDistanceXY = vi
                .fn()
                .mockReturnValue(new Exit(1, 1, game.getMap()))

            game.movePlayer(Direction.DOWN)

            expect(game.getLevel()).toBe(2)
            expect(game.getPlayer().getHealth()).toBe(4)
            expect(game.getEnemies().length).toBe(3)
        })

        test("if player steps on Exit and it is the last level, game over", () => {
            for (let index = 1; index <= game.getMaxLevel(); index++) {
                game.getMap().getTileAtDistanceXY = vi
                    .fn()
                    .mockReturnValue(new Exit(index, index, game.getMap()))
                game.movePlayer(Direction.DOWN)
            }

            expect(game.getGameState()).toEqual(GameState.GameOver)
        })

        test("if player steps on treasure add 1 to score and spawn new enemy", () => {
            const treasureTile = new Floor(1, 1, game.getMap())
            treasureTile.setTreasure(true)
            game.getMap().getTileAtDistanceXY = vi
                .fn()
                .mockReturnValue(treasureTile)

            game.movePlayer(Direction.DOWN)

            expect(game.getScore()).toBe(1)
            expect(game.getEnemies().length).toBe(3)
        })
    })
})
