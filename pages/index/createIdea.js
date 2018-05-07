Page({
  data: {
    managerId: "",
    projectName: "",
    ideaName: "",
    name: "",
    contactInformation: "",
    school: "",
    ideaIntroduce: "",
    open: true,
    labelList: "",
    selectedLabel: [],
    pics: [],
    date: "",
    peopleCounting: "",
    latitude: "",   //精度
    longitude: "",   //纬度
    addressName: "",
    address: "",
    startTime: "",
    endTime: "",
    time: "08:00",
    picsLength: 0,
    issueButtonControl: false,
  },
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    var cityInfo = wx.getStorageSync("cityInfo")
    var cookie = wx.getStorageSync("cookie")
    that.setData({
      cookie: cookie,
      managerId: userInfo.id,
      name: userInfo.nickName,
      school: userInfo.college,
      headUrl: userInfo.avatarUrl
    })
  },
  projectName: function (e) {
    this.setData({
      projectName: e.detail.value
    })
  },
  ideaIntroduce: function (e) {
    this.setData({
      ideaIntroduce: e.detail.value
    })
  },
  
  issueButton: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    console.log(this.data)
    if (this.data.ideaIntroduce == "") {
      wx.showModal({
        title: '提醒',
        content: '跑单名称、跑单内容不能为空',
      })
    } else {
      if (userInfo.telephone != null) {
        wx.showModal({
          title: '提醒',
          content: '请先完成手机验证',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '/pages/information/yzPhone',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        that.setData({
          issueButtonControl: true
        })
            wx.request({
              url: 'https://upload.duodework.cn/zhongxin-web-front/idea/save',
              data: {
                title: this.data.projectName,
                content: this.data.ideaIntroduce,
                creater: this.data.name,
                createrId: this.data.managerId,
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/json',
                'Cookie': this.data.cookie
              }, // 设置请求的 header
              success: function (res) {
                // success
                console.log(JSON.stringify(res))
                if (res.data.statusCode == "02000000") {
                  console.log("ok")
                  // wx.redirectTo({
                  //   url: '/pages/index/showTeamDetail?ideaId=' + res.data.data.id,
                  // })
                } else if (res.data.statusCode == "02020007") {
                  wx.reLaunch({
                    url: 'team',
                  })
                }
              },
              fail: function (res) {
                // fail
                that.setData({
                  issueButtonControl: false
                })
              },
              complete: function (res) {
                // complete
                setTimeout(function () {
                  that.setData({
                    issueButtonControl: false
                  })
                }, 100)
              }
            })
      }
    }
  }
})
function toDate(number) {
  var n = number;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ":";
  var Min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ":";
  var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (Y + '年' + M + '月' + D + '日' + " " + H + Min + S)
} 
