/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    'electrons': '电子',
    'Electrons': '电子',
    'Enabled': '已启用',
    'Exit Challenge': '退出挑战',
    'gain by': '收益',
    'Finish Cation Challenge': '完成阳离子挑战',
    'Hard Reset': '硬复位',
    'Get new generators': '获取新的发生器',
    'Have': '有',
    'Increase their resources gain by 1x': '将它们的资源增益提高 1 倍',
    'Options': '选项',
    'plasma particles': '等离子体粒子',
    'Reset your anions to get 1 anti-electrical anion': '重置您的阴离子以获得 1 个反电阴离子',
    'Reset your volume for': '重置您的音量',
    'Unlock new electrical generator': '解锁新的发生器',
    'unspent charged anions': '未消耗的带电阴离子',
    'Loading Game...': '加载游戏...',
    'More Electrons': '更多电子',
    'New Generation': '新一代',
    'Note 1: When enter in any cation challenge, resets cations from their generators and all previous upgrades.': '注1：当进入任何阳离子挑战时，重置来自其发生器和所有先前升级的阳离子。',
    'Note 2: In any cation challenge, cations don’t give their effects.': '注2：在任何阳离子挑战中，阳离子都不会发挥作用。',
    'of plasma, which boosts electrons and electrical powers from electrical generators gain by': '等离子体，它提高了来自发生器的电子和电力',
    'of plasma core, which raises effect from this buyable and volume effect to electron gain by': '等离子核心，从这种可购买的和体积效应对电子增益的影响增加',
    'Level {{ format(player.electrical_generators[x].lvl,0) }}': '等级 {{ format(player.electrical_generators[x].lvl,0) }}',
    'Goal: {{ format(CHALLENGES.cation[x].goal(),0) }} electrons': '目标: {{ format(CHALLENGES.cation[x].goal(),0) }} 电子',
    'Generator #{{ format(x,0) }}': '发生器 #{{ format(x,0) }}',
    'More, {{ FUNCTIONS.cations.generators.getType(x+1) }} Cations boost that cations gain by {{ format(FUNCTIONS.cations.generators.getGainEffect(x).next, 2) }}x': '更多，{{ FUNCTIONS.cations.generators.getType(x+1) }} 阳离子提升了阳离子增益 {{ format(FUNCTIONS.cations.generators.getGainEffect(x).next, 2) }}x',
    'of plasma core': '等离子核心',
    'Ratio [{{ player.anions.ratio_types }}]': '比率 [{{ player.anions.ratio_types }}]',
    'You have': '你有',
    'x, and add': 'x, 并增加',
    'x, and boosts plasma particles gain by': 'x，并提高等离子体粒子增益',
    'Types of Charged Anions': '带电阴离子的类型',
    'Multiple electrical capacities by 2.0x': '多个电子容量 2.0x',
    'Multiple electrons gain by 2.0x': '多个电子增益 2.0x',
    'cations': '阳离子',
    'Buyables': '可购买',
    'Cation Generators': '阳离子发生器',
    'Buy to Upgrade': '购买升级',
    'Back to Plasma Map': '回到等离子地图',
    'anions': '阴离子',
    'anions, which generates': '阴离子，其产生',
    'Reset previous electron features for +': '重置以前的电子功能 +',
    'Reset all previous features for +': '重置之前全部的电子功能 +',
    'More, their resources is boosted by electrons ({{ format(PLASMA.resources.volume.getEffect(), 2) }}x': '此外，他们的资源被电子提升 ({{ format(PLASMA.resources.volume.getEffect(), 2) }}x',
    'Generator Boosters ({{ format(player.cations.gen_boosts, 0) }}': '发生器助推器({{ format(player.cations.gen_boosts, 0) }}',
    'Effect: {{ FUNCTIONS.anions.types[x].effDesc() }}': '效果: {{ FUNCTIONS.anions.types[x].effDesc() }}',
    'Electrical Capacity': '电气容量',
    'Electrical Generators': '发生器',
    'electrical powers, which multiples': '电力，其倍数',
    'free anti-electrical anions': '游离抗电阴离子',
    'Your electrical capacity is': '你的电容量是',
    'You need to unlock more automatons!': '你需要解锁更多的自动器！',
    'Requires: {{ format(FUNCTIONS.anions.anti_anions.req(), 0) }} anions': '需要: {{ format(FUNCTIONS.anions.anti_anions.req(), 0) }} 阴离子',
    'Need to reach {{ format(CHALLENGES.cation[player.cations.chals.active].goal(), 0) }} electron to finish': '需要达到 {{ format(CHALLENGES.cation[player.cations.chals.active].goal(), 0) }} 电子以结束',
    'Respec all spent charged anions: {{ player.anions.respec_types?\'ON\':\'OFF\' }}': '重新检查所有用过的带电阴离子：{{ player.anions.respec_types?\'开启\':\'关闭\' }}',
    'And boosts this cations gain by {{ format(FUNCTIONS.cations.generators.getGainEffect(x).owner, 2) }}x': '并提高这种阳离子增益 {{ format(FUNCTIONS.cations.generators.getGainEffect(x).owner, 2) }}x ',
    'cations, which boosts anions gain by': '阳离子，这增加了阴离子增益',
    'charged anions': '带电阴离子',
    'bonus to their effects': '奖励到它们的效果',
    'More Electrical Powers': '更多电力',
    'previous powers': '之前力量',
    'Increase electrical powers from electrical generators multiplier by 1.0, raise this effect by 1.5': '将发生器的电力乘数增加 1.0，将此效果提高 1.5',
    'Currently: {{ BUYABLES.electrons[x].effDesc() }}': '当前: {{ BUYABLES.electrons[x].effDesc() }}',
    'Currently: {{ UPGRADES[UPGRADES.getRC(player.upg_choosed).r][UPGRADES.getRC(player.upg_choosed).c].effDesc() }}': '当前: {{ UPGRADES[UPGRADES.getRC(player.upg_choosed).r][UPGRADES.getRC(player.upg_choosed).c].effDesc() }}',
    'Cost: {{ format(FUNCTIONS.cations.generators.getCost(), 0) }} cations': '成本：{{ format(FUNCTIONS.cations.generators.getCost(), 0) }} 阳离子',
    'Boost types of cations gain by {{ format(FUNCTIONS.cations.generators.getBoostEffect(), 1) }}x': '提升阳离子类型增益 {{ format(FUNCTIONS.cations.generators.getBoostEffect(), 1) }}x',
    'anion charges per second': '每秒阴离子电荷',
    'anion charges, which are adding': '阴离子电荷，增加',
    'anti-electrical anions, which make charged anion types': '反电阴离子，使带电阴离子类型',
    'Anions': '阴离子',
    'Automatons': '自动器',
    'Cations': '阳离子',
    'Cost: {{ format(PLASMA.buyables.volume.cost(), 6) }} plasma particles': '成本: {{ format(PLASMA.buyables.volume.cost(), 6) }} 等离子体粒子',
    'Plasma': '等离子体',
    'Stronger Electrons': '更强的电子',
    'Upgrades': '升级',
    'Auto-Electron Buyables': '自动电子可购买',
    'Auto-Electron Generators': '自动电子发生器',
    'Charged Anions gain formula is better [log10(x) → log5(x)]. Unlock Auto-Upgrades (includes Pre-Anions & Anions': '带电阴离子增益公式更好 [log10(x) → log5(x)]。 解锁自动升级（包括前阴离子和阴离子',
    'Divide the anti-electrical anions requirement based on unspent electrons.': '根据未消耗的电子处理反电阴离子要求。',
    'Each type of cation generator is multiplied based on unspent electrons.': '每种类型的阳离子发生器都基于未消耗的电子成倍增加。',
    'Electron buyable “Electrical Capacity” is stronger based on anion charges.': '电子可购买的“电容量”基于阴离子电荷更强。',
    'Electron buyable “More Electrons” is stronger based on levels from electron buyable “Electrical Capacity”.': '电子可购买的“更多电子”基于电子可购买的“电容量”的水平而更强。',
    'Electron Buyables & Generators doesn\'t spend electrons, and unspent anions boost electron’s buyable “More Electrical Powers” effect.': '电子可购买 & 发生器 不消耗电子，未消耗的阴离子增强了电子可购买的“更多电力”效应。',
    'Gain 10% of anions gain every second, the Anti-Electrical Anions requirement scaling is 25% weaker.': '每秒获得 10% 的阴离子增益，反电阴离子需求比例降低 25%。',
    'Gain 5x more anions.': '获得 5 倍以上的阴离子。',
    'Gain more anion charges based on unspent electrons.': '基于未消耗的电子获得更多的阴离子电荷。',
    'Gain more anions based on unspent electrons, and unspent anions boost electrons gain.': '基于未消耗的电子获得更多的阴离子，未消耗的阴离子增加电子增益。',
    'Gain more anions based on unspent electrons.': '基于未消耗的电子获得更多的阴离子。',
    'Gain more anions based on your anti-electrical anions.': '根据您的反电阴离子获得更多的阴离子。',
    'Gain more plasma particles based on unspent electrons.': '基于未消耗的电子获得更多的等离子体粒子。',
    'Generator Boosters in Cations are 50% stronger, and electrons gain is increased by 2.5% for every OoM of electrons.': '阳离子中的发生器助推器强度提高 50%，每 OoM 电子增加 2.5% 的电子增益。',
    'Keep anion upgrades on reset, and anions boost cations gain at the reduced rate.': '在重置时保持阴离子升级，并且阴离子以降低的速率提高阳离子增益。',
    'Keep electron upgrades on reset for anions.': '保持电子升级为阴离子重置。',
    'Make electron buyable “More Electrons” is 50% cheaper.': '使电子可购买“更多电子”便宜 50%。',
    'Multiply electrical generator’s effects based on the sum of levels on these generators.': '根据这些发生器的电子等级总和，乘以发生器的效果。',
    'Pre-Anions': '前阴离子',
    'Raise anions gain by ^1.5 and upgrades PreA-1 & 2 is boosted by anti-electrical anions.': '将阴离子增益提高 ^1.5 并升级 前阴离子-1 & 2 由反电阴离子增强。',
    'Raise effects from electrical generators by ^1.15': '将发电机的效果提高 ^1.15',
    'Raise electrons gain by ^1.15': '将电子增益提高 ^1.15',
    'The Anti-Electrical Anions requirement is 33% slower.': '反电阴离子要求慢 33%。',
    'Unlock Auto-Anti-Anion & Auto-Type Anion.': '解锁自动反阴离子和自动类型阴离子。',
    'Unlock Auto-Electron (added on Automaton tab': '解锁自动电子（在自动器标签添加',
    'Unlock Cation Challenges.': '解锁阳离子挑战。',
    'Unlock new electron buyable and make electron buyable “More Electrical Powers” is 15% cheaper.': '解锁可购买的新电子并使电子可购买“更多电力”便宜 15%。',
    'You can bulk anti-electrical anions, and quinary cations boost powers from 5th electrical generator gain.': '您可以批量生产反电阴离子，而五元阳离子可从第 5 个发电机增益中提高功率。',
    'You can bulk electron buyable & generators, and make electron buyable “Stronger Electrons” is 50% cheaper.': '您可以批量购买电子产品和发电机，并使电子产品可购买“更强的电子”便宜 50%。',
    'You can gain 1000x more anions, but this gets weaker the further you go (minimum 10x, at 1e10 anions).': '您可以获得 1000 倍以上的阴离子，但随着您走得越远，这会变得越弱（至少 10 倍，在 1e10 阴离子时）。',
    'Anion gain formula is better [log5(x)+1 → x^0.02+1]': '阴离子增益公式更好 [log5(x)+1 → x^0.02+1]',
    'Anti-electrical anions boost anions effect.': '抗电阴离子增强阴离子效果。',
    'Anti-Electrical Anions doesn’t reset anion features, unlock the new option of types of the charged anion.': '反电阴离子不会重置阴离子功能，解锁带电阴离子类型的新选项。',
    'Add Electronic Anions': '添加电子阴离子',
    'Add Electro-Generatize Anions': '添加电生成阴离子',
    '% stronger, and adds': '% 更强，并增加',
    ' More, their resources is boosted by electrons ({{ format(PLASMA.resources.volume.getEffect(), 2) }}x': '此外，他们的资源被电子提升 ({{ format(PLASMA.resources.volume.getEffect(), 2) }}x',
    ' You have': ' 你有',
    '\"Electrical Incremental\" - made by MrRedShark77': '“电气增量”  - 由MrRedShark77制作',
    'Cation Challenges': '阳离子挑战',
    'Primary Cations': '第1代阳离子',
    'Anti-Anion Gainer': '抗阴离子获得器',
    'Electron Buyables (except “Electrical Capacity” & “New Generation”) scaling is twice stronger.': '电子Buyables（除了“电子容量”与“新生代”）规模扩大了两倍。。',
    'Lesser Electrons': '更少的电子',
    'Tertiary Cations': '第3代阳离子',
    'Secondary Cations': '第2代阳离子',
    'Quinary Cations': '第5代阳离子',
    'Quaternary Cations': '第4代阳离子',
    'Scaled Buyable': '缩放可购买',
    'Start': '开始',
    'Weaker Resources': '更少的资源',
    'You cannot buy electron buyable “More Electrons”': '你不能购买电子可购买的 “更多电子”',
    'You cannot gain Anions (like, you cannot buy anion upgrades, but only make Auto-Electron is unlocked and bulked': '你不能获得阴离子（比如，你不能购买阴离子升级，但只能让自动电子被解锁和膨胀',
    'Reward: Unlock Plasma': '奖励：解锁等离子',
    'Auto-Anti-Anion': '自动反阴离子',
    'Auto-Type Anion': '自动型阴离子',
    'More, their resources is boosted by anions & cations ({{ format(PLASMA.resources.mass.getEffect(), 2) }}x': '此外，它们的资源受到阴离子和阳离子的提升 ({{ format(PLASMA.resources.mass.Effect(), 2) }}x',
    'Reward: {{ CHALLENGES.cation[x].reward() }}': '奖励: {{ CHALLENGES.cation[x].reward() }}',
    'Show cost after buying upgrades - {{ player.options.show_upgrade_cost?\"ON\":\"OFF\" }}': '购买升级后显示费用 - {{ player.options.show_upgrade_cost?\"开启\":\"关闭\" }}',
    'x, boosts cations gain by': 'x, 提高阳离子增益',
    'Add {{ FUNCTIONS.anions.types[x].title }}': '添加 {{ FUNCTIONS.anions.types[x].title }}',
    ' More, their resources is boosted by anions & cations ({{ format(PLASMA.resources.mass.getEffect(), 2) }}x': '此外，它们的资源受到阴离子和阳离子的推动 ({{ format(PLASMA.resources.mass.Effect(), 2) }}x',
    'Cost: {{ format(PLASMA.buyables.mass.cost(), 6) }} plasma particles': '成本: {{ format(PLASMA.buyables.mass.cost(), 6) }} 等离子体粒子',
    'Cost: {{ format(UPGRADES[UPGRADES.getRC(player.upg_choosed).r][UPGRADES.getRC(player.upg_choosed).c].cost(), UPGRADES[UPGRADES.getRC(player.upg_choosed).r].numberFixed?UPGRADES[UPGRADES.getRC(player.upg_choosed).r].numberFixed:0) }} {{ UPGRADES[UPGRADES.getRC(player.upg_choosed).r].price }}': '成本: {{ format(UPGRADES[UPGRADES.getRC(player.upg_choosed).r][UPGRADES.getRC(player.upg_choosed).c].cost(), UPGRADES[UPGRADES.getRC(player.upg_choosed).r].numberFixed?UPGRADES[UPGRADES.getRC(player.upg_choosed).r].numberFixed:0) }} {{ UPGRADES[UPGRADES.getRC(player.upg_choosed).r].price }}',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',

    //树游戏
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Game Version - ": "游戏版本 - ",
    "Level: ": "等级: ",
    "Increase base from electron buyable “More Electrons” by ": "从电子可购买的“更多电子”中增加基础",
    "Multiple electrons gain by ": "多个电子获得",
    "PreA-": "前阴离子-",
    "Multiply electrical generators (except for first) effects by ": "将发电机（除了第一个）效应乘以",
    "Multiply electrons gain by ": "将电子增益乘以",
    "Multiple electrical capacities by ": "多电子容量",
    "更多，Primary 阳离子提升了阳离子增益 ": "更多，第1代 阳离子提升了阳离子增益 ",
    "更多，Quaternary 阳离子提升了阳离子增益 ": "更多，第4代 阳离子提升了阳离子增益 ",
    ", which boosts electrons gain by ": "，这增加了电子增益",
    ", which boosts electrical powers from electrical generators & him effects by ": "，这可以提高发电机的电力和他的效果",
    "更多，Secondary 阳离子提升了阳离子增益 ": "更多，第2代 阳离子提升了阳离子增益 ",
    "更多，Quinary 阳离子提升了阳离子增益 ": "更多，第5代 阳离子提升了阳离子增益 ",
    "更多，Tertiary 阳离子提升了阳离子增益": "更多，第3代 阳离子提升了阳离子增益",
    "All pre-Cation resources are raised by ": "所有前阳离子资源提升了",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^([\d\.]+)x$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^([\d\.,]+)$/,
    /^([\d\.]+)\/s\)$/,
    /^([\d\.]+)e([\d\.,]+)\/s\)$/,
    /^([\d\.,]+)\/s\)$/,
    /^等级: ([\d\.,]+)$/,
    /^等级 ([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^当前: (.+)x$/,
    /^成本: (.+) 电子$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^Plasma Powers Amount: (.+)\nRequire: (.+) cations$/, '等离子能量数量：$1\n需要：$2 阳离子'],
    [/^You have (.+) of plasma, which boosts electrons and electrical powers from electrical generators gain by (.+)x, and boosts plasma particles gain by (.+)x$/, '你有 $1 的等离子体，它使来自发电机的电子和电能增加 $2x，并将等离子体粒子增益增加 $3x'],
    [/^当前: (.+)x to anions gain, (.+)x to electrons gain$/, '当前：$1x 阴离子增益，$2x 电子增益'],
    [/^Increase electrical powers from electrical generators multiplier by (.+), raise this effect by (.+)$/, '将发电机的电力乘数增加 $1，将此效果提高 $2'],
    [/^, which makes anti-electrical anions are (.+)\% stronger$/, '，这使得反电阴离子强度提高了 $1\%'],
    [/^, which makes each type of cation generator \(except this cation\) are (.+)\% stronger$/, '，这使得每种类型的阳离子发生器（除了这种阳离子）都强 $1\%'],
    [/^, which adds (.+) free electron’s buyable except “New Generation”$/, ', 增加了 $1 可购买的免费电子，除了“新一代”'],
    [/^Reward: Cations boost effect from electrical buyable “Stronger Electrons” by \+(.+)$/, '奖励：阳离子可将电子可购买的“更强的电子”的效果提升 \+$1'],
    [/^Reward: Each type of cation generator is increased by (.+)\% for every OoM of cations.\nCurrently: (.+)x$/, '奖励：每阳离子发生器每ROoM增加$1\%。\n当前: $2x'],
    [/^Reward: Their electron buyable scaling is (.+)\% weaker.$/, '奖励：他们的电子可购买缩放减弱 $1\%。'],
    [/^Cost: (.+) electrons$/, '成本: $1 电子'],
    [/^Cost: (.+) anions$/, '成本: $1 阴离子'],
    [/^Cost: (.+) cations$/, '成本: $1 阳离子'],
    [/^Currently: (.+)x$/, '当前: $1x'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
	[/^([\d\.]+) Electro-Generatize Anions$/, '$1 电生阴离子'],
	[/^([\d\.]+) Electronic Anions$/, '$1 电子阴离子'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);