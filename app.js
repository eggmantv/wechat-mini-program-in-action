App({
  onLaunch: function () {
    console.log('app launch');
  },

  config: require('./config'),

  isLoggedIn: function() {
    // 根据本地存储数据判断用户是否登录
    return false;
  },
})
