var diff = 0;
var date = Date.now();
var player

const ELEC_GEN_COST = [E(1e2), E(1e4), E(1e7), E(1e11), E(1e18), E(1/0)]

const TABS = {
    1: [
        {id: 'Electrons', unl() { return true }, style: 'normal_tab'},
        {id: 'Options', unl() { return true }, style: 'normal_tab'},
        {id: 'Achievements', unl() { return false }, style: 'normal_tab'},
        {id: 'Automatons', unl() { return player.anions.unl }, style: 'normal_tab'},
        {id: 'Upgrades', unl() { return player.upgrades.unl }, style: 'normal_tab'},
        {id: 'Anions', unl() { return player.anions.unl }, style: 'anion_tab'},
    ],
    2: {

    },
}

const AUTOS = {
    cols: 2,
    1: {id: 'elec_buyable', title: 'Auto-Electron Buyables', unl() { return UPGRADES.includesUpgrade('2-2') }},
    2: {id: 'elec_gens', title: 'Auto-Electron Generators', unl() { return UPGRADES.includesUpgrade('2-2') }},
}

const FUNCTIONS = {
    chTabs(i, x) {
        player.tabs[i] = x
        for (let j = i+1; j < player.tabs.length; j++) player.tabs[j] = 0
    },
    getElectronGain() {
        let gain = E(1)
        if (BUYABLES.electrons.getLevel(2).gte(1)) gain = gain.mul(BUYABLES.electrons[2].effect().mult)
        if (FUNCTIONS.anions.types.have(1).gte(1)) gain = gain.mul(FUNCTIONS.anions.types[1].effect().mult)
        if (player.eg_length > 0) gain = gain.mul(this.electrical_generators.getEffect(1))
        if (UPGRADES.includesUpgrade('1-6')) gain = gain.mul(UPGRADES[1][6].effect().electrons)
        if (UPGRADES.includesUpgrade('1-4')) gain = gain.pow(1.15)
        return gain
    },
    getElectricalCapacity() {
        let cap = E(100)
        if (BUYABLES.electrons.getLevel(1).gte(1)) cap = cap.mul(BUYABLES.electrons[1].effect().mult)
        return cap
    },
    electrical_generators: {
        getPowerGain(x) {
            let gain = E(1).mul(this.getLvlEffect(x))
            if (x < player.eg_length) gain = gain.mul(this.getEffect(x+1))
            if (BUYABLES.electrons.getLevel(4).gte(1)) gain = gain.mul(BUYABLES.electrons[4].effect().mult)
            return gain
        },
        getCost(x, lvl = player.electrical_generators[x].lvl) { return E(1.5+0.25*(x-1)).pow(lvl).mul(ELEC_GEN_COST[x-1]) },
        getLvlEffect(x) { return player.electrical_generators[x].lvl.add(1) },
        getEffect(x) {
            let eff = player.electrical_generators[x].powers.add(1).pow(E(0.5).pow(x**(1/3)))
            if (FUNCTIONS.anions.types.have(2).gte(1) && x > 1) eff = eff.mul(FUNCTIONS.anions.types[2].effect().mult)
            if (UPGRADES.includesUpgrade('1-1')) eff = eff.mul(UPGRADES[1][1].effect())
            return eff
        },
        can(x) { return player.electrons.gte(this.getCost(x)) },
        buy(x) {
            if (this.can(x)) {
                if (!UPGRADES.includesUpgrade('2-5')) player.electrons = player.electrons.sub(this.getCost(x))
                player.electrical_generators[x].lvl = player.electrical_generators[x].lvl.add(1)
            }
        },
        getBulk(x) { return player.electrons.gte(ELEC_GEN_COST[x-1])?player.electrons.div(ELEC_GEN_COST[x-1]).max(1).logBase(1.5+0.25*(x-1)).add(1).floor():E(0) },
        bulk(x) {
            if (this.can(x)) {
                let bulk = this.getBulk(x)
                if (!UPGRADES.includesUpgrade('2-5')) player.electrons = player.electrons.sub(this.getCost(x, bulk.sub(1)))
                player.electrical_generators[x].lvl = bulk
            }
        },
    },
    anions: {
        unl() { return player.electrons.gte(1e10) },
        gain() {
            let gain = player.electrons.div(1e10)
            if (gain.lt(1)) return E(0)
            gain = gain.logBase(5).add(1)

            if (UPGRADES.includesUpgrade('1-6')) gain = gain.mul(UPGRADES[1][6].effect().anions)    
            if (UPGRADES.includesUpgrade('2-4')) gain = gain.mul(5)
            if (UPGRADES.includesUpgrade('2-6')) gain = gain.mul(UPGRADES[2][6].effect())
            return gain.floor()
        },
        canReset() { return this.gain().gte(1) },
        reset() {
            if (this.canReset()) {
                player.anions.points = player.anions.points.add(this.gain())
                if (!player.upgrades.unl) player.upgrades.unl = true
                this.doReset()
            }
        },
        doReset(msg) {
            player.electrons = E(0)
            player.electron_upgrades = {}
            player.electrical_generators = {}
            player.eg_length = 0
            if (player.anions.respec_types) player.anions.types = {}
            if (player.upgrades.buyed[1] !== undefined && !UPGRADES.includesUpgrade('2-7')) player.upgrades.buyed[1] = []
        },
        effect() {
            let eff = player.anions.points.pow(2)
            if (UPGRADES.includesUpgrade('1-7')) eff = eff.pow(UPGRADES[1][7].effect())
            return eff
        },
        anti_anions: {
            req(x=player.anions.anti_anions) { return E(1.5).pow(x.pow(2).mul(UPGRADES.includesUpgrade('1-8')?2/3:1)).mul(3000) },
            canReset() { return player.anions.points.gte(this.req()) },
            reset() {
                if (this.canReset()) {
                    player.anions.anti_anions = player.anions.anti_anions.add(1)
                    this.doReset()
                }
            },
            doReset(msg) {
                player.anions.points = E(0)
                player.anions.charges = E(0)
                player.anions.types = {}
            },
            effect(x=player.anions.anti_anions) {
                let eff = {}

                eff.str = x.add(1).pow(1/5)
                eff.strDesc = eff.str.sub(1).mul(100)

                eff.add = x.pow(1/2)

                return eff
            },
        },
        charges: {
            gain() {
                let gain = FUNCTIONS.anions.effect()
                if (UPGRADES.includesUpgrade('2-3')) gain = gain.mul(UPGRADES[2][3].effect())
                return gain
            },
            getCharged() {
                let gain = player.anions.charges.max(1).log10()
                return gain.floor()
            },
            getUnspentCharged() {
                let spent = E(0)
                for (let x = 1; x <= FUNCTIONS.anions.types.cols; x++) spent = spent.add(FUNCTIONS.anions.types.have(x))
                return this.getCharged().sub(spent).floor()
            },
        },
        types: {
            have(x) { return (player.anions.types[x] !== undefined) ? player.anions.types[x] : E(0) },
            canPut() { return FUNCTIONS.anions.charges.getUnspentCharged().gte(1) },
            put(x) {
                if (this.canPut()) {
                    if (player.anions.types[x] === undefined) player.anions.types[x] = E(0)
                    player.anions.types[x] = player.anions.types[x].add(1)
                }
            },
            cols: 2,
            1: {
                id: 1,
                unl() { return true },
                title: 'Electronic Anions',
                desc() { return 'Multiply electrons gain by '+format(this.effect().base, 1)+'x' },
                effect(x = FUNCTIONS.anions.types.have(this.id)) {
                    var lvl = x
                    if (player.anions.anti_anions.gte(1)) lvl = lvl.add(FUNCTIONS.anions.anti_anions.effect().add)
                    let eff = {}

                    eff.base = E(2)
                    if (player.anions.anti_anions.gte(1)) eff.base = eff.base.mul(FUNCTIONS.anions.anti_anions.effect().str)

                    eff.mult = eff.base.pow(lvl)
                    return eff
                },
                effDesc(x = this.effect()) { return format(x.mult, 1)+'x' },
            },
            2: {
                id: 2,
                unl() { return true },
                title: 'Electro-Generatize Anions',
                desc() { return 'Multiply electrical generators (except for first) effects by '+format(this.effect().base, 1)+'x' },
                effect(x = FUNCTIONS.anions.types.have(this.id)) {
                    var lvl = x
                    if (player.anions.anti_anions.gte(1)) lvl = lvl.add(FUNCTIONS.anions.anti_anions.effect().add)
                    let eff = {}

                    eff.base = E(4)
                    if (player.anions.anti_anions.gte(1)) eff.base = eff.base.mul(FUNCTIONS.anions.anti_anions.effect().str)

                    eff.mult = eff.base.pow(lvl)
                    return eff
                },
                effDesc(x = this.effect()) { return format(x.mult, 1)+'x' },
            },
        },
    },
}

