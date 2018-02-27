const app = getApp();

Page({
  data: {
  },

  signup: function(e) {
    wx.showLoading({title: "加载中..", mask: true});

    wx.request({
      url: app.config.API_URL + "/mapi/users",
      method: 'POST',
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY
      },
      data: {
        user: e.detail.value,
      },
      success: res => {
        if (res.data.status === 'ok') {
          wx.showModal({
            title: "注册完成",
            content: "请进入您的邮箱，激活账号，然后再点击登录",
            cancelText: "取消",
            confirmText: "登录",
            confirmColor: "#0288d1",
            success: res => {
              if (res.confirm) {
                this.login();
              }
            }
          });
        } else {
          wx.showModal({
            title: "失败",
            showCancel: false,
            content: res.data.errors.join("\n"),
            confirmColor: "#0288d1",
          });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  login: function(e) {
    wx.redirectTo({url: '/pages/session/session?from=signup'});
  },

})
