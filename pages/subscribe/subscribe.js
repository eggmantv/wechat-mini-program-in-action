const app = getApp();

Page({
  data: {
    year: null,
    quarter: null
  },

  onLoad: function() {
    wx.showLoading({title: "加载中..", mask: true});

    wx.request({
      url: app.config.API_URL + `/mapi/mp/products`,
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY,
        // 用户的app_session_key也需要传递到后台，用于识别用户
      },
      success: e => {
        wx.setNavigationBarTitle({title: "订阅"});

        this.setData({
          year: e.data.data.year,
          quarter: e.data.data.quarter,
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  purchase: function(e) {
    const product = e.currentTarget.dataset.product;
    wx.request({
      url: app.config.API_URL + `/mapi/mp/generate_prepay`,
      method: 'POST',
      header: {
        'EGGMAN-X-APP-KEY': app.config.API_KEY,
        // 用户的app_session_key也需要传递到后台，用于识别用户
      },
      data: {product: product},
      success: trans => {
        // console.log(trans);

        wx.requestPayment({
          timeStamp: trans.data.data.timeStamp,
          nonceStr: trans.data.data.nonceStr,
          package: trans.data.data.package,
          signType: trans.data.data.signType,
          paySign: trans.data.data.paySign,
          success: res => {
            if (res.errMsg === "requestPayment:ok") {
              // console.log("支付成功");
              wx.showToast({
                title: "支付成功",
                icon: "success",
                mask: true,
                complete: () => {
                  setTimeout(() => {
                    wx.reLaunch({url: "/pages/profile/profile"});
                  }, 1500)
                }
              })
            } else {
              console.log("支付异常");
              console.log(res);
            }
          },
          fail: res => {
            if (res.errMsg !== "requestPayment:fail cancel") {
              console.log("支付失败");
              console.log(res);
            }
          }
        })
      },
    });
  },

})
