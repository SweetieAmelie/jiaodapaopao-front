Page({
  data: {
    id: "",
    nickName: "",
    headUrl: "",
    inputIntroduction: ""
  },
  onLoad: function () {
    var that = this
    var cookie = wx.getStorageSync("cookie")
    that.setData({
      cookie: cookie
    })
    wx.setNavigationBarTitle({
      title: '我',
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // success
        console.log(JSON.stringify(res.data))
        if (res.data.gender == 1) {
          that.setData({
            genderImg: "../../images/nan.png"
          })
        } else if (res.data.gender == 2) {
          that.setData({
            genderImg: "../../images/nv.png"
          })
        }
        console.log(res.data.education)
        switch (res.data.education) {
          case 1:
            that.setData({
              educationInfo: "本科"
            })
            break
          case 2:
            that.setData({
              educationInfo: "硕士"
            })
            break
          case 3:
            that.setData({
              educationInfo: "博士"
            })
            break
          case 4:
            that.setData({
              educationInfo: "博士后"
            })
            break
        }
        switch (res.data.reading) {
          case 1:
            that.setData({
              readingStatus: "在读"
            })
            break
          case 2:
            that.setData({
              readingStatus: "休学"
            })
            break
          case 3:
            that.setData({
              readingStatus: "毕业"
            })
            break
          case 4:
            that.setData({
              readingStatus: "肄业"
            })
            break
        }
        if (res.data.profession == null) {
          that.setData({
            profession: ""
          })
        } else {
          that.setData({
            profession: res.data.profession
          })
        }
        if (res.data.introduction == null) {
          that.setData({
            introduction: "这个人很懒，什么都没留下~~"
          })
        } else {
          that.setData({
            introduction: res.data.introduction
          })
        }
        if (res.data.college == null) {
          that.setData({
            school: ""
          })
        } else {
          that.setData({
            school: res.data.college,
          })
        }
        if (res.data.academy == null) {
          that.setData({
            academy: ""
          })
        } else {
          that.setData({
            academy: res.data.academy
          })
        }
        that.setData({
          id: res.data.id,
        })
        if (res.data.avatarUrl != null) {
          that.setData({
            headUrl: res.data.avatarUrl
          })
        } else {
          that.setData({
            headUrl: "../../images/gerenzil.png"
          })
        }
        if (res.data.nickName != null) {
          that.setData({
            nickName: res.data.nickName
          })
        }
        that.setData({
          email: res.data.email
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
 
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // success
        console.log(JSON.stringify(res.data))
        if (res.data.gender == 1) {
          that.setData({
            genderImg: "../../images/nan.png"
          })
        } else if (res.data.gender == 2) {
          that.setData({
            genderImg: "../../images/nv.png"
          })
        }
        switch (res.data.education) {
          case 1:
            that.setData({
              educationInfo: "本科"
            })
            break
          case 2:
            that.setData({
              educationInfo: "硕士"
            })
            break
          case 3:
            that.setData({
              educationInfo: "博士"
            })
            break
          case 4:
            that.setData({
              educationInfo: "博士后"
            })
            break
        }
        switch (res.data.reading) {
          case 1:
            that.setData({
              readingStatus: "在读"
            })
            break
          case 2:
            that.setData({
              readingStatus: "休学"
            })
            break
          case 3:
            that.setData({
              readingStatus: "毕业"
            })
            break
          case 4:
            that.setData({
              readingStatus: "肄业"
            })
            break
        }
        if (res.data.profession == null) {
          that.setData({
            profession: ""
          })
        } else {
          that.setData({
            profession: res.data.profession
          })
        }
        if (res.data.introduction == null) {
          that.setData({
            introduction: "这个人很懒，什么都没留下~~"
          })
        } else {
          that.setData({
            introduction: res.data.introduction
          })
        }
        if (res.data.college == null) {
          that.setData({
            school: ""
          })
        } else {
          that.setData({
            school: res.data.college,
          })
        }
        if (res.data.academy == null) {
          that.setData({
            academy: ""
          })
        } else {
          that.setData({
            academy: res.data.academy
          })
        }
        that.setData({
          id: res.data.id,
        })
        if (res.data.avatarUrl != null) {
          that.setData({
            headUrl: res.data.avatarUrl
          })
        } else {
          that.setData({
            headUrl: "../../images/gerenzil.png"
          })
        }
        if (res.data.nickName != null) {
          that.setData({
            nickName: res.data.nickName
          })
        }
        that.setData({
          email: res.data.email
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
    var userInfo = wx.getStorageSync('userInfo')
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/preferentry/showLastUpdate',
      data: {
        id: userInfo.id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      }, // 设置请求的 header
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.statusCode == "02000000") {
          var codeData = res.data.data
          if (codeData.id != null) {
            codeData.time = toDate(codeData.lastUpdateDate)
          }
          that.setData({
            codeData: codeData
          })
        }
      }
    })
  },
  moveToInformation: function () {
    wx.navigateTo({
      url: './information',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  moveToPublished: function () {
    wx.navigateTo({
      url: './published',
    })
  },
  moveToPraisedProject: function () {
    wx.navigateTo({
      url: './publishedProject',
    })
  },
  moveToPraisedPartner: function () {
    wx.navigateTo({
      url: './publishedPartner',
    })
  },
  moveToPublishedPerson: function () {
    wx.navigateTo({
      url: './beginPerson',
    })
  },
  inputIntroduce: function (e) {
    this.setData({
      inputIntroduction: e.detail.value
    })
  },
  saveIntroduction: function () {
    var that = this
    console.log(this.data.inputIntroduction)
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/employee/updateIntroduction',
      data: {
        id: that.data.id,
        introduction: that.data.inputIntroduction
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      }, // 设置请求的 header
      success: function (res) {
        console.log(JSON.stringify(res))
        wx.setStorageSync("userInfo", res.data.data)
        if (res.data.statusCode == "02020007") {
          wx.reLaunch({
            url: '../index/team',
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  cerButton: function () {
    wx.navigateTo({
      url: '/pages/information/yzEmail',
    })
  },
  moveToAttention: function () {
    wx.navigateTo({
      url: 'attentionList',
    })
  },
  moveToFans: function () {
    wx.navigateTo({
      url: 'fansList',
    })
  },
  moveToAboutUs: function () {
    wx.navigateTo({
      url: '/pages/information/aboutUs/aboutUs',
    })
  },
  moveToPromotion: function () {
    wx.navigateTo({
      url: '/pages/information/discountList',
    })
  },
  moveToTeam: function () {
    wx.navigateTo({
      url: '/pages/group/merchant',
    })
  },
})

function toDate(number) {
  var n = number;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var Min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (Y + '-' + M + '-' + D + " " + H + ":" + Min)
}

function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}