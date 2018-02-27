const app = getApp();

Page({
  data: {
    recommended: [],
    serials: [],
    latest: [],
  },

  onLoad: function(options) {
    wx.showLoading({title: "加载中..", mask: true});
    wx.request({
      url: app.config.API_URL + "/mapi/lessons/mp_home",
      header: {'EGGMAN-X-APP-KEY': app.config.API_KEY},
      success: (e) => {
        this.setData({
          recommended: e.data.data.recommended,
          serials: [
            ['视频', e.data.data.video_tags],
            ['文章', e.data.data.article_tags],
          ],
          latest: e.data.data.latest,
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
})
