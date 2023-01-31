import { Player } from "../../../libs/game/entities/Player"
import Game from "../../../libs/game/Game"
import Map from "../../../libs/game/Map"
import {
    Fire,
    HealingAura,
    SpellFactory,
    SpellName,
    Teleport,
} from "../../../libs/game/Spell"
import { vi } from "vitest"

describe("Spell", () => {
    const game = new Game(vi.fn() as any)

    test("SpellFactory creates correct Spell based on spell name", () => {
        expect(SpellFactory.newSpell(SpellName.HEALING_AURA)).toBeInstanceOf(
            HealingAura
        )
        expect(SpellFactory.newSpell(SpellName.TELEPORT)).toBeInstanceOf(
            Teleport
        )
        expect(SpellFactory.newSpell(SpellName.FIRE)).toBeInstanceOf(Fire)
    })

    test("Healing Aura should heal the player and all entities on adjacent tiles", () => {
        game.start()
        const { x, y } = game.player.tile.coordinates
        const adjacentTilesWithEntities = [
            game.map.getTile(x - 1, y),
            game.map.getTile(x + 1, y),
            game.map.getTile(x, y - 1),
            game.map.getTile(x, y + 1),
        ].filter(tile => tile.entity)
        const previousHealths = adjacentTilesWithEntities.map(
            tile => tile.entity.health
        )
        const healingAura = new HealingAura()

        healingAura.castSpell(game)

        expect(game.player.health).toBe(4)
        previousHealths.forEach((previousHealth, index) => {
            expect(adjacentTilesWithEntities[index].entity.health).toBe(
                previousHealth + 1
            )
        })
    })

    test("Teleport moves player to random passable tile", () => {
        game.start()
        const previousCoordinates = game.player.tile.coordinates

        const teleport = new Teleport()

        teleport.castSpell(game)

        expect(game.player.tile.coordinates).not.toEqual(previousCoordinates)
    })

    test("Fire hurts all entities on adjacent tiles", () => {
        game.start()
        const { x, y } = game.player.tile.coordinates
        const adjacentTilesWithEntities = [
            game.map.getTile(x - 1, y),
            game.map.getTile(x + 1, y),
            game.map.getTile(x, y - 1),
            game.map.getTile(x, y + 1),
        ].filter(tile => tile.entity)
        const previousHealths = adjacentTilesWithEntities.map(
            tile => tile.entity.health
        )
        const fire = new Fire()

        fire.castSpell(game)

        previousHealths.forEach((previousHealth, index) => {
            expect(adjacentTilesWithEntities[index].entity.health).toBe(
                previousHealth - 1
            )
        })
    })
})
