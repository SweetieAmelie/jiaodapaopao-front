// pages/information/information.js
Page({
  data: {
    educationList: ['本科', '硕士', '博士', '博士后'],
    sexList: ['男', '女'],
    statusList: ['在读', '休学', '毕业'],
    id: "",
    nickName: "",
    school: "请输入学校",
    major: "",
    gender: "",
    status: "",
    education: "",
    eduIndex: "",
    statusIndex: "",
    genderIndex: "",
    openSearchSchool: false,
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人资料',
    })
  },
  onShow: function () {
    var that = this
    var cookie = wx.getStorageSync("cookie")
    that.setData({
      cookie: cookie
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // success
        console.log(JSON.stringify(res))
        that.setData({
          id: res.data.id
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
        if (res.data.college != null) {
          that.setData({
            school: res.data.college,
            schoolId: res.data.collegeId
          })
        }
        if (res.data.profession != null) {
          that.setData({
            major: res.data.profession
          })
        }
        if (res.data.gender != null) {
          switch (res.data.gender) {
            case "0":
              break
            case "1":
              that.setData({
                gender: "男",
                genderIndex: 1
              })
              break
            case "2":
              that.setData({
                gender: "女",
                genderIndex: 2
              })
              break
          }
        }
        if (res.data.reading != null) {
          if (res.data.reading == 0) {
            that.setData({
              status: "状态"
            })
          } else {
            switch (res.data.reading) {
              case 1:
                that.setData({
                  status: "在读"
                })
                break
              case 2:
                that.setData({
                  status: "休学"
                })
                break
              case 3:
                that.setData({
                  status: "毕业"
                })
                break
              case 4:
                that.setData({
                  status: "肄业"
                })
                break
            }
          }

        }
        if (res.data.education != null) {
          if (res.data.education == 0) {
            that.setData({
              education: "学历"
            })
          } else {
            switch (res.data.education) {
              case 1:
                that.setData({
                  education: "本科"
                })
                break
              case 2:
                that.setData({
                  education: "硕士"
                })
                break
              case 3:
                that.setData({
                  education: "博士"
                })
                break
              case 4:
                that.setData({
                  education: "博士后"
                })
                break
            }
          }

        } else {
          that.setData({
            education: "学历"
          })
        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  name: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  major: function (e) {
    this.setData({
      major: e.detail.value
    })
  },
  educationChange: function (e) {
    var index = parseInt(e.detail.value) + 1
    switch (index) {
      case 1:
        this.setData({
          education: "本科"
        })
        break
      case 2:
        this.setData({
          education: "硕士"
        })
        break
      case 3:
        this.setData({
          education: "博士"
        })
        break
      case 4:
        this.setData({
          education: "博士后"
        })
        break
    }
    this.setData({
      eduIndex: index
    })
  },
  sexChange: function (e) {
    var index = parseInt(e.detail.value)
    switch (index) {
      case 0:
        this.setData({
          gender: "男"
        })
        break
      case 1:
        this.setData({
          gender: "女"
        })
        break
    }
    this.setData({
      genderIndex: index + 1
    })
  },
  statusChange: function (e) {
    var index = parseInt(e.detail.value) + 1
    switch (index) {
      case 1:
        this.setData({
          status: "在读"
        })
        break
      case 2:
        this.setData({
          status: "休学"
        })
        break
      case 3:
        this.setData({
          status: "毕业"
        })
        break
    }
    this.setData({
      statusIndex: index
    })
  },
  saveUserInfo: function () {
    var school = ""
    if (this.data.school == '请输入学校') {
      school = ""
    } else {
      school = this.data.school
    }
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/employee/updatePersonal',
      data: {
        id: this.data.id,
        nickName: this.data.nickName,
        education: this.data.eduIndex,
        profession: this.data.major,
        gender: this.data.genderIndex,
        reading: this.data.statusIndex,
        college: school,
        collegeId: this.data.schoolId
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
          wx.setStorageSync("userInfo", res.data.data)
          wx.switchTab({
            url: 'myInfo',
          })
        } else if (res.data.statusCode == "02020007") {
          wx.reLaunch({
            url: '../index/team',
          })
        } else if (res.data.statusCode == "02020032") {
          wx.showModal({
            title: '提醒',
            content: '学校修改每个月只能进行一次',
          })
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  yzPhone: function () {
    wx.navigateTo({
      url: './yzPhone',
    })
  },
  searchInfo: function (e) {
    var that = this
    var searchInfo = e.detail.value
    console.log(searchInfo)
    this.setData({
      searchInfo: searchInfo,
    })
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/college/search',
      data: {
        collegeName: searchInfo
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.statusCode == "02000000") {
          var schoolList = res.data.data
          that.setData({
            schoolList: schoolList
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  searchDone: function () {
    var that = this
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/college/search',
      data: {
        collegeName: this.data.searchInfo
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.statusCode == "02000000") {
          var schoolList = res.data.data
          that.setData({
            schoolList: schoolList
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  chooseSchool: function () {
    console.log("ok")
    this.setData({
      openSearchSchool: true
    })
  },
  seletecdSchool: function (e) {
    var idx = e.currentTarget.dataset.idx
    var schoolList = this.data.schoolList
    var school = schoolList[idx].collegeName
    var schoolId = schoolList[idx].id
    this.setData({
      school: school,
      schoolId: schoolId,
      openSearchSchool: false
    })
  },
  closeWin: function () {
    this.setData({
      openSearchSchool: false
    })
  },
  searchDelete: function () {
    this.setData({
      info: ""
    })
  },
  changeHeadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://upload.duodework.cn/client-web-front/avatarLibrary/fileSave',
          filePath: tempFilePaths[0],
          name: 'headImg',
          header: {
            'Cookie': that.data.cookie
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.statusCode == "02000000") {
              console.log(JSON.stringify(data))
              var headUrl = data.data.filePath
              wx.request({
                url: 'https://upload.duodework.cn/client-web-front/employee/updateAvatar',
                data: {
                  employeeId: that.data.id,
                  headUrl: headUrl
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'content-type': 'application/json',
                  'Cookie': that.data.cookie
                },
                success: function (res) {
                  console.log(JSON.stringify(res))
                  if (res.data.statusCode == "02000000") {
                    wx.setStorageSync("userInfo", res.data.data)
                    that.setData({
                      headUrl: res.data.data.avatarUrl
                    })
                  }
                },
                fail: function (res) {

                },
                complete: function (res) {

                }
              })
            }
          }
        })
      }
    })
  }
})