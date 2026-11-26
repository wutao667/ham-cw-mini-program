App({
  onLaunch() {
    const savedSettings = wx.getStorageSync('cwSettings')
    if (savedSettings) {
      this.globalData.cwSettings = {
        ...this.globalData.cwSettings,
        ...savedSettings,
      }
    }
  },

  globalData: {
    cwSettings: {
      wpm: 15,
      frequency: 650,
    },
  },
})
