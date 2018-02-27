App({
  config: require('./config'),

  appData: {
    user: {}
  },

  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        if (res.errMsg !== "login:ok") {
          wx.showModal({
            title: "抱歉",
            content: "登录发生异常，请稍后重试，或者重新打开小程序"
          })
          return;
        }

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.config.API_URL + `/mapi/mp/fetch_userinfo`,
          method: 'POST',
          data: {
            code: res.code,
            app_session_key: wx.getStorageSync('app_session_key'),
          },
          header: {'EGGMAN-X-APP-KEY': this.config.API_KEY},
          success: e => {
            // console.log(e);
            // 获取用户信息，实际上如果不需要用户的头像，昵称这些数据这里不需要调用
            this.requestUserInfo(e);

            // 设置用户本地数据
            this.appData.user.open_id = e.data.data.openid;
            if (e.data.data.app_session_key) {
              this.setUserSession(e.data.data.app_session_key);
            }
          }
        })
      }
    })
  },

  requestUserInfo: function(obj) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          this.uploadUserInfo(obj);
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              // console.log("授权成功");
              this.uploadUserInfo(obj);
            },
            fail: () => {
              // 用户拒绝授权
            }
          })
        }
      }
    })
  },

  uploadUserInfo: function(obj) {
    wx.getUserInfo({
      success: res => {
        // console.log("user info: ")
        // console.log(res);
        // 发送到后台校验用户数据是否合法
        wx.request({
          url: this.config.API_URL + `/mapi/mp/verify_userinfo`,
          method: 'POST',
          data: {data: JSON.stringify(res), session_key: obj.data.data.session_key},
          header: {'EGGMAN-X-APP-KEY': this.config.API_KEY},
          success: e => {
            // console.log(e)
          }
        })
      }
    })
  },

  setUserSession: function(data) {
    if (!data)
      return;

    wx.setStorage({
      key: 'app_session_key',
      data: data,
    });
    this.appData.user.app_session_key = data;
  },

  clearUserSession: function() {
    wx.removeStorageSync('app_session_key');
    this.appData.user.app_session_key = null;
  },

  isLoggedIn: function() {
    // 根据本地存储数据判断用户是否登录
    return !!this.appData.user.app_session_key;
  },
})
