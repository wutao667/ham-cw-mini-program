const DEFAULT_COOLDOWN_SIZE = 6
const DEFAULT_HISTORY_SIZE = 36

function chooseSoftRandom(items, history = [], options = {}) {
  if (!items.length) return ''

  const requestedCooldown = typeof options.cooldownSize === 'number'
    ? options.cooldownSize
    : DEFAULT_COOLDOWN_SIZE
  const cooldownSize = Math.min(requestedCooldown, Math.max(0, items.length - 1))
  const historySize = typeof options.historySize === 'number'
    ? options.historySize
    : DEFAULT_HISTORY_SIZE
  const random = typeof options.random === 'function' ? options.random : Math.random
  const recentItems = new Set(history.slice(-cooldownSize))
  let candidates = items.filter(item => !recentItems.has(item))
  if (!candidates.length) candidates = items.slice()

  const recentHistory = history.slice(-historySize)
  const counts = recentHistory.reduce((result, item) => {
    result[item] = (result[item] || 0) + 1
    return result
  }, {})
  const weightedCandidates = candidates.map(item => {
    const recentCount = counts[item] || 0
    return {
      item,
      weight: 1 / ((recentCount + 1) * (recentCount + 1)),
    }
  })
  const totalWeight = weightedCandidates.reduce((sum, candidate) => (
    sum + candidate.weight
  ), 0)
  let threshold = random() * totalWeight

  for (let index = 0; index < weightedCandidates.length; index += 1) {
    const candidate = weightedCandidates[index]
    if (threshold < candidate.weight) return candidate.item
    threshold -= candidate.weight
  }
  return weightedCandidates[weightedCandidates.length - 1].item
}

function appendSelection(history, item, historySize = DEFAULT_HISTORY_SIZE) {
  return history.concat(item).slice(-historySize)
}

module.exports = {
  appendSelection,
  chooseSoftRandom,
  DEFAULT_COOLDOWN_SIZE,
  DEFAULT_HISTORY_SIZE,
}
