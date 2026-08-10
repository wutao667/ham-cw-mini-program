const LETTER_SCORE_HISTORY_KEY = 'letterScoreHistory'

function getLetterScoreHistory() {
  const history = wx.getStorageSync(LETTER_SCORE_HISTORY_KEY)
  return Array.isArray(history) ? history : []
}

function addLetterScore(score) {
  const history = getLetterScoreHistory()
  const record = {
    ...score,
    includeInTrend: true,
    trendPreferenceSet: false,
    id: `${score.recordedAt}-${history.length}`,
  }
  history.push(record)
  wx.setStorageSync(LETTER_SCORE_HISTORY_KEY, history)
  return record
}

function setLetterScoreTrendInclusion(id, includeInTrend) {
  const history = getLetterScoreHistory()
  let found = false
  const updatedHistory = history.map(record => {
    if (record.id !== id) return record
    found = true
    return {
      ...record,
      includeInTrend: Boolean(includeInTrend),
      trendPreferenceSet: true,
    }
  })
  if (!found) return false
  wx.setStorageSync(LETTER_SCORE_HISTORY_KEY, updatedHistory)
  return true
}

module.exports = {
  addLetterScore,
  getLetterScoreHistory,
  setLetterScoreTrendInclusion,
}
