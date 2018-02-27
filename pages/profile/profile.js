const app = getApp();
const { EventCenter, EVENT_PAY_SUCCESS } = require('../../event_center');

Page({
  data: {
    user: null,
  },

  onLoad: function() {
    this.loadData();
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  loadData: function() {
    if (!app.isLoggedIn())
      return;

    wx.showLoading({title: "加载中..", mask: true});
    wx.request({
      url: app.config.API_URL + "/mapi/users/info",
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY,
        'EGGMAN-X-APP-SESSION-KEY': app.appData.user.app_session_key,
      },
      success: res => {
        this.setData({user: res.data.data.user});
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  logout: function(e) {
    wx.showModal({
      title: "确认",
      content: "退出登录吗?",
      cancelText: "取消",
      confirmText: "确定",
      confirmColor: "#0288d1",
      success: res => {
        if (res.confirm) {
          app.clearUserSession();
          wx.showToast({
            title: "已退出",
            icon: "none",
            mask: true,
          });
          setTimeout(() => {
            wx.reLaunch({url: "/" + this.route});
          }, 1500);
        }
      }
    })
  },

  eventNotify: function(e) {
    EventCenter.dispatchEvent(EVENT_PAY_SUCCESS);
  }

})
