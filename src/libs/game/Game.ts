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
import { Exit, Tile } from "./Tile"

export default class Game {
    private startingHealth = 3
    private maxHealth = 10
    private maxLevel = 6
    private gameState = GameState.Loading
    private score = 0
    private enemies: Entity[] = []
    private level: number
    private map: Map
    private player: Player
    private spawnRate: number
    private spawnCounter: number

    public start() {
        this.level = 1
        this.startLevel(this.startingHealth)
        this.gameState = GameState.Running
    }

    public movePlayer(direction: Direction) {
        let moved = false
        switch (direction) {
            case Direction.UP:
                moved = this.tryToMovePlayer(0, -1)
                break
            case Direction.DOWN:
                moved = this.tryToMovePlayer(0, 1)
                break
            case Direction.LEFT:
                moved = this.tryToMovePlayer(-1, 0)
                break
            case Direction.RIGHT:
                moved = this.tryToMovePlayer(1, 0)
                break
            default:
                break
        }

        if (moved) {
            this.tick()
        }
    }

    public getScore() {
        return this.score
    }

    public getGameState() {
        return this.gameState
    }

    public setGameState(gameState: GameState) {
        this.gameState = gameState
    }

    public getPlayer() {
        return this.player
    }

    public getMap() {
        return this.map
    }

    public getEnemies() {
        return this.enemies
    }

    public getMaxHealth() {
        return this.maxHealth
    }

    public getLevel() {
        return this.level
    }

    public updateLevel() {
        this.level += 1
    }

    public getMaxLevel() {
        return this.maxLevel
    }

    public startLevel(playerHealth: number) {
        this.enemies = []
        this.spawnRate = 15
        this.spawnCounter = this.spawnRate
        this.generateLevel()
        this.player = new Player(this.map.getRandomPassableTile(), playerHealth)
        this.map.getRandomPassableTile().replace(Exit)
    }

    private tick() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const currentEnemy = this.enemies[i]
            if (currentEnemy.getIsAlive()) {
                currentEnemy.update(
                    this.map.getAdjacentTiles(currentEnemy.getTile()),
                    this.player,
                    this.map.getTileAtDistanceXY.bind(this.map)
                )
            } else {
                this.removeEnemy(i)
            }
        }

        if (!this.player.getIsAlive()) {
            this.gameState = GameState.GameOver
        }

        this.spawnCounter--
        if (this.spawnCounter <= 0) {
            this.spawnEnemies()
            this.spawnCounter = this.spawnRate
            this.spawnRate--
        }
    }

    private tryToMovePlayer(distanceX: number, distanceY: number): boolean {
        const destinationTile = this.map.getTileAtDistanceXY(
            this.player.getTile(),
            distanceX,
            distanceY
        )

        if (destinationTile instanceof Exit && !destinationTile.getEntity()) {
            this.playerSteppedOnExitTile()
        }

        if (destinationTile.getTreasure()) {
            this.playerSteppedOnTreasure(destinationTile)
        }

        return this.player.tryToMove(destinationTile)
    }

    private playerSteppedOnExitTile() {
        if (this.level == this.maxLevel) {
            this.setGameState(GameState.GameOver)
        } else {
            this.level += 1

            this.startLevel(
                Math.min(this.maxHealth, this.player.getHealth() + 1)
            )
        }
    }

    private playerSteppedOnTreasure(tile: Tile) {
        this.score += 1
        tile.setTreasure(false)
        this.spawnEnemies()
    }

    private removeEnemy(index: number) {
        this.enemies.splice(index, 1)
    }

    private generateLevel() {
        this.map = new Map()

        this.generateEnemies()

        this.generateTreasures()
    }

    private generateTreasures() {
        for (let i = 0; i < 3; i++) {
            this.map.getRandomPassableTile().setTreasure(true)
        }
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

export enum GameState {
    Title = "title",
    GameOver = "gameOver",
    Running = "running",
    Loading = "loading",
}
