const cwAudio = require('../../utils/cw-audio.js')
const { TRAINING_TYPES, SCENES, DIFFICULTIES, generateExercise } = require('../../utils/qso-generator.js')

const app = getApp()

function normalizeInput(value) {
  return String(value || '')
    .replace(/[\uFF01-\uFF5E]/g, character => String.fromCharCode(character.charCodeAt(0) - 0xFEE0))
    .toUpperCase()
    .replace(/\s+/g, ' ')
}

Page({
  data: {
    trainingTypes: TRAINING_TYPES,
    scenes: SCENES,
    difficulties: DIFFICULTIES,
    trainingType: 'phrase',
    difficulty: 'easy',
    sceneIndex: 0,
    sceneLabel: SCENES[0].label,
    difficultyNote: DIFFICULTIES[0].note,
    letterCount: 3,
    wpm: 15,
    frequency: 650,
    hasQuestion: false,
    answer: '',
    inputValue: '',
    revealed: false,
    isCorrect: false,
    isPlaying: false,
    exerciseHint: '',
    exerciseLabel: '',
    questionCount: 0,
    correctCount: 0,
    accuracy: 0,
    counted: false,
  },

  onShow() {
    const settings = app.globalData.cwSettings
    this.setData({ wpm: settings.wpm, frequency: settings.frequency })
  },

  clearQuestion(extra = {}) {
    this.stopPlayback()
    this.setData({
      hasQuestion: false,
      answer: '',
      inputValue: '',
      revealed: false,
      isCorrect: false,
      counted: false,
      exerciseHint: '',
      exerciseLabel: '',
      ...extra,
    })
  },

  changeTrainingType(event) {
    const trainingType = event.currentTarget.dataset.type
    if (trainingType === this.data.trainingType || !TRAINING_TYPES.some(item => item.id === trainingType)) return
    this.clearQuestion({ trainingType })
  },

  changeDifficulty(event) {
    const difficulty = event.currentTarget.dataset.difficulty
    const option = DIFFICULTIES.find(item => item.id === difficulty)
    if (!option || difficulty === this.data.difficulty) return
    this.clearQuestion({ difficulty, difficultyNote: option.note })
  },

  changeScene(event) {
    const sceneIndex = Number(event.detail.value)
    if (!SCENES[sceneIndex] || sceneIndex === this.data.sceneIndex) return
    this.clearQuestion({ sceneIndex, sceneLabel: SCENES[sceneIndex].label })
  },

  changeLetterCount(event) {
    const letterCount = Number(event.detail.value)
    if (letterCount >= 2 && letterCount <= 8) this.clearQuestion({ letterCount })
  },

  randomPlay() {
    this.stopPlayback()
    const exercise = generateExercise({
      type: this.data.trainingType,
      scene: SCENES[this.data.sceneIndex].id,
      difficulty: this.data.difficulty,
      letterCount: this.data.letterCount,
      history: this.exerciseHistory || [],
    })
    this.exerciseHistory = (this.exerciseHistory || []).concat({ id: exercise.id, text: exercise.text }).slice(-36)
    const type = TRAINING_TYPES.find(item => item.id === exercise.type)
    this.setData({
      hasQuestion: true,
      answer: exercise.text,
      inputValue: '',
      revealed: false,
      isCorrect: false,
      counted: false,
      exerciseHint: exercise.hint || '',
      exerciseLabel: [type ? type.label : '', exercise.sceneLabel || ''].filter(Boolean).join(' · '),
    })
    this.playCurrent()
  },

  replay() {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先生成并播放题目', icon: 'none' })
      return
    }
    if (this.data.isPlaying) this.stopPlayback()
    else this.playCurrent()
  },

  playCurrent() {
    this.stopPlayback()
    const duration = cwAudio.play(this.data.answer, this.data)
    if (duration <= 0) return
    this.setData({ isPlaying: true })
    this.playbackTimer = setTimeout(() => {
      this.playbackTimer = null
      this.setData({ isPlaying: false })
    }, duration)
  },

  stopPlayback() {
    if (this.playbackTimer != null) clearTimeout(this.playbackTimer)
    this.playbackTimer = null
    cwAudio.stop()
    if (this.data.isPlaying) this.setData({ isPlaying: false })
  },

  onInput(event) {
    const inputValue = normalizeInput(event.detail.value).slice(0, 240)

    this.setData({
      inputValue,
      isCorrect: this.data.revealed && inputValue.trim() === this.data.answer,
    })
    return inputValue
  },

  revealAnswer() {
    if (!this.data.hasQuestion) {
      wx.showToast({ title: '请先生成并播放题目', icon: 'none' })
      return
    }
    const isCorrect = normalizeInput(this.data.inputValue).trim() === this.data.answer
    this.setData({
      revealed: true,
      isCorrect,
      ...this.resultUpdate(isCorrect),
    })
  },

  resultUpdate(isCorrect) {
    if (this.data.counted) return {}
    const questionCount = this.data.questionCount + 1
    const correctCount = this.data.correctCount + (isCorrect ? 1 : 0)
    return {
      questionCount,
      correctCount,
      accuracy: Math.round((correctCount / questionCount) * 100),
      counted: true,
    }
  },

  onHide() {
    this.stopPlayback()
  },

  onUnload() {
    this.stopPlayback()
    this.exerciseHistory = []
  },
})
