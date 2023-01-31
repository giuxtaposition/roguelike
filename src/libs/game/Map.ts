import { randomRange, shuffle, tryTo } from "../utils/utils"
import type { Entity } from "./entities/Entity"
import { Floor, Wall, type Tile } from "./Tile"

export default class Map {
    static readonly tileSize = 64
    static readonly numTiles = 12
    static readonly uiWidth = 4

    private _tiles: Tile[][] = []

    constructor() {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ==
                this.getConnectedTiles(this.getRandomPassableTile()).length
            )
        })
    }

    public getTileAtDistanceXY(
        tile: Tile,
        distanceX: number,
        distanceY: number
    ): Tile {
        const { x, y } = tile.coordinates
        return this.getTile(x + distanceX, y + distanceY)
    }

    public getAdjacentPassableTiles(tile: Tile): Tile[] {
        return this.getAdjacentTiles(tile).filter(tile => tile.isPassable)
    }

    public getRandomPassableTile(): Tile {
        let tile: Tile

        tryTo("get random passable tile", () => {
            let x = randomRange(0, Map.numTiles - 1)
            let y = randomRange(0, Map.numTiles - 1)
            tile = this.getTile(x, y)
            return tile.isPassable
        })

        return tile
    }

    public getTile(x: number, y: number): Tile {
        if (Map.inBounds(x, y)) {
            return this._tiles[x][y]
        } else {
            return new Wall(x, y, this)
        }
    }

    public getAdjacentTiles(tile: Tile): Tile[] {
        const { x, y } = tile.coordinates
        return shuffle([
            this.getTile(x, y - 1),
            this.getTile(x, y + 1),
            this.getTile(x - 1, y),
            this.getTile(x + 1, y),
        ])
    }

    public get tiles() {
        return this._tiles
    }

    public static inBounds(x: number, y: number) {
        return x > 0 && y > 0 && x < Map.numTiles - 1 && y < Map.numTiles - 1
    }

    private generateTiles() {
        let passableTiles = 0

        for (let i = 0; i < Map.numTiles; i++) {
            this._tiles[i] = []
            for (let j = 0; j < Map.numTiles; j++) {
                if (Math.random() < 0.3 || !Map.inBounds(i, j)) {
                    this._tiles[i][j] = new Wall(i, j, this)
                } else {
                    this._tiles[i][j] = new Floor(i, j, this)

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
                currentTile
            ).filter(tile => !connectedTiles.includes(tile))

            connectedTiles = connectedTiles.concat(adjacentTiles)
            frontier = frontier.concat(adjacentTiles)
        }

        return connectedTiles
    }
}
