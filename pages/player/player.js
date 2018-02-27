const app = getApp();

Page({
  data: {
    scrollViewHeight: 0,

    lesson: null,
    tag: null,
    lessons: [],
    video_url: null,
    video_poster: null,
    playing_record: null,
  },

  onLoad: function(params) {
    this.loadData(params);
  },

  loadData: function(params) {
    wx.showLoading({title: "加载中..", mask: true});

    wx.request({
      url: app.config.API_URL + `/mapi/players/${params.id}.json`,
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY,
      },
      success: (e) => {
        wx.setNavigationBarTitle({title: e.data.data.lesson.title});

        this.setData(e.data.data, () => {
          if (!this.data.video_url) {
            wx.showModal({
              title: "提醒",
              content: "需要订阅才能观看付费内容",
              cancelText: "取消",
              confirmText: "订阅",
              confirmColor: "#0288d1",
              success: res => {
                if (res.confirm) {
                  this.navToSubPage();
                }
              }
            })
          }
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  onShow: function() {
    wx.getSystemInfo({
      success: sys => {
        let query = wx.createSelectorQuery();
        query.select("#player").fields({
          size: true
        }, ele => {
          this.setData({
            scrollViewHeight: sys.windowHeight - ele.height - 20
          })
        }).exec()
      }
    })
  },

  onVideoPlay: function(e) {
    if (!this.data.video_url) {
      this.navToSubPage();
    }
  },

  navToSubPage: function() {
    if (app.isLoggedIn()) {
      wx.navigateTo({url: "/pages/subscribe/subscribe"});
    } else {
      wx.navigateTo({url: "/pages/session/session"});
    }
  },

})
