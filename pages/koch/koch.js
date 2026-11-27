const { PRACTICE_CHARACTERS } = require('../../utils/morse.js')
const cwAudio = require('../../utils/cw-audio.js')
const { addKochScore } = require('../../utils/score-history.js')

const ORDER = 'KMURESNAPTLWI.JZ=FOY,VGCQ?HBDX/1234567890'
const ROUND_SIZE = 25
const LESSON_KEY = 'kochLesson'

function lessonKeys(lesson) {
  const pool = ORDER.slice(0, lesson + 1)
  return PRACTICE_CHARACTERS.map(value => ({ value, enabled: pool.includes(value) }))
}

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
    keys: lessonKeys(1),
    previewLesson: 0,
    answer: '',
    input: '',
    inputGroups: groupCharacters(''),
    answerGroups: [],
    submitted: false,
    isPlaying: false,
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
    this.stopPlayback()
    this.setData({
      lesson,
      previewLesson: 0,
      keys: lessonKeys(lesson),
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
    this.applyLesson(Number(event.detail.value))
  },

  previewLessonChange(event) {
    const previewLesson = Number(event.detail.value)
    this.setData({ previewLesson, keys: lessonKeys(previewLesson) })
  },

  stepLesson(event) {
    const step = Number(event.currentTarget.dataset.step)
    this.applyLesson(Math.min(40, Math.max(1, this.data.lesson + step)))
  },

  applyLesson(lesson) {
    if (lesson === this.data.lesson) {
      this.setData({ previewLesson: 0, keys: lessonKeys(lesson) })
      return
    }
    this.selectLesson(lesson)
    wx.setStorageSync(LESSON_KEY, lesson)
  },

  nextRound() {
    const pool = ORDER.slice(0, this.data.lesson + 1)
    const answer = Array.from({ length: ROUND_SIZE }, () => pool[Math.floor(Math.random() * pool.length)]).join('')
    const { wpm, frequency, effectiveWpm = wpm } = getApp().globalData.cwSettings
    this.roundAudio = { wpm, frequency, effectiveWpm }
    this.setData({
      answer,
      input: '',
      inputGroups: groupCharacters(''),
      answerGroups: [],
      submitted: false,
    })
    this.playCurrent()
  },

  replay() {
    if (this.data.isPlaying) this.stopPlayback()
    else this.playCurrent()
  },

  playCurrent() {
    if (!this.data.answer) return
    this.stopPlayback()
    const duration = cwAudio.play(this.data.answer.match(/.{5}/g).join(' '), this.roundAudio)
    if (duration <= 0) return
    this.setData({ isPlaying: true })
    this.playbackTimer = setTimeout(() => {
      this.playbackTimer = null
      this.setData({ isPlaying: false })
    }, duration)
  },

  stopPlayback() {
    clearTimeout(this.playbackTimer)
    this.playbackTimer = null
    cwAudio.stop()
    if (this.data.isPlaying) this.setData({ isPlaying: false })
  },

  enterCharacter(event) {
    const { answer, input, lesson, submitted } = this.data
    const { value } = event.currentTarget.dataset
    if (!ORDER.slice(0, lesson + 1).includes(value)) return
    if (!answer) {
      wx.showToast({ title: '请先点击下一轮', icon: 'none' })
      return
    }
    if (submitted || input.length >= ROUND_SIZE) return
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
    const sameSpeed = this.scoreWpm === this.roundAudio.wpm && this.scoreEffectiveWpm === this.roundAudio.effectiveWpm
    const rounds = sameSpeed ? this.data.rounds : 0
    const total = (sameSpeed ? this.data.total : 0) + ROUND_SIZE
    const correct = (sameSpeed ? this.data.correct : 0) + roundCorrect
    this.scoreWpm = this.roundAudio.wpm
    this.scoreEffectiveWpm = this.roundAudio.effectiveWpm
    this.stopPlayback()
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
      addKochScore({
        recordedAt: Date.now(), lesson, rounds, total, correct, accuracy,
        wpm: this.scoreWpm, effectiveWpm: this.scoreEffectiveWpm,
      })
      wx.showToast({ title: '成绩已记录', icon: 'success' })
    } catch (error) {
      wx.showToast({ title: '历史成绩保存失败，请重试', icon: 'none' })
    }
  },

  openHistory() {
    wx.navigateTo({ url: '/pages/history/history?mode=koch' })
  },

  onHide() { this.stopPlayback() },
  onUnload() { this.stopPlayback() },
})
