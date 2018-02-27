const app = getApp();

Page({
  data: {
    page: 1,
    serials: [],
  },

  onLoad: function(options) {
    this.loadData();

    wx.setNavigationBarTitle({title: "专题"})
  },

  loadData: function(refresh=false) {
    if (this.data.page === -1)
      return;

    wx.showLoading({title: "加载中..", mask: true});
    wx.request({
      url: app.config.API_URL + "/mapi/lessons/recommended_lesson",
      data: {page: this.data.page, from_mp: 1},
      header: {'EGGMAN-X-APP-KEY': app.config.API_KEY},
      success: (e) => {
        if (refresh) {
          this.setData({
            page: e.data.data.next_page,
            serials: e.data.data.lessons
          })
        } else {
          let rows = this.data.serials;
          rows = rows.concat(e.data.data.lessons);
          this.setData({
            page: e.data.data.next_page,
            serials: rows
          })
        }
      },
      complete: () => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  onPullDownRefresh: function() {
    this.setData({page: 1}, () => {
      this.loadData(true);
    });
  },

  onReachBottom: function() {
    this.loadData();
  },

  openSerial: function(e) {
    wx.navigateTo({
      url: `/pages/lesson/lesson?id=${e.currentTarget.dataset.serialId}`
    })
  },

})
