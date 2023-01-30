<script lang="ts">
    import Canvas from "./libs/components/Canvas.svelte"
</script>

<main>
    <Canvas />
</main>

<style lang="sass">
    :global(body)
        background-color: #383552
        text-align: center
        margin: 0
        padding: 0
        height: 100vh
        width: 100vw

    main
        display: flex
        justify-content: center
        align-items: center
        height: 100%
</style>
