import type { ScoreObject, scoreStore } from "../stores/scores"
import { playSound } from "../stores/sounds"
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
    private _startingHealth = 3
    private _maxHealth = 10
    private _maxLevel = 6
    private _gameState = GameState.Loading
    private _score = 0
    private _enemies: Entity[] = []
    private _level: number
    private _map: Map
    private _player: Player
    private _spawnRate: number
    private _spawnCounter: number
    private _scoreStore: scoreStore

    constructor(scoreStore: scoreStore) {
        this._scoreStore = scoreStore
    }

    public start() {
        this._level = 1
        this.startLevel(this._startingHealth)
        this._gameState = GameState.Running
    }

    public movePlayer(direction: Direction) {
        let moved = false
        switch (direction) {
            case Direction.UP:
                moved = this.tryToMovePlayer(
                    this._map.getTileAtDistanceXY(this._player.tile, 0, -1)
                )
                break
            case Direction.DOWN:
                moved = this.tryToMovePlayer(
                    this._map.getTileAtDistanceXY(this._player.tile, 0, 1)
                )
                break
            case Direction.LEFT:
                moved = this.tryToMovePlayer(
                    this._map.getTileAtDistanceXY(this._player.tile, -1, 0)
                )
                break
            case Direction.RIGHT:
                moved = this.tryToMovePlayer(
                    this._map.getTileAtDistanceXY(this._player.tile, 1, 0)
                )
                break
            default:
                break
        }

        if (moved) {
            this.tick()
        }
    }

    public tryToMovePlayer(destinationTile: Tile): boolean {
        if (destinationTile instanceof Exit && !destinationTile.entity) {
            this.playerSteppedOnExitTile()
        }

        if (destinationTile.hasTreasure) {
            this.playerSteppedOnTreasure(destinationTile)
        }

        return this._player.tryToMove(destinationTile)
    }

    public castSpell(spellIndex: number) {
        this._player.castSpell(spellIndex, this)
    }

    public startLevel(playerHealth: number) {
        this._enemies = []
        this._spawnRate = 15
        this._spawnCounter = this._spawnRate
        this.generateLevel()
        this._player = new Player(
            this._map.getRandomPassableTile(),
            playerHealth
        )
        this._map.getRandomPassableTile().replace(Exit)
    }

    public get score() {
        return this._score
    }

    public get gameState() {
        return this._gameState
    }

    public set gameState(gameState: GameState) {
        this._gameState = gameState
    }

    public get player() {
        return this._player
    }

    public get map() {
        return this._map
    }

    public get enemies() {
        return this._enemies
    }

    public get maxHealth() {
        return this._maxHealth
    }

    public get level() {
        return this._level
    }

    public set level(level: number) {
        this._level = level
    }

    public get maxLevel() {
        return this._maxLevel
    }

    private addScore(won: boolean) {
        let scores = this._scoreStore.get()
        let scoreObject: ScoreObject = {
            score: this._score,
            run: 1,
            totalScore: this._score,
            active: won,
        }

        let lastScore = scores.pop()

        if (lastScore) {
            if (lastScore.active) {
                scoreObject.run = lastScore.run + 1

                scoreObject.totalScore += lastScore.totalScore
            } else {
                scores.push(lastScore)
            }
        }

        scores.push(scoreObject)

        this._scoreStore.set(scores)
    }

    private tick() {
        for (let i = this._enemies.length - 1; i >= 0; i--) {
            const currentEnemy = this._enemies[i]
            if (currentEnemy.isAlive) {
                currentEnemy.update(
                    this._map.getAdjacentTiles(currentEnemy.tile),
                    this._player,
                    this._map.getTileAtDistanceXY.bind(this._map)
                )
            } else {
                this.removeEnemy(i)
            }
        }

        if (!this._player.isAlive) {
            this.addScore(false)
            this._gameState = GameState.GameOver
        }

        this._spawnCounter--
        if (this._spawnCounter <= 0) {
            this.spawnEnemies()
            this._spawnCounter = this._spawnRate
            this._spawnRate--
        }
    }

    private playerSteppedOnExitTile() {
        playSound("newLevel")
        if (this._level == this._maxLevel) {
            this.addScore(true)
            this._gameState = GameState.GameOver
        } else {
            this._level += 1

            this.startLevel(Math.min(this._maxHealth, this._player.health + 1))
        }
    }

    private playerSteppedOnTreasure(tile: Tile) {
        playSound("treasure")
        this._score += 1

        if (this._score % 3 == 0 && this._player.numberOfSpells < 9) {
            this._player.numberOfSpells++
            this._player.addRandomSpell()
        }

        tile.hasTreasure = false
        this.spawnEnemies()
    }

    private removeEnemy(index: number) {
        this._enemies.splice(index, 1)
    }

    private generateLevel() {
        this._map = new Map()
        this.generateEnemies()
        this.generateTreasures()
    }

    private generateTreasures() {
        for (let i = 0; i < 3; i++) {
            this._map.getRandomPassableTile().hasTreasure = true
        }
    }

    private generateEnemies() {
        let numberOfEnemies = this._level + 1

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

        this._enemies.push(new enemyType(this._map.getRandomPassableTile()))
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
