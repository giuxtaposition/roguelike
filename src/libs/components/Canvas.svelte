<script lang="ts">
    import { onMount } from "svelte"

    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D
    const tileSize = 64
    const numTiles = 9
    const uiWidth = 4

    let x = 0
    let y = 0

    const spritesheet = new Image()
    spritesheet.src = "spritesheet.png"

    $: setInterval(draw, 15)

    function onKeyPress(e: KeyboardEvent) {
        if (e.key == "w") y -= 1

        if (e.key == "s") y += 1

        if (e.key == "a") x -= 1

        if (e.key == "d") x += 1
    }
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        drawSprite(0, x, y)
    }

    function drawSprite(sprite: number, x: number, y: number) {
        context.drawImage(
            spritesheet,
            sprite * 16,
            0,
            16,
            16,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
        )
    }

    onMount(() => {
        context = canvas.getContext("2d")
        canvas.width = tileSize * (numTiles + uiWidth)
        canvas.height = tileSize * numTiles
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
