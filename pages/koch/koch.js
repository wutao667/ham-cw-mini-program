const { CHARACTERS } = require('../../utils/morse.js')
const cwAudio = require('../../utils/cw-audio.js')

const KEYS = CHARACTERS.concat(['.', ',', '?', '/', '='])
const ORDER = 'KMURESNAPTLWI.JZ=FOY,VGCQ?HBDX/1234567890'
const ROUND_SIZE = 25
const HISTORY_KEY = 'kochScoreHistory'
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
    history: [],
    showHistory: false,
  },

  onLoad() {
    const lesson = Number(wx.getStorageSync(LESSON_KEY))
    this.selectLesson(Number.isInteger(lesson) && lesson >= 1 && lesson <= 40 ? lesson : 1)
    const history = wx.getStorageSync(HISTORY_KEY)
    this.setData({ history: Array.isArray(history) ? history : [] })
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
    })
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
    const { answer, input, lesson, submitted, rounds, total, correct, history } = this.data
    if (submitted || !answer || input.length !== ROUND_SIZE) return
    const roundCorrect = input.split('').filter((value, index) => value === answer[index]).length
    const now = new Date()
    const record = {
      id: now.getTime() + '-' + history.length,
      date: now.toLocaleString(),
      lesson,
      characterCount: lesson + 1,
      total: ROUND_SIZE,
      correct: roundCorrect,
      accuracy: roundCorrect * 4,
      wpm: this.roundAudio.wpm,
    }
    const updatedHistory = [record, ...history]
    try {
      wx.setStorageSync(HISTORY_KEY, updatedHistory)
    } catch (error) {
      wx.showToast({ title: '历史成绩保存失败，请重试', icon: 'none' })
      return
    }
    cwAudio.stop()
    this.setData({
      submitted: true,
      inputGroups: groupCharacters(input, answer),
      answerGroups: groupCharacters(answer),
      rounds: rounds + 1,
      total: total + ROUND_SIZE,
      correct: correct + roundCorrect,
      accuracy: Math.round((correct + roundCorrect) * 100 / (total + ROUND_SIZE)),
      history: updatedHistory,
    })
  },

  toggleHistory() {
    this.setData({ showHistory: !this.data.showHistory })
  },

  onHide() { cwAudio.stop() },
  onUnload() { cwAudio.stop() },
})
