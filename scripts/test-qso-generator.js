const assert = require('assert')
const { PATTERNS, WORDS } = require('../utils/qso-patterns.js')
const { MORSE } = require('../utils/morse.js')
const {
  TRAINING_TYPES, SCENES, DIFFICULTIES, generateExercise,
  createContext, renderPattern, getPatternPool,
} = require('../utils/qso-generator.js')

let seed = 123456789
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  return seed / 4294967296
}
function validate(text) {
  assert(text.length > 0 && text.length <= 180, 'Length outside training bounds: ' + text)
  assert.strictEqual(text, text.trim().replace(/\s+/g, ' '))
  for (const character of text) assert(character === ' ' || MORSE[character], 'Unsupported: ' + character)
}

assert(PATTERNS.length >= 300)
assert.strictEqual(new Set(PATTERNS.map(pattern => pattern.id)).size, PATTERNS.length)
assert.strictEqual(new Set(PATTERNS.map(pattern => pattern.template)).size, PATTERNS.length)
for (const pattern of PATTERNS) {
  for (const difficulty of DIFFICULTIES) {
    for (let iteration = 0; iteration < 20; iteration += 1) {
      const context = createContext(difficulty.id, random)
      assert.notStrictEqual(context.call, context.otherCall)
      assert(context.call.endsWith(context.suffix))
      assert(context.otherCall.endsWith(context.otherSuffix))
      assert.strictEqual(context.portableCall, context.call + '/P')
      assert.strictEqual(context.mobileCall, context.call + '/M')
      assert(Number(context.lowPower) <= 5)
      assert(Number(context.licensedYear) >= new Date().getFullYear() - Number(context.age) + 16)
      const text = renderPattern(pattern, context)
      validate(text)
      if (pattern.template.includes('{call} {call}')) assert(text.includes(context.call + ' ' + context.call))
      if (pattern.template.includes('{rst} {rst}')) assert(text.includes(context.rst + ' ' + context.rst))
    }
  }
}

for (let length = 2; length <= 8; length += 1) {
  assert(WORDS.filter(word => word.length === length).length >= 20)
  const history = []
  for (let index = 0; index < 100; index += 1) {
    const result = generateExercise({ type: 'word', letterCount: length, history, random })
    assert.strictEqual(result.text.length, length)
    assert(!history.slice(-6).some(item => item.id === result.id))
    history.push(result)
    validate(result.text)
  }
}

for (const scene of SCENES) {
  for (const difficulty of DIFFICULTIES) {
    for (const type of TRAINING_TYPES) {
      const history = []
      for (let index = 0; index < 25; index += 1) {
        const result = generateExercise({ type: type.id, scene: scene.id, difficulty: difficulty.id, history, random })
        validate(result.text)
        assert(result.hint && result.sceneLabel)
        if (scene.id !== 'all' && ['phrase', 'sentence', 'mixed'].includes(type.id)) assert.strictEqual(result.scene, scene.id)
        history.push(result)
      }
    }
    for (const type of ['phrase', 'sentence']) assert(getPatternPool(type, scene.id, difficulty.id).length)
  }
}

const history = []
for (let index = 0; index < 1000; index += 1) {
  const result = generateExercise({ type: 'phrase', scene: 'all', history, random })
  assert(!history.slice(-6).some(item => item.id === result.id))
  history.push(result)
}
console.log('QSO generator passed: ' + PATTERNS.length + ' unique templates; all scenes, levels, word lengths and playable output checked.')
