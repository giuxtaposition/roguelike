<script lang="ts">
    import { onDestroy, onMount } from "svelte"

    let canvas: HTMLCanvasElement

    let context: CanvasRenderingContext2D
    const width = window.innerWidth
    const height = window.innerHeight

    let x = 0
    let y = 0

    $: setInterval(draw, 15)

    function onKeyPress(e: KeyboardEvent) {
        if (e.key == "w") y -= 1

        if (e.key == "s") y += 1

        if (e.key == "a") x -= 1

        if (e.key == "d") x += 1
    }

    function draw() {
        console.log("drawing")
        console.log("x", x)
        console.log("y", y)
        context.clearRect(0, 0, width, height)
        context.fillRect(x * 20, y * 20, 20, 20)
    }

    onMount(() => {
        context = canvas.getContext("2d")
    })

    onDestroy(() => {})
</script>

<canvas bind:this={canvas} {width} {height} />
<svelte:window on:keydown|preventDefault={onKeyPress} />

<style lang="sass">

</style>
