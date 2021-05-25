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
        {id: 'Anions', unl() { return FUNCTIONS.anions.unl() || player.anions.unl }, style: 'anion_tab'},
        {id: 'Cations', unl() { return FUNCTIONS.cations.unl() || player.cations.unl }, style: 'cation_tab'},
    ],
    2: {
        'Cations': [
            {id: 'Cation Generators', unl() { return true }, style: 'cation_tab'},
            {id: 'Cation Challenges', unl() { return UPGRADES.includesUpgrade('3-6') }, style: 'cation_tab'},
        ],
    },
}

const AUTOS = {
    cols: 4,
    1: {id: 'elec_buyable', title: 'Auto-Electron Buyables', unl() { return UPGRADES.includesUpgrade('2-2') }},
    2: {id: 'elec_gens', title: 'Auto-Electron Generators', unl() { return UPGRADES.includesUpgrade('2-2') }},
    3: {id: 'anti_anion', title: 'Auto-Anti-Anion', unl() { return UPGRADES.includesUpgrade('3-5') }},
    4: {id: 'type_anion', title: 'Auto-Type Anion', unl() { return UPGRADES.includesUpgrade('3-5') }},
}

const FUNCTIONS = {
    chTabs(i, x) {
        player.tabs[i] = x
        for (let j = i+1; j < player.tabs.length; j++) player.tabs[j] = 0
    },
    getElectronGain() {
        let gain = E(1)
        if (BUYABLES.electrons.getLevel(2).gte(1)) gain = gain.mul(BUYABLES.electrons[2].effect().mult)
        if (FUNCTIONS.anions.types.have(1).gte(1) || player.cations.unl) gain = gain.mul(FUNCTIONS.anions.types[1].effect().mult)
        if (player.eg_length > 0) gain = gain.mul(this.electrical_generators.getEffect(1))
        if (player.cations.gen_length > 0) gain = gain.mul(FUNCTIONS.cations.generators[1].effect())
        if (UPGRADES.includesUpgrade('1-6')) gain = gain.mul(UPGRADES[1][6].effect().electrons)
        if (UPGRADES.includesUpgrade('1-12')) gain = gain.mul(UPGRADES[1][12].effect())
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
            if (player.cations.gen_length > 1) gain = gain.mul(FUNCTIONS.cations.generators[2].effect())
            return gain
        },
        getCost(x, lvl = player.electrical_generators[x].lvl) { return E(1.5+0.25*(x-1)).pow(lvl).mul(ELEC_GEN_COST[x-1]) },
        getLvlEffect(x) { return player.electrical_generators[x].lvl.add(1) },
        getEffect(x) {
            let eff = player.electrical_generators[x].powers.add(1).pow(E(0.5).pow(x**(1/3)))
            if ((FUNCTIONS.anions.types.have(2).gte(1) || player.cations.unl) && x > 1) eff = eff.mul(FUNCTIONS.anions.types[2].effect().mult)
            if (player.cations.gen_length > 1) eff = eff.mul(FUNCTIONS.cations.generators[2].effect())
            if (UPGRADES.includesUpgrade('1-1')) eff = eff.mul(UPGRADES[1][1].effect())
            if (UPGRADES.includesUpgrade('1-11')) eff = eff.pow(1.15)
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
            if (UPGRADES.includesUpgrade('2-11')) gain = gain.pow(0.02).add(1)
            else gain = gain.logBase(5).add(1)

            if (player.cations.unl) gain = gain.mul(FUNCTIONS.cations.effect().mult)
            if (UPGRADES.includesUpgrade('1-6')) gain = gain.mul(UPGRADES[1][6].effect().anions)    
            if (UPGRADES.includesUpgrade('2-4')) gain = gain.mul(5)
            if (UPGRADES.includesUpgrade('2-6')) gain = gain.mul(UPGRADES[2][6].effect())
            if (UPGRADES.includesUpgrade('2-10')) gain = gain.mul(UPGRADES[2][10].effect())
            if (UPGRADES.includesUpgrade('3-1')) gain = gain.mul(UPGRADES[3][1].effect())
            if (UPGRADES.includesUpgrade('2-9')) gain = gain.pow(1.5)
            return gain.floor()
        },
        canReset() { return this.gain().gte(1) },
        reset() {
            if (this.canReset()) {
                player.anions.points = player.anions.points.add(this.gain())
                if (!player.anions.unl) player.anions.unl = true
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
            if (!UPGRADES.includesUpgrade('2-7')) player.upgrades.buyed[1] = []
        },
        effect() {
            let eff = player.anions.points.pow(2)
            if (UPGRADES.includesUpgrade('1-7')) eff = eff.pow(UPGRADES[1][7].effect())
            return eff
        },
        anti_anions: {
            req(x=player.anions.anti_anions) {
                let req = E(1.5).pow(x.pow(UPGRADES.includesUpgrade('3-3')?1.5:2).mul(UPGRADES.includesUpgrade('1-8')?2/3:1)).mul(3000)
                if (UPGRADES.includesUpgrade('1-9')) req = req.div(UPGRADES[1][9].effect())
                return req
            },
            canReset() { return player.anions.points.gte(this.req()) },
            reset() {
                if (this.canReset()) {
                    player.anions.anti_anions = player.anions.anti_anions.add(1)
                    if (!UPGRADES.includesUpgrade('3-2')) this.doReset()
                }
            },
            doReset(msg) {
                player.anions.points = E(0)
                player.anions.charges = E(0)
                player.anions.types = {}
            },
            effect() {
                var x = player.anions.anti_anions.add(player.cations.unl?FUNCTIONS.cations.effect().add:0)
                if (player.cations.gen_length > 3) x = x.mul(FUNCTIONS.cations.generators[4].effect())
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
            ratio: ['+1', '50%', '100%'],
            changeRatio(x) { player.anions.ratio_types = this.ratio[x] },
            have(x) { return (player.anions.types[x] !== undefined) ? player.anions.types[x] : E(0) },
            canPut() { return FUNCTIONS.anions.charges.getUnspentCharged().gte(1) },
            put(x) {
                if (this.canPut()) {
                    if (player.anions.types[x] === undefined) player.anions.types[x] = E(0)
                    if (UPGRADES.includesUpgrade("3-2") && player.anions.ratio_types != '+1' && FUNCTIONS.anions.charges.getUnspentCharged().gt(1)) {
                        player.anions.types[x] = player.anions.types[x].add(FUNCTIONS.anions.charges.getUnspentCharged().mul((player.anions.ratio_types == '50%')?0.5:1).floor())
                    }
                    else player.anions.types[x] = player.anions.types[x].add(1)
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
                    if (player.anions.anti_anions.gte(1) || player.cations.unl) lvl = lvl.add(FUNCTIONS.anions.anti_anions.effect().add)
                    let eff = {}

                    eff.base = E(2)
                    if (player.anions.anti_anions.gte(1) || player.cations.unl) eff.base = eff.base.mul(FUNCTIONS.anions.anti_anions.effect().str)

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
                    if (player.anions.anti_anions.gte(1) || player.cations.unl) lvl = lvl.add(FUNCTIONS.anions.anti_anions.effect().add)
                    let eff = {}

                    eff.base = E(4)
                    if (player.anions.anti_anions.gte(1) || player.cations.unl) eff.base = eff.base.mul(FUNCTIONS.anions.anti_anions.effect().str)

                    eff.mult = eff.base.pow(lvl)
                    return eff
                },
                effDesc(x = this.effect()) { return format(x.mult, 1)+'x' },
            },
        },
    },
    cations: {
        unl() { return player.anions.points.gte(1e9) },
        gain() {
            let gain = player.anions.points.div(1e9)
            if (gain.lt(1)) return E(0)
            gain = gain.pow(2/5)

            gain = gain.softcap(1e4,0.1,0)

            if (UPGRADES.includesUpgrade('3-4')) gain = gain.mul(UPGRADES[3][4].effect())

            return gain.floor()
        },
        canReset() { return CHALLENGES.cation.isIn(0)?this.gain().gte(1):CHALLENGES.cation.canComplete() },
        reset() {
            if (this.canReset()) {
                if (CHALLENGES.cation.isIn(0)) player.cations.points = player.cations.points.add(this.gain())
                else {
                    if (!player.cations.chals.completed.includes(player.cations.chals.active)) player.cations.chals.completed.push(player.cations.chals.active)
                    CHALLENGES.cation.exitChal()
                    return
                }
                if (!player.cations.unl) player.cations.unl = true
                this.doReset()
            }
        },
        doReset(msg) {
            FUNCTIONS.anions.anti_anions.doReset()
            player.anions.anti_anions = E(0)
            if (!UPGRADES.includesUpgrade('3-4') || msg == 'cation_chal') player.upgrades.buyed[2] = []
            if (msg == 'cation_chal') for (let x = 1; x <= 5; x++) if (player.cations.generators[x] !== undefined) player.cations.generators[x] = E(0)
            FUNCTIONS.anions.doReset()
        },
        effect(x=player.cations.points) {
            let eff = {}

            eff.mult = E(1)
            if (CHALLENGES.cation.isIn(0)) eff.mult = x.mul(2).add(1).pow(3/4)

            eff.add = E(0)
            if (CHALLENGES.cation.isIn(0)) eff.add = x.add(1).pow(1/3).sub(1).softcap(10,5,1).softcap(50,1/5,0)

            return eff
        },
        generators: {
            types: [null, 'Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Quinary'],
            costs: [E(1), E(5), E(500), E(250000), E(2.5e6), E(1/0)],
            getType(x, n = x - 1) { return this.types[n - Math.floor(n/(this.types.length-1))*(this.types.length-1) + 1] },
            have(x) { return (player.cations.generators[x] !== undefined)?player.cations.generators[x]:E(0) },
            getGainEffect(x, g = this.have(x), n = this.have(this.types.indexOf(this.getType(x+1)))) {
                let eff = {}
                eff.owner = g.add(1).log10().add(1)
                eff.next = n.add(1).root(x+1)
                return eff
            },
            getGain(x) {
                let gain = this.getGainEffect(x).owner
                if (x < player.cations.gen_length || player.cations.gen_length == 5) gain = gain.mul(this.getGainEffect(x).next)
                if (UPGRADES.includesUpgrade('1-10')) gain = gain.mul(UPGRADES[1][10].effect())
                if (player.cations.gen_boosts.gte(1)) gain = gain.mul(this.getBoostEffect())
                return gain
            },
            getCost() { return (player.cations.gen_length < 5)?this.costs[player.cations.gen_length]:E(2).pow(player.cations.gen_boosts.pow(1.5)).mul(5e6) },
            canBuyGen() { return player.cations.points.gte(this.getCost()) },
            buyGen() {
                if (this.canBuyGen()) {
                    player.cations.points = player.cations.points.sub(this.getCost())
                    if (player.cations.gen_length < 5) {
                        player.cations.gen_length++
                        player.cations.generators[player.cations.gen_length] = E(0)
                    } else {
                        player.cations.gen_boosts = player.cations.gen_boosts.add(1)
                    }
                }
            },
            getBoostEffect(x=player.cations.gen_boosts) { return E(2).pow(x) },
            1: {
                id: 1,
                desc(eff = this.effect()) { return `boosts electrons gain by ${format(eff, 2)}x` },
                effect(x = FUNCTIONS.cations.generators.have(this.id)) {
                    let pow = E(1.5)
                    if (player.cations.gen_length > 4) pow = pow.mul(FUNCTIONS.cations.generators[5].effect())
                    let eff = x.add(1).pow(pow)
                    return eff
                }
            },
            2: {
                id: 2,
                desc(eff = this.effect()) { return `boosts electrical powers from electrical generators & him effects by ${format(eff, 2)}x` },
                effect(x = FUNCTIONS.cations.generators.have(this.id)) {
                    let pow = E(1.5)
                    if (player.cations.gen_length > 4) pow = pow.mul(FUNCTIONS.cations.generators[5].effect())
                    let eff = x.add(1).pow(pow)
                    return eff
                }
            },
            3: {
                id: 3,
                desc(eff = this.effect()) { return `adds ${format(eff, 2)} free electron’s buyable except “New Generation”` },
                effect(x = FUNCTIONS.cations.generators.have(this.id)) {
                    let pow = E(1.125)
                    if (player.cations.gen_length > 4) pow = pow.mul(FUNCTIONS.cations.generators[5].effect())
                    let eff = x.add(1).log10().add(1).pow(pow)
                    return eff
                }
            },
            4: {
                id: 4,
                desc(eff = this.effect()) { return `makes anti-electrical anions are ${format(eff.sub(1).mul(100), 2)}% stronger` },
                effect(x = FUNCTIONS.cations.generators.have(this.id)) {
                    let pow = E(0.125)
                    if (player.cations.gen_length > 4) pow = pow.mul(FUNCTIONS.cations.generators[5].effect())
                    let eff = x.add(1).log10().add(1).pow(pow)
                    return eff
                }
            },
            5: {
                id: 5,
                desc(eff = this.effect()) { return `makes each type of cation generator (except this cation) are ${format(eff.sub(1).mul(100), 2)}% stronger` },
                effect(x = FUNCTIONS.cations.generators.have(this.id)) {
                    let eff = x.add(1).log10().add(1).pow(0.1)
                    return eff
                }
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
                var lvl = x
                if (player.cations.gen_length > 2) lvl = lvl.add(FUNCTIONS.cations.generators[3].effect())

                let eff = {}
                eff.base = E(2)
                if (UPGRADES.includesUpgrade('1-3')) eff.base = eff.base.mul(UPGRADES[1][3].effect())

                eff.mult = E(eff.base).pow(lvl)
                return eff
            },
            effDesc(x = this.effect()) { return format(x.mult, 1)+'x' }
        },
        2: {
            id: 2,
            unl() { return !CHALLENGES.cation.isIn(1) },
            title: 'More Electrons',
            desc() { return 'Multiple electrons gain by '+format(this.effect().base, 1)+'x' },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return E(2).pow(x.pow(1.5).mul(UPGRADES.includesUpgrade('2-1')?0.5:1)).mul(10) },
            bulk() { return player.electrons.gte(10)?player.electrons.div(10).max(1).logBase(2).div(UPGRADES.includesUpgrade('2-1')?0.5:1).max(1).root(1.5).add(1).floor():E(0) },
            effect(x = BUYABLES.electrons.getLevel(this.id)) {
                var lvl = x
                if (player.cations.gen_length > 2) lvl = lvl.add(FUNCTIONS.cations.generators[3].effect())

                let eff = {}
                eff.base = E(2)
                if (BUYABLES.electrons.getLevel(5).gte(1)) eff.base = eff.base.add(BUYABLES.electrons[5].effect().add)
                if (UPGRADES.includesUpgrade('1-2')) eff.base = eff.base.mul(UPGRADES[1][2].effect())

                eff.mult = E(eff.base).pow(lvl)
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
                var lvl = x
                if (player.cations.gen_length > 2) lvl = lvl.add(FUNCTIONS.cations.generators[3].effect())
                
                let eff = {}
                eff.base = E(1)
                if (UPGRADES.includesUpgrade('2-5')) eff.base = eff.base.mul(UPGRADES[2][5].effect())

                eff.mult = eff.base.mul(lvl).add(1).pow(1.5)
                return eff
            },
            effDesc(x = this.effect()) { return format(x.mult, 1)+'x' }
        },
        5: {
            id: 5,
            unl() { return UPGRADES.includesUpgrade('1-5') },
            title: 'Stronger Electrons',
            desc() { return 'Increase base from electron buyable “More Electrons” by '+format(this.effect().base, 2) },
            cost(x = BUYABLES.electrons.getLevel(this.id)) { return E(2.5).pow(x.pow(2).mul(UPGRADES.includesUpgrade('2-8')?0.5:1)).mul(1e45) },
            bulk() { return player.electrons.gte(1e45)?player.electrons.div(1e45).max(1).logBase(2.5).div(UPGRADES.includesUpgrade('2-8')?0.5:1).max(1).root(2).add(1).floor():E(0) },
            effect(x = BUYABLES.electrons.getLevel(this.id)) {
                let eff = {}
                var lvl = x
                if (player.cations.gen_length > 2) lvl = lvl.add(FUNCTIONS.cations.generators[3].effect())

                eff.base = E(0.1)
                if (CHALLENGES.cation.completed(1)) eff.base = eff.base.mul(CHALLENGES.cation[1].effect())

                eff.add = lvl.mul(eff.base)
                return eff
            },
            effDesc(x = this.effect()) { return '+'+format(x.add, 2) }
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