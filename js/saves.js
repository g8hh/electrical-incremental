function E(x){return new ExpantaNum(x)};
function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}
var next_type = true

ExpantaNum.prototype.softcap = function (start,force,mode){
    var x = this.clone()
    if([0,"pow"].includes(mode)) x = x.div(start).pow(force).mul(start).min(x)
    if([1,"mul"].includes(mode)) x = x.sub(start).div(force).add(start).min(x)
    return x
}

document.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--mouse-x', e.x);
    document.documentElement.style.setProperty('--mouse-y', e.y);
}, {passive: true});

function calc(dt) {
    player.time += dt

    var ele_gain = player.electrons.add(FUNCTIONS.getElectronGain().mul(dt))
    if (ele_gain.gte(FUNCTIONS.getElectricalCapacity())) player.electrons = FUNCTIONS.getElectricalCapacity()
    else player.electrons = ele_gain

    automatons()

    if (player.anions.unl) player.anions.charges = player.anions.charges.add(FUNCTIONS.anions.charges.gain().mul(dt))
    if (UPGRADES.includesUpgrade('3-3')) player.anions.points = player.anions.points.add(FUNCTIONS.anions.gain().mul(dt/10))

    for (let x = 1; x <= player.eg_length; x++) player.electrical_generators[x].powers = player.electrical_generators[x].powers.add(FUNCTIONS.electrical_generators.getPowerGain(x).mul(dt))
    for (let x = 1; x <= player.cations.gen_length; x++) player.cations.generators[x] = player.cations.generators[x].add(FUNCTIONS.cations.generators.getGain(x).mul(dt))
}

function automatons() {
    if (UPGRADES.includesUpgrade('2-2')) {
        if (player.automatons.elec_buyable) for (let x = 1; x <= BUYABLES.electrons.cols; x++) {
            if (UPGRADES.includesUpgrade('2-8') && x != 3) BUYABLES.electrons.bulk(x)
            else BUYABLES.electrons.buy(x)
        }
        if (player.automatons.elec_gens) for (let x = 1; x <= player.eg_length; x++) {
            if (UPGRADES.includesUpgrade('2-8')) FUNCTIONS.electrical_generators.bulk(x)
            else FUNCTIONS.electrical_generators.buy(x)
        }
    }
    if (UPGRADES.includesUpgrade('3-5')) {
        if (player.automatons.anti_anion) FUNCTIONS.anions.anti_anions.reset()
        if (player.automatons.type_anion) {
            var total = FUNCTIONS.anions.charges.getUnspentCharged()
            var first = E(0), second = E(0);
            if (next_type) {
                first = total.div(2).floor()
                second = total.sub(first).floor()
            } else {
                second = total.div(2).floor()
                first = total.sub(second).floor()
            }
            next_type = !next_type
            for (let x = 1; x <= 2; x++) if (player.anions.types[x] === undefined) player.anions.types[x] = E(0)
            player.anions.types[1] = player.anions.types[1].add(first)
            player.anions.types[2] = player.anions.types[2].add(second)
        }
    }
}
const PLAYER_DATA = {
    electrons: E(0),
    electron_upgrades: {},
    electrical_generators: {},
    time: 0,
    eg_length: 0,
    tabs: [0,0,0],
    anions: {
        unl: false,
        points: E(0),
        charges: E(0),
        types: {},
        respec_types: false,
        ratio_types: '+1',
        anti_anions: E(0),
    },
    cations: {
        unl: false,
        points: E(0),
        gen_length: 0,
        gen_boosts: E(0),
        generators: {},
        chals: {
            unlocked: false,
            active: 0,
            completed: [],
        },
    },
    upgrades: {
        unl: false,
        buyed: {},
    },
    upg_choosed: '',
    automatons: {},
}

function wipe() {
    player = PLAYER_DATA
}

function loadPlayer(load) {
    player = load
    checkIfUndefined()
    convertToExpantaNum()
    player.tabs = PLAYER_DATA.tabs
    player.upg_choosed = PLAYER_DATA.upg_choosed
}

