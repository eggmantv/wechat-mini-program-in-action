const app = getApp();

Page({
  data: {
    url: null,
  },

  onLoad: function(params) {
    wx.showLoading({title: "加载中..", mask: true});
    wx.request({
      url: app.config.API_URL + `/mapi/lessons/${params.id}/read_from_mp.json`,
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY,
      },
      success: res => {
        if (res.data.status === 'ok') {
          let url = `${app.config.API_URL}${res.data.data.url}`;
          this.setData({url}, () => {
            wx.showNavigationBarLoading();
          });

          wx.setNavigationBarTitle({title: res.data.data.title});

          setTimeout(() => {
            wx.hideNavigationBarLoading()
          }, 2000);
        } else {
          wx.showModal({
            title: "提醒",
            content: "需要订阅才能观看付费内容",
            cancelText: "取消",
            confirmText: "订阅",
            confirmColor: "#0288d1",
            success: res => {
              if (res.confirm) {
                this.navToSubPage();
              } else if (res.cancel) {
                wx.navigateBack();
              }
            }
          })
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  navToSubPage: function() {
    if (app.isLoggedIn()) {
      wx.navigateTo({url: "/pages/subscribe/subscribe"});
    } else {
      wx.navigateTo({url: "/pages/session/session"});
    }
  },

})
