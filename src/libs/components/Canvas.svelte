<script lang="ts">
    import { onMount } from "svelte"
    import type { Entity } from "../game/entities/Entity"
    import Map from "../game/Map"
    import Game, { Direction, GameState } from "../game/Game"
    import { scores, type ScoreObject } from "../stores/store"

    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D

    const spritesheet = new Image()
    spritesheet.src = "spritesheet.png"
    spritesheet.onload = showTitle
    const game = new Game(scores)

    $: setInterval(draw, 15)

    function onKeyPress(e: KeyboardEvent) {
        switch (game.getGameState()) {
            case GameState.Title:
                game.start()
                break
            case GameState.GameOver:
                showTitle()
                break
            case GameState.Running:
                if (e.key == "w") game.movePlayer(Direction.UP)
                if (e.key == "s") game.movePlayer(Direction.DOWN)
                if (e.key == "a") game.movePlayer(Direction.LEFT)
                if (e.key == "d") game.movePlayer(Direction.RIGHT)
                break
            default:
                break
        }
    }

    function showTitle() {
        context.fillStyle = "rgba(0,0,0,.75)"
        context.fillRect(0, 0, canvas.width, canvas.height)
        game.setGameState(GameState.Title)

        drawText("a simple", 40, true, canvas.height / 2 - 110, "white")
        drawText("ROGUELIKE", 70, true, canvas.height / 2 - 50, "white")
        drawScores()
    }

    function draw() {
        if (
            game.getGameState() === GameState.Running ||
            game.getGameState() === GameState.GameOver
        ) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            drawTiles()
            drawPlayer()
            drawEnemies()
            drawText("Level: " + game.getLevel(), 30, false, 40, "#bd516d")
            drawText("Score: " + game.getScore(), 30, false, 70, "#bd516d")
        }
    }

    function drawEnemies() {
        for (let i = 0; i < game.getEnemies().length; i++) {
            const enemy = game.getEnemies()[i]
            const { x, y } = enemy.getDisplayCoordinates()

            if (enemy.getTeleportCounter() > 0) {
                drawSprite(10, x, y)
            } else {
                drawSprite(enemy.getSprite(), x, y)
                drawHealth(enemy, x, y)
            }

            enemy.smoothMoveAnimation()
        }
    }

    function drawPlayer() {
        const player = game.getPlayer()
        const { x, y } = player.getDisplayCoordinates()
        drawSprite(player.getSprite(), x, y)
        drawHealth(player, x, y)
        player.smoothMoveAnimation()
    }

    function drawTiles() {
        for (let i = 0; i < Map.numTiles; i++) {
            for (let j = 0; j < Map.numTiles; j++) {
                const tile = game.getMap().getTile(i, j)
                const { x, y } = tile.getCoordinates()
                drawSprite(tile.getSprite(), x, y)
                if (tile.getTreasure()) {
                    drawSprite(12, x, y)
                }
            }
        }
    }

    function drawSprite(sprite: number, x: number, y: number) {
        context.drawImage(
            spritesheet,
            sprite * 16,
            0,
            16,
            16,
            x * Map.tileSize,
            y * Map.tileSize,
            Map.tileSize,
            Map.tileSize
        )
    }

    function drawHealth(entity: Entity, x: number, y: number) {
        for (let i = 0; i < entity.getHealth(); i++) {
            drawSprite(
                9,
                x + (i % 3) * (4 / 16),
                y - Math.floor(i / 3) * (5 / 16)
            )
        }
    }

    function drawScores() {
        let scoresObj: ScoreObject[] = $scores

        if (scoresObj.length) {
            drawText(
                padding(["RUN", "SCORE", "TOTAL"]),
                18,
                true,
                canvas.height / 2,
                "white"
            )

            let newestScore = scoresObj.pop()

            scoresObj.sort((a, b) => b.totalScore - a.totalScore)

            scoresObj.unshift(newestScore)

            for (let i = 0; i < Math.min(10, scoresObj.length); i++) {
                let scoreText = padding([
                    scoresObj[i].run.toString(),
                    scoresObj[i].score.toString(),
                    scoresObj[i].totalScore.toString(),
                ])

                drawText(
                    scoreText,
                    18,
                    true,
                    canvas.height / 2 + 24 + i * 24,
                    i === 0 ? "#81c0c6" : "#e5858c"
                )
            }
        }
    }

    function padding(textArray: string[]) {
        let finalText = ""

        textArray.forEach(text => {
            text += ""
            for (let i = text.length; i < 10; i++) {
                text += " "
            }
            finalText += text
        })

        return finalText
    }

    function drawText(
        text: string,
        size: number,
        centered: boolean,
        textY: number,
        color: string
    ) {
        context.fillStyle = color

        context.font = size + "px monospace"

        let textX

        if (centered) {
            textX = (canvas.width - context.measureText(text).width) / 2
        } else {
            textX = Map.tileSize * Map.numTiles + 25
        }

        context.fillText(text, textX, textY)
    }

    onMount(() => {
        context = canvas.getContext("2d")
        canvas.width = Map.tileSize * (Map.numTiles + Map.uiWidth)
        canvas.height = Map.tileSize * Map.numTiles
        canvas.style.width = canvas.width + "px"
        canvas.style.height = canvas.height + "px"

        context.imageSmoothingEnabled = false
    })
</script>

<canvas bind:this={canvas} />
<svelte:window on:keydown|preventDefault={onKeyPress} />

<style lang="sass">
canvas
    margin: 1rem
</style>
