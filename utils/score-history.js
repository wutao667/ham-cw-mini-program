const LETTER_SCORE_HISTORY_KEY = 'letterScoreHistory'
const KOCH_SCORE_HISTORY_KEY = 'kochScoreHistory'

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
  return setTrendInclusion(LETTER_SCORE_HISTORY_KEY, getLetterScoreHistory(), id, includeInTrend)
}

function getKochScoreHistory() {
  const history = wx.getStorageSync(KOCH_SCORE_HISTORY_KEY)
  if (!Array.isArray(history)) return []
  return history.filter(Boolean).map(record => ({
    ...record,
    // The previous version stored each submitted round with a timestamp in its ID.
    recordedAt: record.recordedAt || Number(String(record.id).split('-')[0]),
    rounds: record.rounds || 1,
  }))
}

function addKochScore(score) {
  const history = getKochScoreHistory()
  const record = { ...score, id: `${score.recordedAt}-snapshot-${history.length}` }
  wx.setStorageSync(KOCH_SCORE_HISTORY_KEY, [record, ...history])
}

function setKochScoreTrendInclusion(id, includeInTrend) {
  return setTrendInclusion(KOCH_SCORE_HISTORY_KEY, getKochScoreHistory(), id, includeInTrend)
}

function setTrendInclusion(key, history, id, includeInTrend) {
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
  wx.setStorageSync(key, updatedHistory)
  return true
}

module.exports = {
  addLetterScore,
  getLetterScoreHistory,
  setLetterScoreTrendInclusion,
  getKochScoreHistory,
  addKochScore,
  setKochScoreTrendInclusion,
}
