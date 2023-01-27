import { shuffle } from "../utils/utils"
import {
    type Enemy,
    CoolDuck,
    DogWithMustache,
    Black,
    Slime,
    OneEyedDemon,
} from "./entities/enemies"
import type { Entity } from "./entities/Entity"
import { Player } from "./entities/Player"

import Map from "./Map"
import type { Tile } from "./Tile"

export default class Game {
    level = 1
    map: Map
    enemies: Entity[] = []
    player: Player

    constructor() {
        this.generateLevel()

        this.player = new Player(this.map.getRandomPassableTile())
    }

    public movePlayer(direction: Direction) {
        let moved = false
        switch (direction) {
            case Direction.UP:
                moved = this.player.tryToMove(
                    this.getTileAtDistanceXY(this.player, 0, -1)
                )
                break
            case Direction.DOWN:
                moved = this.player.tryToMove(
                    this.getTileAtDistanceXY(this.player, 0, 1)
                )
                break
            case Direction.LEFT:
                moved = this.player.tryToMove(
                    this.getTileAtDistanceXY(this.player, -1, 0)
                )
                break
            case Direction.RIGHT:
                moved = this.player.tryToMove(
                    this.getTileAtDistanceXY(this.player, 1, 0)
                )
                break
            default:
                break
        }

        if (moved) {
            this.tick()
        }
    }

    private tick() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const currentEnemy = this.enemies[i]
            if (currentEnemy.getIsAlive()) {
                currentEnemy.update(
                    this.map.getAdjacentTiles(currentEnemy.getTile()),
                    this.player,
                    this.getTileAtDistanceXY.bind(this)
                )
            } else {
                this.removeEnemy(i)
            }
        }
    }

    private removeEnemy(index: number) {
        this.enemies.splice(index, 1)
    }

    private getTileAtDistanceXY(
        entity: Entity,
        distanceX: number,
        distanceY: number
    ): Tile {
        const { x, y } = entity.getTile().getCoordinates()
        return this.map.getTile(x + distanceX, y + distanceY)
    }

    private generateLevel() {
        this.map = new Map()

        this.generateEnemies()
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

        this.enemies.push(new enemyType(this.map.getRandomPassableTile()))
    }
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
