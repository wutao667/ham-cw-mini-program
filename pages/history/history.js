const {
  getLetterScoreHistory,
  setLetterScoreTrendInclusion,
} = require('../../utils/score-history.js')

const pad = value => String(value).padStart(2, '0')

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatAxisTime(timestamp) {
  const date = new Date(timestamp)
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function createRelativeScale(values, options) {
  const dataMinimum = Math.min(...values)
  const dataMaximum = Math.max(...values)
  const dataRange = dataMaximum - dataMinimum
  const minimumSpan = options.minimumSpan
  const padding = Math.max(dataRange * 0.15, minimumSpan * 0.1)
  let minimum = dataMinimum - padding
  let maximum = dataMaximum + padding

  if (maximum - minimum < minimumSpan) {
    const center = (dataMinimum + dataMaximum) / 2
    minimum = center - minimumSpan / 2
    maximum = center + minimumSpan / 2
  }
  if (minimum < options.lowerBound) {
    maximum += options.lowerBound - minimum
    minimum = options.lowerBound
  }
  if (maximum > options.upperBound) {
    minimum -= maximum - options.upperBound
    maximum = options.upperBound
  }
  minimum = Math.max(options.lowerBound, minimum)
  maximum = Math.min(options.upperBound, maximum)

  const factor = Math.pow(10, options.decimalPlaces)
  minimum = Math.floor(minimum * factor) / factor
  maximum = Math.ceil(maximum * factor) / factor
  return { minimum, maximum }
}

Page({
  data: {
    records: [],
    hasRecords: false,
    hasChartRecords: false,
    trendRecordCount: 0,
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    const records = getLetterScoreHistory()
      .filter(record => record && record.recordedAt)
      .sort((a, b) => a.recordedAt - b.recordedAt)
      .map(record => ({
        ...record,
        includeInTrend: record.trendPreferenceSet === true
          ? record.includeInTrend !== false
          : true,
        questionCount: Number(record.questionCount) || 0,
        correctCount: Number(record.correctCount) || 0,
        accuracy: Number(record.accuracy) || 0,
        averageTimeValue: Number(record.averageTime) || 0,
        averageTime: (Number(record.averageTime) || 0).toFixed(1),
        wpmText: Number(record.wpm) > 0 ? String(Number(record.wpm)) : '—',
        dateText: formatDate(record.recordedAt),
        axisTime: formatAxisTime(record.recordedAt),
      }))
    const chartRecords = records.filter(record => record.includeInTrend)

    this.chartRecords = chartRecords
    this.setData({
      records: records.slice().reverse(),
      hasRecords: records.length > 0,
      hasChartRecords: chartRecords.length > 0,
      trendRecordCount: chartRecords.length,
    }, () => {
      if (this.chartReady) this.drawChart()
    })
  },

  toggleTrendInclusion(event) {
    const id = event.currentTarget.dataset.recordId
    const includeInTrend = event.detail.value
    try {
      if (!setLetterScoreTrendInclusion(id, includeInTrend)) {
        throw new Error('Score record not found')
      }
      this.loadHistory()
    } catch (error) {
      wx.showToast({ title: '状态保存失败，请稍后重试', icon: 'none' })
      this.loadHistory()
    }
  },

  onReady() {
    this.chartReady = true
    this.drawChart()
  },

  drawChart() {
    const records = this.chartRecords || []
    if (!records.length) return

    wx.nextTick(() => {
      wx.createSelectorQuery()
        .in(this)
        .select('#scoreChart')
        .boundingClientRect(rect => {
          if (!rect || !rect.width || !rect.height) return
          this.renderChart(records, rect.width, rect.height)
        })
        .exec()
    })
  },

  renderChart(records, width, height) {
    const context = wx.createCanvasContext('scoreChart', this)
    const plot = {
      left: 42,
      right: width - 42,
      top: 18,
      bottom: height - 38,
    }
    const plotWidth = plot.right - plot.left
    const plotHeight = plot.bottom - plot.top
    const accuracyScale = createRelativeScale(
      records.map(record => record.accuracy),
      { minimumSpan: 10, lowerBound: 0, upperBound: 100, decimalPlaces: 0 },
    )
    const averageScale = createRelativeScale(
      records.map(record => record.averageTimeValue),
      { minimumSpan: 1, lowerBound: 0, upperBound: Infinity, decimalPlaces: 1 },
    )
    const getX = index => (
      records.length === 1
        ? plot.left + plotWidth / 2
        : plot.left + (index / (records.length - 1)) * plotWidth
    )

    context.setStrokeStyle('#e5e1d8')
    context.setLineWidth(1)
    for (let index = 0; index <= 4; index += 1) {
      const y = plot.top + (plotHeight * index) / 4
      context.beginPath()
      context.moveTo(plot.left, y)
      context.lineTo(plot.right, y)
      context.stroke()
    }

    context.setFillStyle('#829087')
    context.setFontSize(10)
    context.setTextAlign('left')
    context.fillText(`${accuracyScale.maximum.toFixed(0)}%`, 2, plot.top + 4)
    context.fillText(`${accuracyScale.minimum.toFixed(0)}%`, 2, plot.bottom + 4)
    context.setTextAlign('right')
    context.fillText(`${averageScale.maximum.toFixed(1)}s`, width - 2, plot.top + 4)
    context.fillText(`${averageScale.minimum.toFixed(1)}s`, width - 2, plot.bottom + 4)

    const accuracyPoints = records.map((record, index) => ({
      x: getX(index),
      y: plot.bottom - (
        (record.accuracy - accuracyScale.minimum)
        / (accuracyScale.maximum - accuracyScale.minimum)
      ) * plotHeight,
    }))
    const timePoints = records.map((record, index) => ({
      x: getX(index),
      y: plot.bottom - (
        (record.averageTimeValue - averageScale.minimum)
        / (averageScale.maximum - averageScale.minimum)
      ) * plotHeight,
    }))

    this.drawLine(context, accuracyPoints, '#3f8a68')
    this.drawLine(context, timePoints, '#d66b3d')

    const labelIndices = records.length === 1
      ? [0]
      : [...new Set([0, Math.floor((records.length - 1) / 2), records.length - 1])]
    context.setFillStyle('#829087')
    context.setFontSize(9)
    labelIndices.forEach((recordIndex, labelIndex) => {
      if (labelIndex === 0) context.setTextAlign('left')
      else if (labelIndex === labelIndices.length - 1) context.setTextAlign('right')
      else context.setTextAlign('center')
      context.fillText(records[recordIndex].axisTime, getX(recordIndex), height - 8)
    })

    context.draw()
  },

  drawLine(context, points, color) {
    context.setStrokeStyle(color)
    context.setFillStyle(color)
    context.setLineWidth(2)
    context.beginPath()
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y)
      else context.lineTo(point.x, point.y)
    })
    context.stroke()

    points.forEach(point => {
      context.beginPath()
      context.arc(point.x, point.y, 3, 0, Math.PI * 2)
      context.fill()
    })
  },
})
