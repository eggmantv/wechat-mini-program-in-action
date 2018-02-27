const app = getApp();

Page({
  data: {
    lessons: [],
    serial: null,
    hideLearnBtn: true,
    firstLessonID: null,
  },

  onLoad: function(params) {
    this.loadData(params);
  },

  loadData: function(params) {
    wx.showLoading({title: "加载中..", mask: true});

    wx.request({
      url: app.config.API_URL + `/mapi/tags/${params.id}.json`,
      header: {'EGGMAN-X-APP-KEY': app.config.API_KEY},
      success: (e) => {
        this.setData({
          lessons: e.data.data.lessons,
          serial: e.data.data.tag,
          firstLessonID: e.data.data.lessons[0].url_name,
          hideLearnBtn: false,
        });

        wx.setNavigationBarTitle({title: e.data.data.tag.showname})
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  startLearnClick: function(e) {
    let first = this.data.lessons[0];
    let url = first.lesson_type === 'video' ?
      "/pages/player/player?id=" + first.url_name :
      "/pages/read/read?id=" + first.id;

    wx.navigateTo({url: url});
  },

})
