import { Player } from "../../../libs/game/entities/Player"
import Map from "../../../libs/game/Map"
import { HealingAura, SpellFactory, SpellName } from "../../../libs/game/Spell"

describe("Spell", () => {
    test("SpellFactory creates correct Spell based on spell name", () => {
        expect(SpellFactory.newSpell(SpellName.HEALING_AURA)).toBeInstanceOf(
            HealingAura
        )
    })

    test("Healing Aura should heal the player and all entities on adjacent tiles", () => {
        const map = new Map()
        const player = new Player(map.getRandomPassableTile(), 3)
        const { x, y } = player.tile.coordinates
        const adjacentTilesWithEntities = [
            map.getTile(x - 1, y),
            map.getTile(x + 1, y),
            map.getTile(x, y - 1),
            map.getTile(x, y + 1),
        ].filter(tile => tile.entity)
        const previousHealths = adjacentTilesWithEntities.map(
            tile => tile.entity.health
        )
        const healingAura = new HealingAura()

        healingAura.castSpell(map, player)

        expect(player.health).toBe(4)
        previousHealths.forEach((previousHealth, index) => {
            expect(adjacentTilesWithEntities[index].entity.health).toBe(
                previousHealth + 1
            )
        })
    })
})
