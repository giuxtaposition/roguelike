import { Floor, Wall, type Tile } from "./Tile"

export default class Game {
    readonly tileSize = 64
    readonly numTiles = 9
    readonly uiWidth = 4

    tiles: Tile[][] = []
    x = 0
    y = 0

    constructor() {
        this.generateLevel()
    }

    public getTile(x: number, y: number): Tile {
        if (this.inBounds(x, y)) {
            return this.tiles[x][y]
        } else {
            return new Wall(x, y)
        }
    }

    public movePlayer(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.y -= 1
                break
            case Direction.DOWN:
                this.y += 1
                break
            case Direction.LEFT:
                this.x -= 1
                break
            case Direction.RIGHT:
                this.x += 1
                break
            default:
                break
        }
    }

    private generateLevel() {
        this.generateTiles()
    }

    private generateTiles() {
        for (let i = 0; i < this.numTiles; i++) {
            this.tiles[i] = []

            for (let j = 0; j < this.numTiles; j++) {
                if (Math.random() < 0.3 || !this.inBounds(i, j)) {
                    const newWall = new Wall(i, j)
                    this.tiles[i][j] = newWall
                } else {
                    const newFloor = new Floor(i, j)
                    this.tiles[i][j] = newFloor
                }
            }
        }
    }

    private inBounds(x: number, y: number) {
        return x > 0 && y > 0 && x < this.numTiles - 1 && y < this.numTiles - 1
    }
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
