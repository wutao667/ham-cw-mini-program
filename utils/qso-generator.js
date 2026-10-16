const { PATTERNS, SCENES, WORDS } = require('./qso-patterns.js')

const TRAINING_TYPES = [
  { id: 'word', label: '单词' },
  { id: 'callsign', label: '呼号' },
  { id: 'phrase', label: '短语' },
  { id: 'sentence', label: '句子' },
  { id: 'mixed', label: '混合' },
]
const DIFFICULTIES = [
  { id: 'easy', label: '入门', note: '短呼号、简短交换，先听清每个词组。' },
  { id: 'standard', label: '进阶', note: '完整呼号及较长交换，练习连续抄收。' },
  { id: 'challenge', label: '挑战', note: '含便携呼号、数字与较长句子，练习完整信息。' },
]

// Regional prefixes, QTH, four-character Maidenhead locator and CQ zone agree.
const STATIONS = [
  { prefixes: ['BA4', 'BD4', 'BG4'], qth: 'NANJING', country: 'CHINA', grid: 'OM92', zone: 24, names: ['WEI', 'TAO', 'MING'] },
  { prefixes: ['BA4', 'BD4', 'BG4'], qth: 'SHANGHAI', country: 'CHINA', grid: 'PM01', zone: 24, names: ['LI', 'JUN', 'HAO'] },
  { prefixes: ['BA1', 'BD1', 'BG1'], qth: 'BEIJING', country: 'CHINA', grid: 'OM89', zone: 24, names: ['LEI', 'FENG', 'YANG'] },
  { prefixes: ['BA5', 'BD5', 'BG5'], qth: 'HANGZHOU', country: 'CHINA', grid: 'PM00', zone: 24, names: ['CHEN', 'LIN', 'HONG'] },
  { prefixes: ['JA1', 'JE1', 'JG1'], qth: 'TOKYO', country: 'JAPAN', grid: 'PM95', zone: 25, names: ['KEN', 'HIRO', 'TARO'] },
  { prefixes: ['JA3', 'JE3', 'JG3'], qth: 'OSAKA', country: 'JAPAN', grid: 'PM74', zone: 25, names: ['AKI', 'YUKI', 'SHIN'] },
  { prefixes: ['K1', 'W1', 'N1'], qth: 'BOSTON', country: 'USA', grid: 'FN42', zone: 5, names: ['BOB', 'TOM', 'JOHN'] },
  { prefixes: ['K6', 'W6', 'N6'], qth: 'SAN FRANCISCO', country: 'USA', grid: 'CM87', zone: 3, names: ['AL', 'DAVE', 'MIKE'] },
  { prefixes: ['G0', 'G4', 'M0'], qth: 'LONDON', country: 'ENGLAND', grid: 'IO91', zone: 14, names: ['IAN', 'PHIL', 'PAUL'] },
  { prefixes: ['DL1', 'DL2', 'DL5'], qth: 'BERLIN', country: 'GERMANY', grid: 'JO62', zone: 14, names: ['HANS', 'PETER', 'KLAUS'] },
  { prefixes: ['VK2'], qth: 'SYDNEY', country: 'AUSTRALIA', grid: 'QF56', zone: 30, names: ['ROB', 'STEVE', 'MARK'] },
  { prefixes: ['VK3'], qth: 'MELBOURNE', country: 'AUSTRALIA', grid: 'QF22', zone: 30, names: ['GEOFF', 'BRUCE', 'ANDREW'] },
]
const HF_BANDS = [
  { band: 80, frequencies: ['3525', '3535', '3550'] },
  { band: 40, frequencies: ['7010', '7025', '7030'] },
  { band: 30, frequencies: ['10106', '10115', '10120'] },
  { band: 20, frequencies: ['14025', '14040', '14050'] },
  { band: 17, frequencies: ['18075', '18080', '18085'] },
  { band: 15, frequencies: ['21025', '21040', '21050'] },
  { band: 10, frequencies: ['28025', '28040', '28050'] },
]
const REPORTS = [
  { rst: '339', description: 'WEAK BUT READABLE' },
  { rst: '449', description: 'FAIR' },
  { rst: '559', description: 'GOOD' },
  { rst: '579', description: 'STRONG' },
  { rst: '589', description: 'VERY STRONG' },
  { rst: '599', description: 'VERY STRONG' },
]
const WEATHER = [
  { label: 'SUNNY', min: 16, max: 32 },
  { label: 'CLOUDY', min: 8, max: 25 },
  { label: 'RAINY', min: 8, max: 22 },
  { label: 'CLEAR', min: 5, max: 25 },
  { label: 'COLD', min: -5, max: 6 },
  { label: 'HOT', min: 30, max: 37 },
]
const ANTENNAS = ['DIPOLE', 'VERTICAL', 'INVERTED V', 'END FED WIRE', 'LONG WIRE', 'LOOP']
const TYPE_HINTS = {
  word: '常用通联词汇或英语单词。',
  callsign: '抄收完整模拟呼号；斜线和后缀也需要填写。',
  calling: 'CQ 为呼叫，DE 表示“这里是”，K 表示请回答。',
  report: 'RST 依次表示可辨度、信号强度和音调，数值应逐位抄收。',
  identity: 'NAME / OP 为操作员姓名，CALL 为呼号。',
  location: 'QTH 为台址，GRID / LOC 为梅登黑德网格。',
  station: 'RIG 为设备，PWR 为功率，W 为瓦。',
  antenna: 'ANT 为天线，SWR 为驻波比，M 为米。',
  weather: 'WX 为天气，TEMP 为温度，C 为摄氏度。',
  conditions: 'QRM 为人为干扰，QRN 为自然噪声，QSB 为信号衰落。',
  repeat: 'AGN / RPT 为重发，QRS 为慢发，PSE 为请。',
  contest: 'TEST 为竞赛，NR 为序号；数字报告和序号都需要抄收。',
  portable: '/P 为便携台，/M 为移动台，QRP 为低功率。',
  schedule: 'QSY 为改变频率，SKED 为约定通联；时间使用 UTC，频率使用 kHz。',
  qsl: 'QSL 为确认，BURO 为卡片管理局，LOTW 为电子日志确认。',
  closing: '73 为美好祝愿，CU AGN 为下次再见，QRT 为停止发射。',
  ragchew: '日常聊天：年龄、业余无线电经历、兴趣及生活。',
  operating: '操作与练习：速度、手键、电键和抄收习惯。',
}

