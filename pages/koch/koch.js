const { CHARACTERS } = require('../../utils/morse.js')
const cwAudio = require('../../utils/cw-audio.js')
const { addKochScore } = require('../../utils/score-history.js')

const KEYS = CHARACTERS.concat(['.', ',', '?', '/', '='])
const ORDER = 'KMURESNAPTLWI.JZ=FOY,VGCQ?HBDX/1234567890'
const ROUND_SIZE = 25
const LESSON_KEY = 'kochLesson'

function groupCharacters(characters, answer) {
  return Array.from({ length: 5 }, (_, group) => (
    { index: group, characters: Array.from({ length: 5 }, (_, offset) => {
      const index = group * 5 + offset
      const value = characters[index]
      return { index, value: value || '·', wrong: Boolean(answer && value !== answer[index]) }
    }) }
  ))
}

Page({
  data: {
    lesson: 1,
    keys: [],
    poolLabel: '',
    answer: '',
    input: '',
    inputGroups: groupCharacters(''),
    answerGroups: [],
    submitted: false,
    rounds: 0,
    total: 0,
    correct: 0,
    accuracy: 0,
  },

  onLoad() {
    const lesson = Number(wx.getStorageSync(LESSON_KEY))
    this.selectLesson(Number.isInteger(lesson) && lesson >= 1 && lesson <= 40 ? lesson : 1)
  },

  selectLesson(lesson) {
    cwAudio.stop()
    const pool = ORDER.slice(0, lesson + 1)
    this.setData({
      lesson,
      poolLabel: pool.split('').join(' '),
      keys: KEYS.map(value => ({ value, enabled: pool.includes(value) })),
      answer: '',
      input: '',
      inputGroups: groupCharacters(''),
      answerGroups: [],
      submitted: false,
      rounds: 0,
      total: 0,
      correct: 0,
      accuracy: 0,
    })
    this.scoreWpm = null
  },

  changeLesson(event) {
    const lesson = Number(event.detail.value)
    if (lesson === this.data.lesson) return
    this.selectLesson(lesson)
    wx.setStorageSync(LESSON_KEY, lesson)
  },

  nextRound() {
    const pool = ORDER.slice(0, this.data.lesson + 1)
    const answer = Array.from({ length: ROUND_SIZE }, () => pool[Math.floor(Math.random() * pool.length)]).join('')
    const { wpm, frequency, kochGroupGap } = getApp().globalData.cwSettings
    this.roundAudio = { wpm, frequency, groupGapSeconds: kochGroupGap || 1 }
    this.setData({
      answer,
      input: '',
      inputGroups: groupCharacters(''),
      answerGroups: [],
      submitted: false,
    })
    this.replay()
  },

  replay() {
    if (this.data.answer) cwAudio.play(this.data.answer.match(/.{5}/g).join(' '), this.roundAudio)
  },

  enterCharacter(event) {
    const { answer, input, lesson, submitted } = this.data
    const { value } = event.currentTarget.dataset
    if (!answer || submitted || input.length >= ROUND_SIZE || !ORDER.slice(0, lesson + 1).includes(value)) return
    const nextInput = input + value
    this.setData({ input: nextInput, inputGroups: groupCharacters(nextInput) })
  },

  backspace() {
    if (this.data.submitted) return
    const input = this.data.input.slice(0, -1)
    this.setData({ input, inputGroups: groupCharacters(input) })
  },

  submit() {
    const { answer, input, submitted } = this.data
    if (submitted || !answer || input.length !== ROUND_SIZE) return
    const roundCorrect = input.split('').filter((value, index) => value === answer[index]).length
    const sameSpeed = this.scoreWpm === this.roundAudio.wpm
    const rounds = sameSpeed ? this.data.rounds : 0
    const total = (sameSpeed ? this.data.total : 0) + ROUND_SIZE
    const correct = (sameSpeed ? this.data.correct : 0) + roundCorrect
    this.scoreWpm = this.roundAudio.wpm
    cwAudio.stop()
    this.setData({
      submitted: true,
      inputGroups: groupCharacters(input, answer),
      answerGroups: groupCharacters(answer),
      rounds: rounds + 1,
      total,
      correct,
      accuracy: Math.round(correct * 100 / total),
    })
  },

  recordScore() {
    const { lesson, rounds, total, correct, accuracy } = this.data
    if (!rounds) {
      wx.showToast({ title: '请先完成并提交一轮', icon: 'none' })
      return
    }
    try {
      addKochScore({ recordedAt: Date.now(), lesson, rounds, total, correct, accuracy, wpm: this.scoreWpm })
      wx.showToast({ title: '成绩已记录', icon: 'success' })
    } catch (error) {
      wx.showToast({ title: '历史成绩保存失败，请重试', icon: 'none' })
    }
  },

  openHistory() {
    wx.navigateTo({ url: '/pages/history/history?mode=koch' })
  },

  onHide() { cwAudio.stop() },
  onUnload() { cwAudio.stop() },
})
