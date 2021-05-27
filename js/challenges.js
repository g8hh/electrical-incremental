const CHALLENGES = {
    cation: {
        isIn(x) { return player.cations.chals.active==x },
        completed(x) { return player.cations.chals.completed.includes(x) },
        msg(x) { return this.isIn(x)?"Running":this.completed(x)?"Completed":"Start" }, 
        exitChal() {
            player.cations.chals.active = 0
            FUNCTIONS.cations.doReset()
        },
        onChal(x) {
            if (this.isIn(0)) {
                player.cations.chals.active = x
                FUNCTIONS.cations.doReset('cation_chal')
            }
        },
        canComplete(x=player.cations.chals.active) { return player.electrons.gte(this[x].goal()) },
        progress(x=player.cations.chals.active) {
            let f = player.electrons.max(1).log10().max(1).log10().div(this[x].goal().log10().log10()).max(0).min(100)
            return format(f.mul(100))+'%'
        },
        cols: 4,
        1: {
            title: 'Lesser Electrons',
            desc() { return `You cannot buy electron buyable “More Electrons”` },
            goal() { return E(1e100) },
            reward(eff = this.effect()) { return `Cations boost effect from electrical buyable “Stronger Electrons” by +${format(eff.sub(1).mul(100))}%` },
            effect() {
                let eff = player.cations.points.add(1).log10().add(1).pow(1/3)
                return eff
            },
        },
        2: {
            title: 'Scaled Buyable',
            desc() { return `Electron Buyables (except “Electrical Capacity” & “New Generation”) scaling is twice stronger.` },
            goal() { return E(1e160) },
            reward(eff = this.effect()) { return `Their electron buyable scaling is 15% weaker.` },
            effect() {
                let eff = E(1)
                return eff
            },
        },
        3: {
            title: 'Anti-Anion Gainer',
            desc() { return `You cannot gain Anions (like, you cannot buy anion upgrades, but only make Auto-Electron is unlocked and bulked)` },
            goal() { return E(1e100) },
            reward(eff = this.effect()) { return `Each type of cation generator is increased by 50% for every OoM of cations.\nCurrently: ${format(eff, 2)}x` },
            effect() {
                let eff = E(1.5).pow(player.cations.points.add(1).log10().mul(2))
                return eff
            },
        },
        4: {
            title: 'Weaker Resources',
            desc() { return `All pre-Cation resources are raised by 0.25` },
            goal() { return E(1e35) },
            reward(eff = this.effect()) { return `Unlock Plasma (coming soon)` },
            effect() {
                let eff = E(1)
                return eff
            },
        },
    },
}