const app = getApp();
const { EventCenter, EVENT_PAY_SUCCESS } = require('../../event_center');

Page({
  data: {
    recommended: [],
    serials: [],
    latest: [],
  },

  onLoad: function(options) {
    EventCenter.addEventListener(EVENT_PAY_SUCCESS, this.route, () => {
      wx.showToast({title: "home 支付事件回调"});
    })

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
  },

  onUnload: function() {
    EventCenter.removeEventListener(EVENT_PAY_SUCCESS, this.route);
  },

  latestLessonTap: function(e) {
    wx.navigateTo({
      url: `/pages/lesson/lesson?id=${e.currentTarget.dataset.lessonSlug}`
    })
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
})
