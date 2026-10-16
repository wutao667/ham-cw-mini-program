const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const generator = require('../utils/qso-generator.js')

let definition
const playback = []
let stops = 0
const timers = new Map()
let timerId = 0
const notices = []
const audio = { play(text, options) { playback.push({ text, wpm: options.wpm }); return 1200 }, stop() { stops += 1 } }
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../pages/word/word.js'), 'utf8'), {
  require(name) { return name.includes('cw-audio') ? audio : generator },
  getApp() { return { globalData: { cwSettings: { wpm: 20, frequency: 700 } } } },
  Page(page) { definition = page },
  wx: { showToast(notice) { notices.push(notice) } },
  setTimeout(callback) { timers.set(++timerId, callback); return timerId },
  clearTimeout(id) { timers.delete(id) },
})
function pageInstance() {
  const page = { ...definition, data: JSON.parse(JSON.stringify(definition.data)) }
  page.setData = function(update) { Object.assign(this.data, update) }
  return page
}
const page = pageInstance()
page.onShow()
page.replay()
assert.strictEqual(notices.length, 1)
assert.strictEqual(page.data.wpm, 20)

for (const type of generator.TRAINING_TYPES) {
  page.changeTrainingType({ currentTarget: { dataset: { type: type.id } } })
  for (const difficulty of generator.DIFFICULTIES) {
    page.changeDifficulty({ currentTarget: { dataset: { difficulty: difficulty.id } } })
    page.randomPlay()
    assert(page.data.answer && page.data.hasQuestion && page.data.isPlaying)
    assert.strictEqual(playback[playback.length - 1].text, page.data.answer)
    assert.strictEqual(playback[playback.length - 1].wpm, 20)
    const answer = page.data.answer
    const historyCount = page.exerciseHistory.length
    page.replay() // Stop while playing.
    assert.strictEqual(page.data.isPlaying, false)
    assert.strictEqual(timers.size, 0)
    page.replay() // Replay the same question.
    assert.strictEqual(page.data.answer, answer)
    assert.strictEqual(page.exerciseHistory.length, historyCount)
    const input = '  ' + answer.toLowerCase().replace(/ /g, '  ') + '  '
    page.onInput({ detail: { value: input } })
    const questionCount = page.data.questionCount
    const correctCount = page.data.correctCount
    page.revealAnswer()
    assert.strictEqual(page.data.isCorrect, true)
    assert.strictEqual(page.data.questionCount, questionCount + 1)
    assert.strictEqual(page.data.correctCount, correctCount + 1)
    page.revealAnswer()
    assert.strictEqual(page.data.questionCount, questionCount + 1)
    page.onHide()
    assert.strictEqual(page.data.isPlaying, false)
    assert.strictEqual(timers.size, 0)
  }
}

// A callsign's slash and a sentence's word boundaries cannot disappear in grading.
page.setData({ answer: 'BA4ABC/P', hasQuestion: true, counted: false, revealed: false })
page.onInput({ detail: { value: 'ＢＡ４ＡＢＣ／Ｐ' } })
page.revealAnswer()
assert.strictEqual(page.data.isCorrect, true)
page.setData({ counted: false, revealed: false })
page.onInput({ detail: { value: 'BA4ABCP' } })
page.revealAnswer()
assert.strictEqual(page.data.isCorrect, false)
page.setData({ answer: 'QTH NANJING', counted: false, revealed: false })
page.onInput({ detail: { value: 'QTHNANJING' } })
page.revealAnswer()
assert.strictEqual(page.data.isCorrect, false)

page.randomPlay()
const questionCount = page.data.questionCount
page.changeScene({ detail: { value: 2 } })
assert.strictEqual(page.data.hasQuestion, false)
assert.strictEqual(page.data.answer, '')
assert.strictEqual(page.data.questionCount, questionCount)
assert.strictEqual(timers.size, 0)
page.changeTrainingType({ currentTarget: { dataset: { type: 'word' } } })
page.changeLetterCount({ detail: { value: 8 } })
page.randomPlay()
assert.strictEqual(page.data.answer.length, 8)
page.onUnload()
assert.strictEqual(timers.size, 0)
assert(stops > 0)
assert.strictEqual(pageInstance().data.questionCount, 0)
console.log('Word page passed: generation, settings, stop/replay, grading, statistics, mode switches and lifecycle.')
