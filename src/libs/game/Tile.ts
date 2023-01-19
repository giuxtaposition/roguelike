import { shuffle } from "../utils/utils"
import type Game from "./Game"

export class Tile {
    x: number
    y: number
    sprite: number
    passable: boolean
    game: Game

    constructor(
        x: number,
        y: number,
        sprite: number,
        passable: boolean,
        game: Game
    ) {
        this.x = x
        this.y = y
        this.sprite = sprite
        this.passable = passable
        this.game = game
    }

    public getConnectedTiles() {
        let connectedTiles: Tile[] = [this]
        let frontier: Tile[] = [this]

        while (frontier.length) {
            let neighbors = frontier
                .pop()
                .getAdjacentPassableNeighbors()
                .filter(tile => !connectedTiles.includes(tile))

            connectedTiles = connectedTiles.concat(neighbors)
            frontier = frontier.concat(neighbors)
        }

        return connectedTiles
    }

    getNeighbor(dx: number, dy: number) {
        return this.game.getTile(this.x + dx, this.y + dy)
    }

    getAdjacentNeighbors() {
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
        ])
    }

    getAdjacentPassableNeighbors() {
        return this.getAdjacentNeighbors().filter(t => t.passable)
    }
}

export class Floor extends Tile {
    constructor(x: number, y: number, game: Game) {
        super(x, y, 2, true, game)
    }
}

export class Wall extends Tile {
    constructor(x: number, y: number, game: Game) {
        super(x, y, 3, false, game)
    }
}
