//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (){
    var that = this//不要漏了这句，很重要
    wx.request({
      url: 'https://upload.duodework.cn/zhongxin-web-front/employee/register',
      headers: {
        'Content-Type': 'application/json'
      },
      method:'post',
      data:{
        id:"sdfnguh"
      },
      success: function (res) {
        that.setData({  
          motto: res.data.statusCode
        })
        //将获取到的json数据，存在名字叫zhihu的这个数组中

      }
    })
  }
})