function checkIfUndefined() {
    var data = PLAYER_DATA
    if (player.electrons === undefined) player.electrons = data.electrons
    if (player.electron_upgrades === undefined) player.electron_upgrades = data.electron_upgrades
    if (player.electrical_generators === undefined) player.electrical_generators = data.electrical_generators
    if (player.eg_length === undefined) player.eg_length = data.eg_length

    if (player.anions === undefined) player.anions = data.anions
    if (player.anions.unl === undefined) player.anions.unl = data.anions.unl
    if (player.anions.points === undefined) player.anions.points = data.anions.points
    if (player.anions.charges === undefined) player.anions.charges = data.anions.charges
    if (player.anions.types === undefined) player.anions.types = data.anions.types
    if (player.anions.respec_types === undefined) player.anions.respec_types = data.anions.respec_types
    if (player.anions.ratio_types === undefined) player.anions.ratio_types = data.anions.ratio_types
    if (player.anions.anti_anions === undefined) player.anions.anti_anions = data.anions.anti_anions

    if (player.cations === undefined) player.cations = data.cations
    if (player.cations.unl === undefined) player.cations.unl = data.cations.unl
    if (player.cations.points === undefined) player.cations.points = data.cations.points
    if (player.cations.gen_length === undefined) player.cations.gen_length = data.cations.gen_length
    if (player.cations.gen_boosts === undefined) player.cations.gen_boosts = data.cations.gen_boosts
    if (player.cations.generators === undefined) player.cations.generators = data.cations.generators

    if (player.cations.chals === undefined) player.cations.chals = data.cations.chals
    if (player.cations.chals.unlocked === undefined) player.cations.chals.unlocked = data.cations.chals.unlocked
    if (player.cations.chals.active === undefined) player.cations.chals.active = data.cations.chals.active
    if (player.cations.chals.completed === undefined) player.cations.chals.completed = data.cations.chals.completed

    if (player.upgrades === undefined) player.upgrades = data.upgrades
    if (player.upgrades.unl === undefined) player.upgrades.unl = data.upgrades.unl
    if (player.upgrades.buyed === undefined) player.upgrades.buyed = data.upgrades.buyed

    if (player.automatons === undefined) player.automatons = data.automatons
    for (let x = 1; x <= AUTOS.cols; x++) if (player.automatons[AUTOS[x].id] === undefined) player.automatons[AUTOS[x].id] = false
}

function convertToExpantaNum() {
    player.electrons = ex(player.electrons)
    for (let x = 1; x <= BUYABLES.electrons.cols; x++) if (player.electron_upgrades[x] !== undefined) player.electron_upgrades[x] = ex(player.electron_upgrades[x])
    for (let x = 1; x <= player.eg_length; x++) {
        player.electrical_generators[x].powers = ex(player.electrical_generators[x].powers)
        player.electrical_generators[x].lvl = ex(player.electrical_generators[x].lvl)
    }

    player.anions.points = ex(player.anions.points)
    player.anions.charges = ex(player.anions.charges)
    player.anions.anti_anions = ex(player.anions.anti_anions)
    for (let x = 1; x <= FUNCTIONS.anions.types.cols; x++) if (player.anions.types[x] !== undefined) player.anions.types[x] = ex(player.anions.types[x])

    player.cations.points = ex(player.cations.points)
    player.cations.gen_boosts = ex(player.cations.gen_boosts)
    for (let x = 1; x <= player.cations.gen_length; x++) if (player.cations.generators[x] !== undefined) player.cations.generators[x] = ex(player.cations.generators[x])
}

function save(){
    if (localStorage.getItem("ElectricalIncrementalSave") == '') wipe()
    localStorage.setItem("ElectricalIncrementalSave",btoa(JSON.stringify(player)))
}

function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Electrical Incremental Save.txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != null) {
        load(loadgame)
        location.reload()
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("ElectricalIncrementalSave"))
    loadVue()
    setInterval(save,1000)
    document.getElementById('loading').style.display = 'none'
    document.getElementById('app').style.display = 'block'
}