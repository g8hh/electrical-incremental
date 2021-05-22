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
    rows: 2,
    1: {
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
        cols: 8,
        1: {
            unl() { return true },
            desc() { return `Multiply electrical generator’s effects based on the sum of levels on these generators.` },
            cost() { return E(1e12) },
            effect() {
                let lvls = E(1)
                for (let x = 1; x <= player.eg_length; x++) lvls = lvls.mul(player.electrical_generators[x].lvl.add(1))
                lvls = lvls.pow(1/3).softcap(50, 0.5, 0)
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
    },
    2: {
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
        cols: 8,
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
            desc() { return `Electron Buyables & Generators are no longer buys with electrons, and unspent anions boost electron’s buyable “More Electrical Powers” effect.` },
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
    },
}