function randomIndex(length, random) {
  return Math.min(length - 1, Math.max(0, Math.floor(random() * length)))
}
function pick(items, random) { return items[randomIndex(items.length, random)] }
function integer(min, max, random) { return min + randomIndex(max - min + 1, random) }
function suffix(length, random) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let index = 0; index < length; index += 1) result += pick(alphabet, random)
  return result
}

function createStation(difficulty, random, excludeCall) {
  const profile = pick(STATIONS, random)
  const callSuffix = suffix(difficulty === 'easy' ? 2 : 3, random)
  let call = pick(profile.prefixes, random) + callSuffix
  if (call === excludeCall) {
    // Even a deterministic RNG must produce two distinct stations.
    const last = call.slice(-1)
    call = call.slice(0, -1) + (last === 'Z' ? 'A' : String.fromCharCode(last.charCodeAt(0) + 1))
  }
  return { ...profile, call, suffix: call.match(/[A-Z]+$/)[0], name: pick(profile.names, random) }
}

function createContext(difficulty, random) {
  const station = createStation(difficulty, random)
  const other = createStation(difficulty, random, station.call)
  const report = pick(REPORTS, random)
  const band = pick(HF_BANDS, random)
  const weather = pick(WEATHER, random)
  const age = integer(25, 78, random)
  const currentYear = new Date().getFullYear()
  const licensedYear = currentYear - integer(1, age - 16, random)
  const lowPower = pick([1, 2, 3, 5], random)
  return {
    call: station.call, suffix: station.suffix, name: station.name,
    qth: station.qth, country: station.country, grid: station.grid, zone: String(station.zone),
    otherCall: other.call, otherSuffix: other.suffix, otherName: other.name,
    portableCall: station.call + '/P', mobileCall: station.call + '/M',
    dxCountry: other.country, greeting: pick(['GM', 'GA', 'GE'], random),
    rst: report.rst, signalDescription: report.description,
    receivedRst: pick(REPORTS, random).rst, contestRst: '599',
    rig: pick(['IC7300', 'FT891', 'TS590', 'FTDX10', 'IC7610'], random),
    portableRig: pick(['KX2', 'KX3', 'FT817', 'FT818'], random),
    power: String(pick([10, 20, 25, 50, 75, 100], random)), lowPower: String(lowPower),
    antenna: pick(ANTENNAS, random), height: String(pick([6, 8, 10, 12, 15, 18, 20], random)),
    portableHeight: String(pick([4, 5, 6, 7, 8], random)),
    voltage: pick(['11.8', '12.0', '12.4', '12.8', '13.2'], random),
    filter: String(pick([250, 300, 400, 500], random)),
    swr: pick(['1.1', '1.2', '1.3', '1.5'], random),
    bearing: String(integer(0, 35, random) * 10),
    weather: weather.label, temperature: String(integer(weather.min, weather.max, random)),
    wind: String(integer(0, 30, random)),
    band: String(band.band), frequency: pick(band.frequencies, random),
    utc: String(integer(0, 23, random)).padStart(2, '0') + pick(['00', '15', '30', '45'], random),
    offset: String(pick([1, 2, 3, 5], random)),
    speed: String(pick(difficulty === 'easy' ? [5, 8, 10, 12] : [15, 18, 20, 25, 30], random)),
    serial: String(integer(1, 999, random)).padStart(3, '0'),
    receivedSerial: String(integer(1, 999, random)).padStart(3, '0'),
    age: String(age), licensedYear: String(licensedYear), yearsHere: String(integer(1, age - 18, random)),
    hobby: pick(['HIKING', 'READING', 'PHOTOGRAPHY', 'GARDENING', 'BUILDING RADIOS', 'CYCLING'], random),
  }
}

