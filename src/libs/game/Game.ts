import { randomRange, shuffle, tryTo } from "../utils/utils"
import {
    Black,
    CoolDuck,
    DogWithMustache,
    Entity,
    OneEyedDemon,
    Player,
    Slime,
    type Enemy,
} from "./Entity"
import { Floor, Wall, type Tile } from "./Tile"

export default class Game {
    readonly tileSize = 64
    readonly numTiles = 9
    readonly uiWidth = 4

    level = 1
    tiles: Tile[][] = []
    enemies: Entity[] = []
    player: Player

    constructor() {
        this.generateLevel()

        this.player = new Player(this.randomPassableTile())
    }

    public movePlayer(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.tryToMove(this.player, 0, -1)
                break
            case Direction.DOWN:
                this.tryToMove(this.player, 0, 1)
                break
            case Direction.LEFT:
                this.tryToMove(this.player, -1, 0)
                break
            case Direction.RIGHT:
                this.tryToMove(this.player, 1, 0)
                break
            default:
                break
        }
    }

    public getTile(x: number, y: number): Tile {
        if (this.inBounds(x, y)) {
            return this.tiles[x][y]
        } else {
            return new Wall(x, y)
        }
    }

    private tryToMove(entity: Entity, distanceX: number, distanceY: number) {
        let newTile = this.getTile(
            entity.tile.x + distanceX,
            entity.tile.y + distanceY
        )

        if (newTile.passable) {
            if (!newTile.entity) {
                entity.move(newTile)
            }

            return true
        }
    }

    private generateLevel() {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ==
                this.getConnectedTiles(this.randomPassableTile()).length
            )
        })

        this.generateEnemies()
    }

    private generateTiles() {
        let passableTiles = 0

        for (let i = 0; i < this.numTiles; i++) {
            this.tiles[i] = []
            for (let j = 0; j < this.numTiles; j++) {
                if (Math.random() < 0.3 || !this.inBounds(i, j)) {
                    this.tiles[i][j] = new Wall(i, j)
                } else {
                    this.tiles[i][j] = new Floor(i, j)

                    passableTiles++
                }
            }
        }
        return passableTiles
    }

    private generateEnemies() {
        let numberOfEnemies = this.level + 1

        for (let i = 0; i < numberOfEnemies; i++) {
            this.spawnEnemies()
        }
    }

    private spawnEnemies() {
        let enemyType = shuffle<Enemy>([
            CoolDuck,
            DogWithMustache,
            Black,
            Slime,
            OneEyedDemon,
        ])[0]

        this.enemies.push(new enemyType(this.randomPassableTile()))
    }

    private getConnectedTiles(startingTile: Tile): Tile[] {
        let connectedTiles: Tile[] = [startingTile]
        let frontier: Tile[] = [startingTile]

        while (frontier.length) {
            let currentTile = frontier.pop()
            let adjacentTiles = this.getAdjacentPassableTiles(
                currentTile.x,
                currentTile.y
            ).filter(tile => !connectedTiles.includes(tile))

            connectedTiles = connectedTiles.concat(adjacentTiles)
            frontier = frontier.concat(adjacentTiles)
        }

        return connectedTiles
    }

    private getAdjacentPassableTiles(x: number, y: number): Tile[] {
        return this.getAdjacentTiles(x, y).filter(tile => tile.passable)
    }

    private getAdjacentTiles(x: number, y: number): Tile[] {
        return shuffle([
            this.getTile(x, y - 1),
            this.getTile(x, y + 1),
            this.getTile(x - 1, y),
            this.getTile(x + 1, y),
        ])
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
