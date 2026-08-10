const LETTER_SCORE_HISTORY_KEY = 'letterScoreHistory'

function getLetterScoreHistory() {
  const history = wx.getStorageSync(LETTER_SCORE_HISTORY_KEY)
  return Array.isArray(history) ? history : []
}

function addLetterScore(score) {
  const history = getLetterScoreHistory()
  const record = {
    ...score,
    id: `${score.recordedAt}-${history.length}`,
  }
  history.push(record)
  wx.setStorageSync(LETTER_SCORE_HISTORY_KEY, history)
  return record
}

module.exports = {
  addLetterScore,
  getLetterScoreHistory,
}
