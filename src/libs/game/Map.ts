import { randomRange, shuffle, tryTo } from "../utils/utils"
import { Floor, Wall, type Tile } from "./Tile"

export default class Map {
    static readonly tileSize = 64
    static readonly numTiles = 9
    static readonly uiWidth = 4

    private tiles: Tile[][] = []

    constructor() {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ==
                this.getConnectedTiles(this.getRandomPassableTile()).length
            )
        })
    }

    public getAdjacentPassableTiles(tile: Tile): Tile[] {
        return this.getAdjacentTiles(tile).filter(tile => tile.getIsPassable())
    }

    public getRandomPassableTile(): Tile {
        let tile: Tile

        tryTo("get random passable tile", () => {
            let x = randomRange(0, Map.numTiles - 1)
            let y = randomRange(0, Map.numTiles - 1)
            tile = this.getTile(x, y)
            return tile.getIsPassable()
        })

        return tile
    }

    public getTile(x: number, y: number): Tile {
        if (Map.inBounds(x, y)) {
            return this.tiles[x][y]
        } else {
            return new Wall(x, y, this)
        }
    }

    public getAdjacentTiles(tile: Tile): Tile[] {
        const { x, y } = tile.getCoordinates()
        return shuffle([
            this.getTile(x, y - 1),
            this.getTile(x, y + 1),
            this.getTile(x - 1, y),
            this.getTile(x + 1, y),
        ])
    }

    public getTiles() {
        return this.tiles
    }

    public static inBounds(x: number, y: number) {
        return x > 0 && y > 0 && x < Map.numTiles - 1 && y < Map.numTiles - 1
    }

    private generateTiles() {
        let passableTiles = 0

        for (let i = 0; i < Map.numTiles; i++) {
            this.tiles[i] = []
            for (let j = 0; j < Map.numTiles; j++) {
                if (Math.random() < 0.3 || !Map.inBounds(i, j)) {
                    this.tiles[i][j] = new Wall(i, j, this)
                } else {
                    this.tiles[i][j] = new Floor(i, j, this)

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
