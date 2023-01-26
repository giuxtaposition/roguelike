<script lang="ts">
    import { onMount } from "svelte"
    import type { Entity } from "../game/Entity"
    import Game, { Direction } from "../game/Game"

    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D

    const spritesheet = new Image()
    spritesheet.src = "spritesheet.png"
    const game = new Game()

    $: setInterval(draw, 15)

    function onKeyPress(e: KeyboardEvent) {
        if (e.key == "w") game.movePlayer(Direction.UP)
        if (e.key == "s") game.movePlayer(Direction.DOWN)
        if (e.key == "a") game.movePlayer(Direction.LEFT)
        if (e.key == "d") game.movePlayer(Direction.RIGHT)
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawTiles()
        drawPlayer()
        drawEnemies()
    }

    function drawEnemies() {
        for (let i = 0; i < game.enemies.length; i++) {
            const enemy = game.enemies[i]

            drawSprite(enemy.sprite, enemy.tile.x, enemy.tile.y)
            drawHealth(enemy, enemy.tile.x, enemy.tile.y)
        }
    }

    function drawPlayer() {
        drawSprite(game.player.sprite, game.player.tile.x, game.player.tile.y)
        drawHealth(game.player, game.player.tile.x, game.player.tile.y)
    }

    function drawTiles() {
        for (let i = 0; i < game.map.numTiles; i++) {
            for (let j = 0; j < game.map.numTiles; j++) {
                const tile = game.map.getTile(i, j)
                drawSprite(tile.sprite, tile.x, tile.y)
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
            x * game.map.tileSize,
            y * game.map.tileSize,
            game.map.tileSize,
            game.map.tileSize
        )
    }

    function drawHealth(entity: Entity, x: number, y: number) {
        for (let i = 0; i < entity.health; i++) {
            drawSprite(
                9,

                x + (i % 3) * (4 / 16),

                y - Math.floor(i / 3) * (5 / 16)
            )
        }
    }

    onMount(() => {
        context = canvas.getContext("2d")
        canvas.width =
            game.map.tileSize * (game.map.numTiles + game.map.uiWidth)
        canvas.height = game.map.tileSize * game.map.numTiles
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
    outline: 1px solid white
</style>