import { shuffle } from "../utils/utils"
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
import Map from "./Map"

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
                moved = this.tryToMove(this.player, 0, -1)
                break
            case Direction.DOWN:
                moved = this.tryToMove(this.player, 0, 1)
                break
            case Direction.LEFT:
                moved = this.tryToMove(this.player, -1, 0)
                break
            case Direction.RIGHT:
                moved = this.tryToMove(this.player, 1, 0)
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
            if (currentEnemy.isAlive) {
                currentEnemy.update(
                    this.map.getAdjacentPassableTiles(
                        currentEnemy.tile.x,
                        currentEnemy.tile.y
                    ),
                    this.player,
                    this.tryToMove.bind(this)
                )
            } else {
                this.removeEnemy(i)
            }
        }
    }

    private removeEnemy(index: number) {
        this.enemies.splice(index, 1)
    }

    private tryToMove(entity: Entity, distanceX: number, distanceY: number) {
        let newTile = this.map.getTile(
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
