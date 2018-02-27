const app = getApp();

Page({
  data: {
  },

  login: function(e) {
    wx.showLoading({title: "加载中..", mask: true});

    wx.request({
      url: app.config.API_URL + "/mapi/users/login_action",
      method: 'POST',
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY
      },
      data: {
        ...e.detail.value,
        open_id: app.appData.user.open_id
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status === 'ok') {
          app.setUserSession(res.data.data.user.app_session_key);

          wx.reLaunch({url: "/pages/profile/profile"});
        } else {
          wx.showModal({
            title: "失败",
            showCancel: false,
            content: res.data.errors.join("\n")
          });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  signup: function(e) {
    wx.redirectTo({url: '/pages/signup/signup?from=session'});
  },
})
