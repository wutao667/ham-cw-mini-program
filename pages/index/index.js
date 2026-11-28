Page({
  data: {
    modes: [
      {
        url: '/pages/learn/learn',
        number: '01',
        tag: '先认识',
        title: '字母学习',
        description: '看码形，听点划。',
        accent: 'green',
      },
      {
        url: '/pages/letter/letter',
        number: '02',
        tag: '再辨音',
        title: '字母听写',
        description: '听写字母、数字和标点。',
        accent: 'orange',
      },
      {
        url: '/pages/koch/koch',
        number: '03',
        tag: '成组听',
        title: 'Koch 训练',
        description: '从两个字符开始练听写。',
        accent: 'green',
      },
      {
        url: '/pages/word/word',
        number: '04',
        tag: '连起来',
        title: '单词听写',
        description: '听写单词、呼号和通联短句。',
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