const BUYABLES = {
    electrons: {
        getLevel(x) { return (player.electron_upgrades[x] !== undefined)?player.electron_upgrades[x]:E(0) },
        can(x) { return this[x].unl() && player.electrons.gte(this[x].cost()) },
        buy(x) {
            if (this.can(x)) {
                if (!UPGRADES.includesUpgrade('2-5')) player.electrons = player.electrons.sub(this[x].cost())
                if (player.electron_upgrades[x] === undefined) player.electron_upgrades[x] = E(0)
                player.electron_upgrades[x] = player.electron_upgrades[x].add(1)

                if (x == 3) {
                    player.eg_length++
                    player.electrical_generators[player.eg_length] = { powers: E(0), lvl: E(0) }
                }
            }
        },
        bulk(x) { 
            if (this[x].bulk === undefined) return
            if (this.can(x)) {
                let bulk = this[x].bulk()
                let cost = this[x].cost(bulk.sub(1))
                if (!UPGRADES.includesUpgrade('2-5')) player.electrons = player.electrons.sub(cost)
                if (player.electron_upgrades[x] === undefined) player.electron_upgrades[x] = E(0)
                player.electron_upgrades[x] = bulk
            }
        },
        cols: 5,
        1: {
            id: 1,
            unl() { return true },
            title: 'Electrical Capacity',
            desc() { return 'Multiple electrical capacities by '+format(this.effect().base, 1)+'x' },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return E(2).pow(x).mul(100) },
            bulk() { return player.electrons.gte(100)?player.electrons.div(100).max(1).logBase(2).add(1).floor():E(0) },
            effect(x = BUYABLES.electrons.getLevel(this.id)) {
                let eff = {}
                eff.base = E(2)
                if (UPGRADES.includesUpgrade('1-3')) eff.base = eff.base.mul(UPGRADES[1][3].effect())

                eff.mult = E(eff.base).pow(x)
                return eff
            },
            effDesc(x = this.effect()) { return format(x.mult, 1)+'x' }
        },
        2: {
            id: 2,
            unl() { return true },
            title: 'More Electrons',
            desc() { return 'Multiple electrons gain by '+format(this.effect().base, 1)+'x' },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return E(2).pow(x.pow(1.5).mul(UPGRADES.includesUpgrade('2-1')?0.5:1)).mul(10) },
            bulk() { return player.electrons.gte(10)?player.electrons.div(10).max(1).logBase(2).div(UPGRADES.includesUpgrade('2-1')?0.5:1).max(1).root(1.5).add(1).floor():E(0) },
            effect(x = BUYABLES.electrons.getLevel(this.id)) {
                let eff = {}
                eff.base = E(2)
                if (BUYABLES.electrons.getLevel(5).gte(1)) eff.base = eff.base.add(BUYABLES.electrons[5].effect())
                if (UPGRADES.includesUpgrade('1-2')) eff.base = eff.base.mul(UPGRADES[1][2].effect())

                eff.mult = E(eff.base).pow(x)
                return eff
            },
            effDesc(x = this.effect()) { return format(x.mult, 1)+'x' }
        },
        3: {
            id: 3,
            unl() { return BUYABLES.electrons.getLevel(this.id).lt(ELEC_GEN_COST.length-1) },
            title: 'New Generation',
            desc() { return 'Unlock new electrical generator' },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return ELEC_GEN_COST[x.toNumber()] },
        },
        4: {
            id: 4,
            unl() { return player.eg_length > 1 },
            title: 'More Electrical Powers',
            desc() { return 'Increase electrical powers from electrical generators multiplier by '+format(this.effect().base, 1)+', raise this effect by 1.5' },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return E(3).pow(x.mul(UPGRADES.includesUpgrade('1-5')?0.85:1)).mul(1000) },
            bulk() { return player.electrons.gte(1000)?player.electrons.div(1000).max(1).logBase(3).div(UPGRADES.includesUpgrade('1-5')?0.85:1).add(1).floor():E(0) },
            effect(x = BUYABLES.electrons.getLevel(this.id)) {
                let eff = {}
                eff.base = E(1)
                if (UPGRADES.includesUpgrade('2-5')) eff.base = eff.base.mul(UPGRADES[2][5].effect())

                eff.mult = eff.base.mul(x).add(1).pow(1.5)
                return eff
            },
            effDesc(x = this.effect()) { return format(x.mult, 1)+'x' }
        },
        5: {
            id: 5,
            unl() { return UPGRADES.includesUpgrade('1-5') },
            title: 'Stronger Electrons',
            desc() { return 'Increase base from electron buyable “More Electrons” by 0.1' },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return E(2.5).pow(x.pow(2).mul(UPGRADES.includesUpgrade('2-8')?0.5:1)).mul(1e45) },
            bulk() { return player.electrons.gte(1e45)?player.electrons.div(1e45).max(1).logBase(2.5).div(UPGRADES.includesUpgrade('2-8')?0.5:1).max(1).root(2).add(1).floor():E(0) },
            effect(x = BUYABLES.electrons.getLevel(this.id)) {
                return x.mul(0.1)
            },
            effDesc(x = this.effect()) { return '+'+format(x, 1) }
        },
    },

}

function loop() {
    diff = Date.now()-date;
    calc(diff/1000);
    date = Date.now();
}

function format(ex, acc=3) {
    ex = E(ex)
    if (ex.isInfinite()) return 'Infinity'
    let e = ex.log10().floor()
    if (e.lt(9)) {
        if (e.lt(3)) {
            return ex.toFixed(acc)
        }
        return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } else {
        if (ex.gte("eeee10")) {
            let slog = ex.slog()
            return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(3)) + "F" + format(slog.floor(), 0)
        }
        let m = ex.div(E(10).pow(e))
        return (e.log10().gte(9)?'':m.toFixed(3))+'e'+format(e,0)
    }
}

setInterval(loop, 50)