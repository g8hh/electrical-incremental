//text() { return `Hello!` },
//image: 'images/plasma_charge.png',
//tooltip() { return `OOOH!` },

const PLASMA = {
    maps: {
        44: {
            unl() { return player.plasma.points.gte(1) },
            type: 'text',
            text() { return `↖` },
            size: 70,
        },
        46: {
            unl() { return false },
            type: 'text',
            text() { return `↗` },
            size: 70,
        },
        64: {
            unl() { return false },
            type: 'text',
            text() { return `↙` },
            size: 70,
        },
        66: {
            unl() { return false },
            type: 'text',
            text() { return `↘` },
            size: 70,
        },
        55: {
            unl() { return true },
            type: 'button',
            text() { return `Plasma Powers Amount: ${format(player.plasma.points, 0)}\nRequire: ${format(PLASMA.require(), 0)} cations` },
        },
        33: {
            unl() { return player.plasma.points.gte(1) },
            type: 'button',
            image: 'images/plasma_volume.png',
            tab: 1,
            tooltip() { return `You have ${format(player.plasma.resources.volume)} (+${format(PLASMA.resources.volume.gain())}/s) m^3 of plasma, which boosts electrons and electrical powers from electrical generators gain by ${format(PLASMA.resources.volume.effect().mult,2)}x, and boosts plasma particles gain by ${format(PLASMA.resources.volume.effect().part,2)}x` },
        },
        37: {
            unl() { return false },
            type: 'button',
            image: 'images/plasma_mass.png',
        },
        73: {
            unl() { return false },
            type: 'button',
            image: 'images/plasma_charge.png',
        },
        77: {
            unl() { return false },
            type: 'button',
            image: 'images/plasma_temp.png',
        },
    },
    resources: {
        volume: {
            gain() {
                let gain = E(1)
                if (player.plasma.buyables.volume.gte(1)) gain = gain.mul(PLASMA.buyables.volume.effect())
                return gain.div(1e3)
            },
            effect(x=player.plasma.resources.volume.mul(1e3)) {
                let eff = {}
                eff.mult = x.add(1).pow(2)
                eff.part = x.add(1).log10().div(2).add(1)
                return eff
            },
        },
    },
    buyables: {
        volume: {
            cost(x=player.plasma.buyables.volume) { return E(1.5).pow(x).mul(10).div(1e6) },
            canBuy() { return player.plasma.particles.gte(this.cost()) },
            buy() {
                if (this.canBuy()) {
                    player.plasma.particles = player.plasma.particles.sub(this.cost())
                    player.plasma.buyables.volume = player.plasma.buyables.volume.add(1)
                }
            },
            effect(x=player.plasma.buyables.volume) {
                let eff = x.add(1)
                return eff
            },
        },
    },
    choosedPlasma(x) {
        if (this.maps[x].tooltip !== undefined) player.plasma_choosed = x
    },
    require(x=player.plasma.points) { return E(10).pow(x.pow(1.25)).mul(1e12) },
    canReset() { return player.cations.points.gte(this.require()) },
    onClick(x) {
        if (x == 55 && this.canReset()) {
            if (!player.plasma.unl) player.plasma.unl = true
            player.plasma.points = player.plasma.points.add(1)
            this.doReset()
        }
        if (this.maps[x].tab !== undefined) {
            FUNCTIONS.chTabs(1, this.maps[x].tab)
            player.plasma_choosed = 0
        }
    },
    doReset(msg) {
        player.cations.points = E(0)
        player.cations.generators = {}
        player.cations.gen_length = 0
        player.cations.gen_boosts = E(0)
        player.cations.chals.active = 0
        player.cations.chals.completed = []
        player.upgrades.buyed[3] = []
        FUNCTIONS.cations.doReset()
    },
    getParticlesGain() {
        let gain = E(2).pow(player.plasma.points).sub(1)
        gain = gain.mul(PLASMA.resources.volume.effect().part)
        return gain.div(1e6)
    },
}