function renderPattern(pattern, context) {
  const text = pattern.template.replace(/\{(\w+)\}/g, (match, key) => {
    if (context[key] === undefined) throw new Error('Unknown QSO field: ' + key)
    return context[key]
  })
  return text.replace(/\s+/g, ' ').trim()
}

function getPatternPool(type, scene, difficulty) {
  return PATTERNS.filter(pattern => {
    if (pattern.type !== type || (scene !== 'all' && pattern.scene !== scene)) return false
    if (type === 'phrase') return true
    const index = Number(pattern.id.split('-').pop())
    if (difficulty === 'easy') return index <= 4
    if (difficulty === 'standard') return index >= 3 && index <= 7
    return index >= 6
  })
}

function pickWithHistory(pool, history, random) {
  const recent = new Set(history.slice(-6).map(item => item.id))
  const candidates = pool.filter(item => !recent.has(item.id))
  const available = candidates.length ? candidates : pool.filter(item => item.id !== (history[history.length - 1] || {}).id)
  const choices = available.length ? available : pool
  const counts = {}
  history.slice(-36).forEach(item => { counts[item.id] = (counts[item.id] || 0) + 1 })
  const weights = choices.map(item => 1 / Math.pow((counts[item.id] || 0) + 1, 2))
  let threshold = random() * weights.reduce((sum, value) => sum + value, 0)
  for (let index = 0; index < choices.length; index += 1) {
    threshold -= weights[index]
    if (threshold < 0) return choices[index]
  }
  return choices[choices.length - 1]
}

function generateExercise(options = {}) {
  const random = typeof options.random === 'function' ? options.random : Math.random
  const requestedType = TRAINING_TYPES.some(type => type.id === options.type) ? options.type : 'phrase'
  const scene = SCENES.some(item => item.id === options.scene) ? options.scene : 'all'
  const difficulty = DIFFICULTIES.some(item => item.id === options.difficulty) ? options.difficulty : 'easy'
  const history = Array.isArray(options.history) ? options.history : []
  const type = requestedType === 'mixed'
    ? pick(scene === 'all' ? ['word', 'callsign', 'phrase', 'sentence'] : ['phrase', 'sentence'], random)
    : requestedType

  if (type === 'word') {
    const length = requestedType === 'mixed'
      ? pick(difficulty === 'easy' ? [2, 3, 4] : (difficulty === 'standard' ? [4, 5, 6] : [6, 7, 8]), random)
      : Math.round(Number(options.letterCount) || 3)
    const pool = WORDS.filter(word => word.length === Math.min(8, Math.max(2, length)))
      .map(text => ({ id: 'word-' + text, text }))
    const selected = pickWithHistory(pool, history, random)
    return { ...selected, type, scene: 'all', sceneLabel: '常用词汇', hint: TYPE_HINTS.word }
  }
  if (type === 'callsign') {
    let text = createStation(difficulty, random).call
    if (difficulty === 'challenge') text += pick(['/P', '/M', ''], random)
    if (history.some(item => item.text === text)) {
      // Retry naturally, while keeping generation bounded for mocked RNGs.
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const candidate = createStation(difficulty, random).call
          + (difficulty === 'challenge' ? pick(['/P', '/M', ''], random) : '')
        if (!history.slice(-6).some(item => item.text === candidate)) { text = candidate; break }
      }
    }
    return { id: 'callsign-' + text, text, type, scene: 'identity', sceneLabel: '呼号抄收', hint: TYPE_HINTS.callsign }
  }
  const pool = getPatternPool(type, scene, difficulty)
  const pattern = pickWithHistory(pool, history, random)
  let text = ''
  for (let attempt = 0; attempt < 8; attempt += 1) {
    text = renderPattern(pattern, createContext(difficulty, random))
    if (!history.slice(-6).some(item => item.text === text)) break
  }
  return {
    id: pattern.id, text, type, scene: pattern.scene,
    sceneLabel: SCENES.find(item => item.id === pattern.scene).label,
    hint: TYPE_HINTS[pattern.scene],
  }
}

module.exports = {
  TRAINING_TYPES, SCENES, DIFFICULTIES, PATTERN_COUNT: PATTERNS.length,
  generateExercise, createContext, renderPattern, getPatternPool,
}
