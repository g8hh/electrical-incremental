function E(x){return new ExpantaNum(x)};
function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function calc(dt) {
    player.time += dt

    var ele_gain = player.electrons.add(FUNCTIONS.getElectronGain().mul(dt))
    if (ele_gain.gte(FUNCTIONS.getElectricalCapacity())) player.electrons = FUNCTIONS.getElectricalCapacity()
    else player.electrons = ele_gain

    checkUnlock()

    if (player.anions.unl) player.anions.charges = player.anions.charges.add(FUNCTIONS.anions.charges.gain().mul(dt))

    for (let x = 1; x <= player.eg_length; x++) player.electrical_generators[x].powers = player.electrical_generators[x].powers.add(FUNCTIONS.electrical_generators.getPowerGain(x).mul(dt))
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
    },
}

function wipe() {
    player = PLAYER_DATA
}

function loadPlayer(load) {
    player = load
    checkIfUndefined()
    convertToExpantaNum()
    player.tabs = PLAYER_DATA.tabs
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
}

function convertToExpantaNum() {
    player.electrons = ex(player.electrons)
    for (let x = 1; x <= UPGRADES.electrons.cols; x++) if (player.electron_upgrades[x] !== undefined) player.electron_upgrades[x] = ex(player.electron_upgrades[x])
    for (let x = 1; x <= player.eg_length; x++) {
        player.electrical_generators[x].powers = ex(player.electrical_generators[x].powers)
        player.electrical_generators[x].lvl = ex(player.electrical_generators[x].lvl)
    }

    player.anions.points = ex(player.anions.points)
    player.anions.charges = ex(player.anions.charges)
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