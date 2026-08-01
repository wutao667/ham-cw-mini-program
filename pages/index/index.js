Page({
  data: {
    modes: [
      {
        url: '/pages/learn/learn',
        number: '01',
        tag: '先认识',
        title: '字母学习',
        description: '看码形、听声音，从 A 到 Z 建立声音记忆。',
        meta: '26 个字母 · 自由点播',
        accent: 'green',
      },
      {
        url: '/pages/letter/letter',
        number: '02',
        tag: '再辨音',
        title: '字母听写',
        description: '随机播放单个字母，输入答案并即时核对。',
        meta: '随机出题 · 成绩统计',
        accent: 'orange',
      },
      {
        url: '/pages/word/word',
        number: '03',
        tag: '连起来',
        title: '单词听写',
        description: '从常用短词开始，训练连续抄收与节奏感。',
        meta: 'HAM 常用词 · 难度分级',
        accent: 'blue',
      },
    ],
  },

  openMode(event) {
    wx.navigateTo({ url: event.currentTarget.dataset.url })
  },

  openSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  openAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  },
})
