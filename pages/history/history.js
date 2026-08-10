const { getLetterScoreHistory } = require('../../utils/score-history.js')

const pad = value => String(value).padStart(2, '0')

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatAxisTime(timestamp) {
  const date = new Date(timestamp)
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

Page({
  data: {
    records: [],
    hasRecords: false,
  },

  onShow() {
    const chartRecords = getLetterScoreHistory()
      .filter(record => record && record.recordedAt)
      .sort((a, b) => a.recordedAt - b.recordedAt)
      .map(record => ({
        ...record,
        questionCount: Number(record.questionCount) || 0,
        correctCount: Number(record.correctCount) || 0,
        accuracy: Number(record.accuracy) || 0,
        averageTimeValue: Number(record.averageTime) || 0,
        averageTime: (Number(record.averageTime) || 0).toFixed(1),
        dateText: formatDate(record.recordedAt),
        axisTime: formatAxisTime(record.recordedAt),
      }))

    this.chartRecords = chartRecords
    this.setData({
      records: chartRecords.slice().reverse(),
      hasRecords: chartRecords.length > 0,
    }, () => {
      if (this.chartReady) this.drawChart()
    })
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
    const maxAverage = Math.max(...records.map(record => record.averageTimeValue), 1)
    const averageScale = Math.ceil(maxAverage * 1.15 * 10) / 10
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
    context.fillText('100%', 2, plot.top + 4)
    context.fillText('0%', 12, plot.bottom + 4)
    context.setTextAlign('right')
    context.fillText(`${averageScale.toFixed(1)}s`, width - 2, plot.top + 4)
    context.fillText('0.0s', width - 2, plot.bottom + 4)

    const accuracyPoints = records.map((record, index) => ({
      x: getX(index),
      y: plot.bottom - (Math.max(0, Math.min(100, record.accuracy)) / 100) * plotHeight,
    }))
    const timePoints = records.map((record, index) => ({
      x: getX(index),
      y: plot.bottom - (record.averageTimeValue / averageScale) * plotHeight,
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
