import { randomRange, tryTo } from "../utils/utils"
import { Player } from "./Entity"
import { Floor, Wall, type Tile } from "./Tile"

export default class Game {
    readonly tileSize = 64
    readonly numTiles = 9
    readonly uiWidth = 4

    player: Player
    tiles: Tile[][] = []

    constructor() {
        this.generateLevel()

        this.player = new Player(this.randomPassableTile())
    }

    public getTile(x: number, y: number): Tile {
        if (this.inBounds(x, y)) {
            return this.tiles[x][y]
        } else {
            return new Wall(x, y, this)
        }
    }

    public movePlayer(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.player.tryToMove(0, -1)
                break
            case Direction.DOWN:
                this.player.tryToMove(0, 1)
                break
            case Direction.LEFT:
                this.player.tryToMove(-1, 0)
                break
            case Direction.RIGHT:
                this.player.tryToMove(1, 0)
                break
            default:
                break
        }
    }

    private generateLevel() {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ==
                this.randomPassableTile().getConnectedTiles().length
            )
        })
    }

    private generateTiles() {
        let passableTiles = 0
        for (let i = 0; i < this.numTiles; i++) {
            this.tiles[i] = []

            for (let j = 0; j < this.numTiles; j++) {
                if (Math.random() < 0.3 || !this.inBounds(i, j)) {
                    this.tiles[i][j] = new Wall(i, j, this)
                } else {
                    this.tiles[i][j] = new Floor(i, j, this)

                    passableTiles++
                }
            }
        }
        return passableTiles
    }

    private inBounds(x: number, y: number) {
        return x > 0 && y > 0 && x < this.numTiles - 1 && y < this.numTiles - 1
    }

    private randomPassableTile(): Tile {
        let tile: Tile

        tryTo("get random passable tile", () => {
            let x = randomRange(0, this.numTiles - 1)
            let y = randomRange(0, this.numTiles - 1)
            tile = this.getTile(x, y)
            return tile.passable
        })

        return tile
    }
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
