const UPGRADES = {
    getRC(id) {
        let r_c = id.split('-');
        return {r: r_c[0], c: r_c[1]}
    },
    pushIdToUpgrade(id) {
        let rc = this.getRC(id)
        if (player.upgrades.buyed[rc.r] === undefined) player.upgrades.buyed[rc.r] = []
        if (!this.includesUpgrade(id)) player.upgrades.buyed[rc.r].push(rc.c)
    },
    includesUpgrade(id) {
        let rc = this.getRC(id)
        if (player.upgrades.buyed[rc.r] === undefined) player.upgrades.buyed[rc.r] = []
        return (player.upgrades.buyed[rc.r] !== undefined)?player.upgrades.buyed[rc.r].includes(rc.c):false
    },
    rows: 4,
    1: {
        unl() { return player.anions.unl },
        rowID: 1,
        title: 'Pre-Anions',
        id: 'PreA',
        price: 'electrons',
        can(x) { return this[x].unl() && player.electrons.gte(this[x].cost()) && !UPGRADES.includesUpgrade(this.rowID+'-'+x) },
        buy(x) {
            if (this.can(x)) {
                player.electrons = player.electrons.sub(this[x].cost())
                UPGRADES.pushIdToUpgrade(this.rowID+'-'+x)
            }
        },
        cols: 13,
        1: {
            unl() { return true },
            desc() { return `Multiply electrical generator’s effects based on the sum of levels on these generators.` },
            cost() { return E(1e12) },
            effect() {
                let lvls = E(1)
                for (let x = 1; x <= player.eg_length; x++) lvls = lvls.mul(player.electrical_generators[x].lvl.add(1))
                lvls = lvls.pow(1/3).softcap(50, 0.5, 0)
                if (UPGRADES.includesUpgrade('2-9')) lvls = lvls.pow(UPGRADES[2][9].effect())
                return lvls
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        2: {
            unl() { return true },
            desc() { return `Electron buyable “More Electrons” is stronger based on levels from electron buyable “Electrical Capacity”.` },
            cost() { return E(1e15) },
            effect() {
                let eff = BUYABLES.electrons.getLevel(1).max(1).log10().add(1).pow(1/5)
                if (UPGRADES.includesUpgrade('2-9')) eff = eff.pow(UPGRADES[2][9].effect())
                return eff
            },
            effDesc(x=this.effect()) { return format(x.sub(1).mul(100), 2)+'%' },
        },
        3: {
            unl() { return true },
            desc() { return `Electron buyable “Electrical Capacity” is stronger based on anion charges.` },
            cost() { return E(1e21) },
            effect() {
                let eff = player.anions.charges.max(1).log10().add(1).log10().add(1).pow(1/3)
                return eff
            },
            effDesc(x=this.effect()) { return format(x.sub(1).mul(100), 2)+'%' },
        },
        4: {
            unl() { return true },
            desc() { return `Raise electrons gain by ^1.15` },
            cost() { return E(1e28) },
        },
        5: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Unlock new electron buyable and make electron buyable “More Electrical Powers” is 15% cheaper.` },
            cost() { return E(1e45) },
        },
        6: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Gain more anions based on unspent electrons, and unspent anions boost electrons gain.` },
            cost() { return E(1e63) },
            effect() {
                let eff = {}
                eff.anions = player.electrons.add(1).log10().add(1).pow(1/2)
                eff.electrons = player.anions.points.add(1).log10().add(1).pow(3)
                return eff
            },
            effDesc(x=this.effect()) { return format(x.anions, 2)+'x to anions gain, '+format(x.electrons, 2)+'x to electrons gain' },
        },
        7: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Anti-electrical anions boost anions effect.` },
            cost() { return E(1e72) },
            effect() {
                let eff = player.anions.anti_anions.add(1).pow(1/8)
                return eff
            },
            effDesc(x=this.effect()) { return '^'+format(x) },
        },
        8: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `The Anti-Electrical Anions requirement is 33% slower.` },
            cost() { return E(1e92) },
        },
        9: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Divide the anti-electrical anions requirement based on unspent electrons.` },
            cost() { return E(1e135) },
            effect() {
                let eff = player.electrons.add(1).log10().pow(player.electrons.add(1).log10().pow(1/4)).add(1)
                return eff
            },
            effDesc(x=this.effect()) { return '/'+format(x, 2) },
        },
        10: {
            unl() { return player.cations.unl },
            desc() { return `Each type of cation generator is multiplied based on unspent electrons.` },
            cost() { return E(1e230) },
            effect() {
                let eff = player.electrons.add(1).log10().add(1)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        11: {
            unl() { return player.cations.unl },
            desc() { return `Raise effects from electrical generators by ^1.15` },
            cost() { return E('e420') },
        },
        12: {
            unl() { return CHALLENGES.cation.completed(1) },
            desc() { return `Electrical capacity boosts electron gain at a reduced rate.` },
            cost() { return E('e1420') },
            effect() {
                let eff = FUNCTIONS.getElectricalCapacity().add(1).log10().add(1).pow(10)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        13: {
            unl() { return player.plasma.points.gte(4) },
            desc() { return `Unspent electrons boost the mass of plasma gain at a reduced rate.` },
            cost() { return E('e12100') },
            effect() {
                let eff = player.electrons.add(1).log10().add(1).pow(1/3)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
    },
    2: {
        unl() { return player.anions.unl },
        rowID: 2,
        title: 'Anions',
        id: 'A',
        price: 'anions',
        can(x) { return this[x].unl() && player.anions.points.gte(this[x].cost()) && !UPGRADES.includesUpgrade(this.rowID+'-'+x) },
        buy(x) {
            if (this.can(x)) {
                player.anions.points = player.anions.points.sub(this[x].cost())
                UPGRADES.pushIdToUpgrade(this.rowID+'-'+x)
            }
        },
        cols: 13,
        1: {
            unl() { return true },
            desc() { return `Make electron buyable “More Electrons” is 50% cheaper.` },
            cost() { return E(5) },
        },
        2: {
            unl() { return true },
            desc() { return `Unlock Auto-Electron (added on Automaton tab)` },
            cost() { return E(15) },
        },
        3: {
            unl() { return true },
            desc() { return `Gain more anion charges based on unspent electrons.` },
            cost() { return E(35) },
            effect() {
                let eff = player.electrons.max(1).log10().add(1)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        4: {
            unl() { return true },
            desc() { return `Gain 5x more anions.` },
            cost() { return E(100) },
        },
        5: {
            unl() { return true },
            desc() { return `Electron Buyables & Generators doesn't spend electrons, and unspent anions boost electron’s buyable “More Electrical Powers” effect.` },
            cost() { return E(1500) },
            effect() {
                let eff = player.anions.points.add(1).pow(1/2)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        6: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Gain more anions based on your anti-electrical anions.` },
            cost() { return E(3200) },
            effect() {
                let eff = player.anions.anti_anions.add(1).pow(1.5)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        7: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Keep electron upgrades on reset for anions.` },
            cost() { return E(1e5) },
        },
        8: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `You can bulk electron buyable & generators, and make electron buyable “Stronger Electrons” is 50% cheaper.` },
            cost() { return E(1e6) },
        },
        9: {
            unl() { return player.anions.anti_anions.gte(1) },
            desc() { return `Raise anions gain by ^1.5 and upgrades PreA-1 & 2 is boosted by anti-electrical anions.` },
            cost() { return E(5e6) },
            effect() {
                let eff = player.anions.anti_anions.add(1).pow(1/6)
                return eff
            },
            effDesc(x=this.effect()) { return '+'+format(x.sub(1).mul(100), 2)+'%' },
        },
        10: {
            unl() { return player.cations.unl },
            desc() { return `Gain more anions based on unspent electrons.` },
            cost() { return E(1e14) },
            effect() {
                let eff = player.electrons.add(1).log10().add(1).pow(0.8)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        11: {
            unl() { return player.cations.unl },
            desc() { return `Anion gain formula is better [log5(x)+1 → x^0.02+1]` },
            cost() { return E(1e24) },
        },
        12: {
            unl() { return player.cations.unl },
            desc() { return `You can bulk anti-electrical anions, and quinary cations boost powers from 5th electrical generator gain.` },
            cost() { return E(1e120) },
            effect() {
                let eff = FUNCTIONS.cations.generators.have(5).add(1).log10().add(1).log10().add(1)
                return eff
            },
            effDesc(x=this.effect()) { return '^'+format(x, 2) },
        },
        13: {
            unl() { return player.plasma.unl },
            desc() { return `Anions boosts power from “More Electrical Powers”.` },
            cost() { return E('e380') },
            effect() {
                let eff = player.anions.points.add(1).log10().add(1).pow(1/8)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+"x" },
        },
    },
    3: {
        unl() { return player.cations.unl },
        rowID: 3,
        title: 'Cations',
        id: 'C',
        price: 'cations',
        can(x) { return this[x].unl() && player.cations.points.gte(this[x].cost()) && !UPGRADES.includesUpgrade(this.rowID+'-'+x) },
        buy(x) {
            if (this.can(x)) {
                player.cations.points = player.cations.points.sub(this[x].cost())
                UPGRADES.pushIdToUpgrade(this.rowID+'-'+x)
            }
        },
        cols: 9,
        1: {
            unl() { return true },
            desc() { return `You can gain 1000x more anions, but this gets weaker the further you go (minimum 10x, at 1e10 anions).` },
            cost() { return E(5) },
            effect() {
                let eff = E(100).pow(E(10).sub(player.anions.points.add(1).log10()).max(0).div(10)).mul(10)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        2: {
            unl() { return true },
            desc() { return `Anti-Electrical Anions doesn’t reset anion features, unlock the new option of types of the charged anion.` },
            cost() { return E(200) },
        },
        3: {
            unl() { return true },
            desc() { return `Gain 10% of anions gain every second, the Anti-Electrical Anions requirement scaling is 25% weaker.` },
            cost() { return E(1500) },
        },
        4: {
            unl() { return true },
            desc() { return `Keep anion upgrades on reset, and anions boost cations gain at the reduced rate.` },
            cost() { return E(50000) },
            effect() {
                let eff = player.anions.points.add(1).log10().add(1).pow(0.5)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        5: {
            unl() { return true },
            desc() { return `Unlock Auto-Anti-Anion & Auto-Type Anion.` },
            cost() { return E(500000) },
        },
        6: {
            unl() { return true },
            desc() { return `Unlock Cation Challenges.` },
            cost() { return E(1e7) },
        },
        7: {
            unl() { return true },
            desc() { return `Charged Anions gain formula is better [log10(x) → log5(x)]. Unlock Auto-Upgrades (includes Pre-Anions & Anions)` },
            cost() { return E(2.5e8) },
        },
        8: {
            unl() { return true },
            desc() { return `Generator Boosters in Cations are 50% stronger, and electrons gain is increased by 2.5% for every OoM of electrons.` },
            cost() { return E(1e11) },
            effect() {
                let eff = E(1.025).pow(player.electrons.add(1).log10())
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        9: {
            unl() { return player.plasma.unl },
            desc() { return `Cations gain softcap^2 starts later based on your plasma powers..` },
            cost() { return E(1e21) },
            effect() {
                let eff = player.plasma.points.add(1).pow(2)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
    },
    4: {
        unl() { return player.plasma.unl },
        rowID: 4,
        numberFixed: 6,
        title: 'Plasma',
        id: 'P',
        price: 'plasma particles',
        can(x) { return this[x].unl() && player.plasma.particles.gte(this[x].cost()) && !UPGRADES.includesUpgrade(this.rowID+'-'+x) },
        buy(x) {
            if (this.can(x)) {
                player.plasma.particles = player.plasma.particles.sub(this[x].cost())
                UPGRADES.pushIdToUpgrade(this.rowID+'-'+x)
            }
        },
        cols: 5,
        1: {
            unl() { return true },
            desc() { return `Gain more plasma particles based on unspent electrons.` },
            cost() { return E(0.001) },
            effect() {
                let eff = player.electrons.add(1).log10().add(1).pow(0.25)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x' },
        },
        2: {
            unl() { return true },
            desc() { return `Cations gain softcap starts later based on unspent plasma particles.` },
            cost() { return E(0.025) },
            effect() {
                let eff = player.plasma.particles.mul(1e3).add(1)
                return eff
            },
            effDesc(x=this.effect()) { return format(x, 2)+'x later' },
        },
        3: {
            unl() { return true },
            desc() { return `Keep cation challenges on reset. Plasma Power makes the anion & cation effect is stronger.` },
            cost() { return E(0.125) },
            effect() {
                let eff = player.plasma.points.add(1).root(4)
                return eff
            },
            effDesc(x=this.effect()) { return format(x.sub(1).mul(100), 3)+'%' },
        },
        4: {
            unl() { return true },
            desc() { return `Gain 10% of cations gain every second.` },
            cost() { return E(1) },
        },
        5: {
            unl() { return true },
            desc() { return `Keep cation upgrade 3 on reset.` },
            cost() { return E(10) },
        },
    },
}