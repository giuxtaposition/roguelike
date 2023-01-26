import { randomRange, shuffle, tryTo } from "../utils/utils"
import type { Entity, Player } from "./Entity"
import { Floor, Wall, type Tile } from "./Tile"

export default class Map {
    readonly tileSize = 64
    readonly numTiles = 9
    readonly uiWidth = 4

    tiles: Tile[][] = []

    constructor() {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ==
                this.getConnectedTiles(this.getRandomPassableTile()).length
            )
        })
    }

    public getAdjacentPassableTiles(x: number, y: number): Tile[] {
        return this.getAdjacentTiles(x, y).filter(tile => tile.passable)
    }

    public getRandomPassableTile(): Tile {
        let tile: Tile

        tryTo("get random passable tile", () => {
            let x = randomRange(0, this.numTiles - 1)
            let y = randomRange(0, this.numTiles - 1)
            tile = this.getTile(x, y)
            return tile.passable
        })

        return tile
    }

    public getTile(x: number, y: number): Tile {
        if (this.inBounds(x, y)) {
            return this.tiles[x][y]
        } else {
            return new Wall(x, y)
        }
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
}
