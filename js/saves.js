function E(x){return new ExpantaNum(x)};
function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

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

    checkUnlock()
    automatons()

    if (player.anions.unl) player.anions.charges = player.anions.charges.add(FUNCTIONS.anions.charges.gain().mul(dt))

    for (let x = 1; x <= player.eg_length; x++) player.electrical_generators[x].powers = player.electrical_generators[x].powers.add(FUNCTIONS.electrical_generators.getPowerGain(x).mul(dt))
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
}

function checkUnlock() {
    if (FUNCTIONS.anions.unl() && !player.anions.unl) player.anions.unl = true
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
        anti_anions: E(0),
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
    if (player.anions.anti_anions === undefined) player.anions.anti_anions = data.anions.anti_anions

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