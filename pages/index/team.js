Page({
  data: {
    id: "",
    ideaList: "",
    displayControl: "hide",
    labelList: "",
    selections: [],
    filter: "",
    endIdeaId: "",
    showMoreSwitch: false,
    selectedColleage: "",
    selectedCity: "active",
    selectedMap: "",
    colleageControl: false,
    cityControl: true,
    mapControl: false,
    videoControl: false,
    toTop: 0,
    imgUrls: [
      '/images/UI/lunzhuantu.png'
    ]
  },
  onShareAppMessage: function (res) {
    var that = this
    console.log(JSON.stringify(res))
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请您加入组队',
      path: '/pages/index/showTeamDetail?ideaId=' + res.target.id,
      imageUrl: '/images/UI/newShare.png',
      success: function (res) {
        // 转发成功
        console.log(JSON.stringify(res))
        if (res.errMsg == "shareAppMessage:ok") {
          if (that.data.isBusinessCertification == 1) {
            wx.request({
              url: 'https://upload.duodework.cn/client-web-front/forwarding/save',
              data: {
                ideaId: that.data.ideaId,
                employeeId: that.data.id,
                enterStatus: 2
              },
              method: "POST",
              header: {
                'content-type': 'application/json',
                'Cookie': that.data.cookie
              },
              success: function (res) {
                console.log(JSON.stringify(res))
                if (res.data.statusCode == "02000000") {
                  var lotteryNumList = that.data.lotteryNumList
                  var Li = {
                    winningNumber: res.data.data.winningNumber
                  }
                  lotteryNumList.push(Li)
                  that.setData({
                    lotteryNumList: lotteryNumList
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
      },
      fail: function (res) {
        console.log(JSON.stringify(res))
        // 转发失败
      }
    }
  },
  onLoad: function (options) {
    var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
    var qqmapsdk;
    qqmapsdk = new QQMapWX({
      key: 'M2HBZ-2GJKP-LX4D7-V3NH4-MWYK3-ILFQI'
    });
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        console.log(JSON.stringify(res));
        var cityInfo = {
          cityCode: res.result.ad_info.city_code,
          city: res.result.address_component.city,
        }
        wx.setStorageSync("cityInfo", cityInfo)
      },
      fail: function (res) {
        console.log(res);
      }
    });
    var that = this
    var status = wx.getStorageSync('route')
    wx.setNavigationBarTitle({
      title: '交大跑跑',
    })
    var currentLocation = wx.getStorageSync("currentLocation")
    var userInfo = wx.getStorageSync("userInfo")
    var cookie = wx.getStorageSync("cookie")
    var cityInfo = wx.getStorageSync("cityInfo")
    that.setData({
      cookie: cookie,
      id: userInfo.id,
      name: userInfo.nickName,
      collegeId: userInfo.collegeId,
      currentLat: currentLocation.currentLat,
      currentLon: currentLocation.currentLon,
      cityCode: cityInfo.cityCode,
      status: status
    })
    console.log(that.data.cityCode)
    switch (status) {
      case "1":
        wx.navigateTo({
          url: '/pages/group/merchant',
        })
        wx.setStorageSync('route', '')
        break
      case "2":
        wx.switchTab({
          url: '/pages/partner/partner',
        })
        wx.setStorageSync('route', '')
        break
    }
    if (status == "1") {

    }
    wx.getSystemInfo({
      success: function (res) {
        var left = res.windowWidth / 2
        var top = res.windowHeight / 2 - 100
        console.log(res.windowHeight)
        console.log(res.windowWidth)
        that.setData({
          controls: [{
            id: 1,
            iconPath: '/images/wodedingwei.png',
            position: {
              left: left,
              top: top,
              width: 22,
              height: 35
            },
            clickable: true
          }]
        })
      },
    })
  },
  onShow: function () {

  },
  onReady: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var userInfo = wx.getStorageSync("userInfo")
    var cookie = wx.getStorageSync("cookie")
    var cityInfo = wx.getStorageSync("cityInfo")
    setTimeout(function () {
      wx.request({
        url: '',
        data: {
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'Cookie': cookie
        }, // 设置请求的 header
        success: function (res) {
          // success
          console.log(JSON.stringify(res))
          wx.hideLoading()
          if (res.data.statusCode == "02000000") {
            var currentLat = wx.getStorageSync("currentLocation").currentLat
            var currentLon = wx.getStorageSync("currentLocation").currentLon
            var ideaList = res.data.data.openList
            for (var i = 0, j = ideaList.length; i < j; i++) {
              if (ideaList[i].praiseOrStep == 1) {
                ideaList[i].praiseUrl = "../../images/ding2.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              } else if (ideaList[i].praiseOrStep == 2) {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai2.png"
              } else {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              }
              if (ideaList[i].ideaDate == null) {
                ideaList[i].startTime = "永久有效"
              } else {
                ideaList[i].startTime = toDate(ideaList[i].ideaDate)
              }
              ideaList[i].createTime = createDate(ideaList[i].createDate)
              if (ideaList[i].addressName == "哪儿都行") {
                ideaList[i].distance = "哪儿都行"
              } else {
                var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaList[i].latitude, ideaList[i].longitude))
                if (distanceValue > 1000) {
                  distanceValue = distanceValue / 1000
                  distanceValue = distanceValue.toFixed(2)
                  ideaList[i].distance = distanceValue + "km"
                } else {
                  ideaList[i].distance = distanceValue + "m"
                }
              }
              if (ideaList[i].gender == "1") {
                ideaList[i].genderCircle = "border:2px solid #2d92ff"
              } else {
                ideaList[i].genderCircle = "border:2px solid #fe3581"
              }
            }
            var lastNum = ideaList.length - 1
            var endIdeaId = ideaList[lastNum].ideaId
            that.setData({
              ideaList: ideaList,
              endIdeaId: endIdeaId
            })
          } else if (res.data.statusCode == "02020007") {
            wx.reLaunch({
              url: '/pages/restart',
            })
          }

        },
        fail: function (res) {
          // fail
          wx.hideLoading()
        },
        complete: function (res) {
          // complete
        }
      })
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/messageRecord/monitor',
        data: {
          employeeId: that.data.id
        },
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Cookie': cookie
        },
        success: function (res) {
          console.log(JSON.stringify(res))
          if (res.data.statusCode == "02000000") {
            if (res.data.data == "") {
              that.setData({
                remainControl: false
              })
            } else {
              that.setData({
                remainControl: true
              })
            }
            wx.hideLoading()
          }
        },
        fail: function (res) {

        },
        complete: function (res) {

        }
      })
    }, 1000)
  },
  praise: function (e) {
    var that = this
    var ideaId = e.currentTarget.dataset.ideaid
    var index = e.currentTarget.dataset.index
    var ideaList = this.data.ideaList
    var praiseOrStep = ideaList[index].praiseOrStep
    switch (praiseOrStep) {
      case 1:
        wx.showToast({
          title: '已点赞',
        })
        break
      case 2:
        wx.showToast({
          title: '已踩',
        })
        break
      default:
        wx.request({
          url: 'https://upload.duodework.cn/client-web-front/comment/save',
          data: {
            ideaId: ideaId,
            commentResult: 1,
            commentator: this.data.name,
            commentatorId: this.data.id
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          },
          success: function (res) {
            console.log(JSON.stringify(res))
            ideaList[index].praiseUrl = "../../images/ding2.png"
            ideaList[index].praiseNum = ideaList[index].praiseNum + 1
            ideaList[index].praiseOrStep = 1
            that.setData({
              ideaList: ideaList
            })
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
    }
  },
  trample: function (e) {
    var that = this
    var ideaId = e.currentTarget.dataset.ideaId
    var index = e.currentTarget.dataset.index
    var ideaList = this.data.ideaList
    var praiseOrStep = ideaList[index].praiseOrStep
    switch (praiseOrStep) {
      case 1:
        wx.showToast({
          title: '已点赞',
        })
        break
      case 2:
        wx.showToast({
          title: '已踩',
        })
        break
      default:
        wx.request({
          url: 'https://upload.duodework.cn/client-web-front/comment/save',
          data: {
            ideaId: ideaId,
            commentResult: 2,
            commentator: this.data.name,
            commentatorId: this.data.id
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          },
          success: function (res) {
            console.log(JSON.stringify(res))
            ideaList[index].caiUrl = "../../images/cai2.png"
            ideaList[index].stepNum = ideaList[index].stepNum + 1
            ideaList[index].praiseOrStep = 2
            that.setData({
              ideaList: ideaList
            })
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
    }
  },
  loadMore: function () {
    var that = this
    if (that.data.showMoreSwitch) {
    } else {
      that.setData({
        showMoreSwitch: true
      })
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        if (that.data.cityControl == true) {
          wx.request({
            url: 'https://upload.duodework.cn/client-web-front/idea/showBelongCity',
            data: {
              employeeId: that.data.id,
              city: that.data.cityCode,
              endIdeaId: that.data.endIdeaId
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/json',
              'Cookie': that.data.cookie
            }, // 设置请求的 header
            success: function (res) {
              // success
              wx.hideLoading()
              if (res.data.statusCode == "02000000" && res.data.data != "") {
                var currentLat = wx.getStorageSync("currentLocation").currentLat
                var currentLon = wx.getStorageSync("currentLocation").currentLon
                console.log(JSON.stringify(res))
                var ideaListNew = res.data.data.openList
                var ideaList = that.data.ideaList
                for (var i = 0, j = ideaListNew.length; i < j; i++) {
                  if (ideaListNew[i].praiseOrStep == 1) {
                    ideaListNew[i].praiseUrl = "../../images/ding2.png"
                    ideaListNew[i].caiUrl = "../../images/cai1.png"
                  } else if (ideaListNew[i].praiseOrStep == 2) {
                    ideaListNew[i].praiseUrl = "../../images/ding1.png"
                    ideaListNew[i].caiUrl = "../../images/cai2.png"
                  } else {
                    ideaListNew[i].praiseUrl = "../../images/ding1.png"
                    ideaListNew[i].caiUrl = "../../images/cai1.png"
                  }
                  if (ideaListNew[i].ideaDate == null) {
                    ideaListNew[i].startTime = "永久有效"
                  } else {
                    ideaListNew[i].startTime = toDate(ideaListNew[i].ideaDate)
                  }
                  ideaListNew[i].createTime = createDate(ideaListNew[i].createDate)
                  if (ideaListNew[i].addressName == "哪儿都行") {
                    ideaListNew[i].distance = "哪儿都行"
                  } else {
                    var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaListNew[i].latitude, ideaListNew[i].longitude))
                    if (distanceValue > 1000) {
                      distanceValue = distanceValue / 1000
                      distanceValue = distanceValue.toFixed(2)
                      ideaListNew[i].distance = distanceValue + "km"
                    } else {
                      ideaListNew[i].distance = distanceValue + "m"
                    }
                  }
                  if (ideaListNew[i].gender == "1") {
                    ideaListNew[i].genderCircle = "border:2px solid #2d92ff"
                  } else {
                    ideaListNew[i].genderCircle = "border:2px solid #fe3581"
                  }
                  ideaList.push(ideaListNew[i])
                }
                var lastNum = ideaList.length - 1
                var endIdeaId = ideaList[lastNum].ideaId
                that.setData({
                  ideaList: ideaList,
                  endIdeaId: endIdeaId,
                  showMoreSwitch: false
                })
              }
            },
            fail: function (res) {
              // fail
              wx.hideLoading()
            },
            complete: function (res) {
              // complete

            }
          })
        } else if (that.data.colleageControl == true) {
          wx.request({
            url: 'https://upload.duodework.cn/client-web-front/idea/showBelongCollege',
            data: {
              employeeId: that.data.id,
              collegeId: that.data.collegeId,
              endIdeaId: that.data.endIdeaId
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/json',
              'Cookie': that.data.cookie
            }, // 设置请求的 header
            success: function (res) {
              // success
              wx.hideLoading()
              if (res.data.statusCode == "02000000" && res.data.data != "") {
                var currentLat = wx.getStorageSync("currentLocation").currentLat
                var currentLon = wx.getStorageSync("currentLocation").currentLon
                console.log(JSON.stringify(res))
                var ideaListNew = res.data.data.openList
                var ideaList = that.data.ideaList
                for (var i = 0, j = ideaListNew.length; i < j; i++) {
                  if (ideaListNew[i].praiseOrStep == 1) {
                    ideaListNew[i].praiseUrl = "../../images/ding2.png"
                    ideaListNew[i].caiUrl = "../../images/cai1.png"
                  } else if (ideaListNew[i].praiseOrStep == 2) {
                    ideaListNew[i].praiseUrl = "../../images/ding1.png"
                    ideaListNew[i].caiUrl = "../../images/cai2.png"
                  } else {
                    ideaListNew[i].praiseUrl = "../../images/ding1.png"
                    ideaListNew[i].caiUrl = "../../images/cai1.png"
                  }
                  if (ideaListNew[i].ideaDate == null) {
                    ideaListNew[i].startTime = "永久有效"
                  } else {
                    ideaListNew[i].startTime = toDate(ideaListNew[i].ideaDate)
                  }
                  ideaListNew[i].createTime = createDate(ideaListNew[i].createDate)
                  if (ideaListNew[i].addressName == "哪儿都行") {
                    ideaListNew[i].distance = "哪儿都行"
                  } else {
                    var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaListNew[i].latitude, ideaListNew[i].longitude))
                    if (distanceValue > 1000) {
                      distanceValue = distanceValue / 1000
                      distanceValue = distanceValue.toFixed(2)
                      ideaListNew[i].distance = distanceValue + "km"
                    } else {
                      ideaListNew[i].distance = distanceValue + "m"
                    }
                  }
                  if (ideaListNew[i].gender == "1") {
                    ideaListNew[i].genderCircle = "border:2px solid #2d92ff"
                  } else {
                    ideaListNew[i].genderCircle = "border:2px solid #fe3581"
                  }
                  ideaList.push(ideaListNew[i])
                }
                var lastNum = ideaList.length - 1
                var endIdeaId = ideaList[lastNum].ideaId

                that.setData({
                  ideaList: ideaList,
                  endIdeaId: endIdeaId,
                  showMoreSwitch: false
                })

              }

            },
            fail: function (res) {
              // fail
              wx.hideLoading()
            },
            complete: function (res) {
              // complete
            }
          })
        }
      }, 1000)
    }

  },
  onReachBottom: function () {

  },
  sendMessage: function (e) {
    var targetId = e.currentTarget.dataset.target
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../message/messageInfo?targetId=' + targetId + '&status=' + status + '',
    })
  },
  moveToSearch: function () {
    wx.navigateTo({
      url: '../search/searchResult',
    })
  },
  selectedPic: function (e) {
    var idx = e.currentTarget.dataset.index
    var picIdx = e.currentTarget.dataset.pic
    var ideaList = this.data.ideaList
    var picList = ideaList[idx].showAnnexLibraryElemList
    var pics = new Array()
    for (var i = 0, j = picList.length; i < j; i++) {
      pics.push(picList[i].annexUrl)
    }
    var currentPic = picList[picIdx].annexUrl
    console.log(picList)
    wx.previewImage({
      current: currentPic,
      urls: pics
    })
  },
  openCamera: function () {
    wx.chooseVideo({

    })
  },
  moveToPersonInfo: function (e) {
    var personId = e.currentTarget.dataset.id
    if (personId == this.data.id) {
      wx.switchTab({
        url: '/pages/information/myInfo',
      })
    } else {
      wx.navigateTo({
        url: '/pages/information/personInfo/personInfo?personId=' + personId,
      })
    }
  },
  moveToDetail: function (e) {
    var ideaId = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/index/showTeamDetail?ideaId=' + ideaId + '&index=' + index,
    })
  },
  editButton: function (event) {
    wx.navigateTo({
      url: 'createIdea',
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
  colleageButton: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    this.setData({
      selectedColleage: "active",
      selectedCity: "",
      selectedMap: "",
      colleageControl: true,
      cityControl: false,
      mapControl: false,
      endIdeaId: "",
      ideaList: []
    })
    var userInfo = wx.getStorageSync("userInfo")
    var cookie = wx.getStorageSync("cookie")
    if (userInfo.collegeId == null) {
      wx.showModal({
        title: '提醒',
        content: '您尚未设置学校，是否前往设置？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/information/information',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      that.setData({
        nothingControl: true,
        nothingContent: "你还没有设置学校，请先去个人资料页面设置",
        ideaList: []
      })
    } else {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/idea/showBelongCollege',
        data: {
          employeeId: userInfo.id,
          collegeId: userInfo.collegeId
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'Cookie': cookie
        }, // 设置请求的 header
        success: function (res) {
          // success
          var currentLat = wx.getStorageSync("currentLocation").currentLat
          var currentLon = wx.getStorageSync("currentLocation").currentLon
          console.log(JSON.stringify(res))
          if (res.data.data == null || res.data.data.openList == "") {
            that.setData({
              nothingControl: true,
              nothingContent: "你的学校还没有活动，成为第一个活动创建者吧"
            })
          } else {
            var ideaList = res.data.data.openList
            for (var i = 0, j = ideaList.length; i < j; i++) {
              if (ideaList[i].praiseOrStep == 1) {
                ideaList[i].praiseUrl = "../../images/ding2.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              } else if (ideaList[i].praiseOrStep == 2) {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai2.png"
              } else {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              }
              if (ideaList[i].ideaDate == null) {
                ideaList[i].startTime = "永久有效"
              } else {
                ideaList[i].startTime = toDate(ideaList[i].ideaDate)
              }
              ideaList[i].createTime = createDate(ideaList[i].createDate)
              if (ideaList[i].addressName == "哪儿都行") {
                ideaList[i].distance = "哪儿都行"
              } else {
                var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaList[i].latitude, ideaList[i].longitude))
                if (distanceValue > 1000) {
                  distanceValue = distanceValue / 1000
                  distanceValue = distanceValue.toFixed(2)
                  ideaList[i].distance = distanceValue + "km"
                } else {
                  ideaList[i].distance = distanceValue + "m"
                }
              }
              if (ideaList[i].gender == "1") {
                ideaList[i].genderCircle = "border:2px solid #2d92ff"
              } else {
                ideaList[i].genderCircle = "border:2px solid #fe3581"
              }
            }
            var lastNum = ideaList.length - 1
            var endIdeaId = ideaList[lastNum].ideaId
            that.setData({
              ideaList: ideaList,
              endIdeaId: endIdeaId,
              nothingControl: false,
            })

          }
          wx.hideLoading()
        },
        fail: function (res) {
          // fail
          wx.hideLoading()
        },
        complete: function (res) {
          // complete
        }
      })
    }

  },
  cityButton: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    this.setData({
      selectedColleage: "",
      selectedCity: "active",
      selectedMap: "",
      colleageControl: false,
      cityControl: true,
      mapControl: false,
      nothingControl: false,
      ideaList: []
    })
    wx.getSetting({
      success(res) {
        console.log("setting:" + JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] == false) {
          wx.showModal({
            title: '提醒',
            content: '打开城市圈需要位置授权，是否前往',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: (res) => {
                    console.log(JSON.stringify(res))
                    /*
                     * res.authSetting = {
                     *   "scope.userInfo": true,
                     *   "scope.userLocation": true
                     * }
                     */
                    if (res.authSetting['scope.userLocation']) {
                      wx.reLaunch({
                        url: '/pages/restart',
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }

          })

        }
      }
    })
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/idea/showBelongCity',
      data: {
        employeeId: that.data.id,
        city: that.data.cityCode
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      }, // 设置请求的 header
      success: function (res) {
        // success
        var currentLat = wx.getStorageSync("currentLocation").currentLat
        var currentLon = wx.getStorageSync("currentLocation").currentLon
        console.log(JSON.stringify(res))
        var ideaList = res.data.data.openList
        for (var i = 0, j = ideaList.length; i < j; i++) {
          if (ideaList[i].praiseOrStep == 1) {
            ideaList[i].praiseUrl = "../../images/ding2.png"
            ideaList[i].caiUrl = "../../images/cai1.png"
          } else if (ideaList[i].praiseOrStep == 2) {
            ideaList[i].praiseUrl = "../../images/ding1.png"
            ideaList[i].caiUrl = "../../images/cai2.png"
          } else {
            ideaList[i].praiseUrl = "../../images/ding1.png"
            ideaList[i].caiUrl = "../../images/cai1.png"
          }
          if (ideaList[i].ideaDate == null) {
            ideaList[i].startTime = "永久有效"
          } else {
            ideaList[i].startTime = toDate(ideaList[i].ideaDate)
          }
          ideaList[i].createTime = createDate(ideaList[i].createDate)
          if (ideaList[i].addressName == "哪儿都行") {
            ideaList[i].distance = "哪儿都行"
          } else {
            var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaList[i].latitude, ideaList[i].longitude))
            if (distanceValue > 1000) {
              distanceValue = distanceValue / 1000
              distanceValue = distanceValue.toFixed(2)
              ideaList[i].distance = distanceValue + "km"
            } else {
              ideaList[i].distance = distanceValue + "m"
            }
          }
          if (ideaList[i].gender == "1") {
            ideaList[i].genderCircle = "border:2px solid #2d92ff"
          } else {
            ideaList[i].genderCircle = "border:2px solid #fe3581"
          }
        }
        var lastNum = ideaList.length - 1
        var endIdeaId = ideaList[lastNum].ideaId
        that.setData({
          ideaList: ideaList,
          endIdeaId: endIdeaId
        })
        wx.hideLoading()
      },
      fail: function (res) {
        // fail
        wx.hideLoading()
      },
      complete: function (res) {
        // complete
      }
    })

  },
  mapButton: function () {
    this.setData({
      selectedColleage: "",
      selectedCity: "",
      selectedMap: "active",
      colleageControl: false,
      cityControl: false,
      mapControl: true,
      ideaList: [],
      endIdeaId: ""
    })
    var that = this
    wx.getSetting({
      success(res) {
        console.log("setting:" + JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] == false) {
          wx.showModal({
            title: '提醒',
            content: '打开城市圈需要位置授权，是否前往',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: (res) => {
                    console.log(JSON.stringify(res))
                    /*
                     * res.authSetting = {
                     *   "scope.userInfo": true,
                     *   "scope.userLocation": true
                     * }
                     */
                    if (res.authSetting['scope.userLocation']) {
                      wx.reLaunch({
                        url: '/pages/restart',
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }

          })

        }
      }
    })
    wx.getLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        console.log(res.latitude)
        console.log(res.longitude)
        wx.request({
          url: 'https://upload.duodework.cn/client-web-front/idea/showNearby',
          data: {
            employeeId: that.data.id,
            latitude: res.latitude,
            longitude: res.longitude
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          }, // 设置请求的 header
          success: function (res) {
            console.log(JSON.stringify(res))
            if (res.data.statusCode == "02000000") {
              var ideaList = res.data.data
              var marks = []
              for (var i = 0, j = ideaList.length; i < j; i++) {
                if (ideaList[i].gender == "1") {
                  var mark = {
                    iconPath: "/images/dingweinan.png",
                    id: ideaList[i].ideaId,
                    latitude: ideaList[i].latitude,
                    longitude: ideaList[i].longitude,
                    width: 34,
                    height: 46
                  }
                  marks.push(mark)
                } else if (ideaList[i].gender == "2") {
                  var mark = {
                    iconPath: "/images/dingweinv.png",
                    id: ideaList[i].ideaId,
                    latitude: ideaList[i].latitude,
                    longitude: ideaList[i].longitude,
                    width: 34,
                    height: 46
                  }
                  marks.push(mark)
                } else {
                  var mark = {
                    iconPath: "/images/dingweinan.png",
                    id: ideaList[i].ideaId,
                    latitude: ideaList[i].latitude,
                    longitude: ideaList[i].longitude,
                    width: 34,
                    height: 46
                  }
                  marks.push(mark)
                }
              }
              that.setData({
                mapIdeaList: ideaList,
                markers: marks
              })
            } else if (res.data.statusCode == "02020007") {
              wx.reLaunch({
                url: '../team',
              })
            }
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
      },
    })
  },
  //移动地图获得坐标
  regionchange: function (e) {
    var that = this
    if (e.type == "end") {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          console.log(res.longitude)
          console.log(res.latitude)
          wx.request({
            url: 'https://upload.duodework.cn/client-web-front/idea/showNearby',
            data: {
              employeeId: that.data.id,
              latitude: res.latitude,
              longitude: res.longitude
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/json',
              'Cookie': that.data.cookie
            }, // 设置请求的 header
            success: function (res) {
              console.log(JSON.stringify(res))
              if (res.data.statusCode == "02000000") {
                var ideaList = res.data.data
                var marks = []
                for (var i = 0, j = ideaList.length; i < j; i++) {
                  if (ideaList[i].gender == "1") {
                    var mark = {
                      iconPath: "../../../images/dingweinan.png",
                      id: ideaList[i].ideaId,
                      latitude: ideaList[i].latitude,
                      longitude: ideaList[i].longitude,
                      width: 34,
                      height: 46
                    }
                    marks.push(mark)
                  } else if (ideaList[i].gender == "2") {
                    var mark = {
                      iconPath: "../../../images/dingweinv.png",
                      id: ideaList[i].ideaId,
                      latitude: ideaList[i].latitude,
                      longitude: ideaList[i].longitude,
                      width: 34,
                      height: 46
                    }
                    marks.push(mark)
                  } else {
                    var mark = {
                      iconPath: "../../../images/dingweinan.png",
                      id: ideaList[i].ideaId,
                      latitude: ideaList[i].latitude,
                      longitude: ideaList[i].longitude,
                      width: 34,
                      height: 46
                    }
                    marks.push(mark)
                  }

                }
                that.setData({
                  mapIdeaList: ideaList,
                  markers: marks
                })
              } else if (res.data.statusCode == "02020007") {
                wx.reLaunch({
                  url: 'team',
                })
              }
            },
            fail: function (res) {

            },
            complete: function (res) {

            }
          })

        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  //点击标记位
  markertap: function (e) {
    var markerId = e.markerId
    console.log(markerId)
    wx.navigateTo({
      url: '/pages/index/showTeamDetail?ideaId=' + markerId
    })

  },
  //查看详细位置
  openAddress: function (e) {
    var lat = e.currentTarget.dataset.lat
    var lon = e.currentTarget.dataset.lon
    var index = e.currentTarget.dataset.idx
    var address = e.currentTarget.dataset.address
    console.log(address)
    wx.openLocation({
      latitude: lat,
      longitude: lon,
      address: address
    })
  },
  openRemain: function () {
    wx.navigateTo({
      url: '../message/remainMessageList',
    })
    this.setData({
      remainControl: false
    })
  },
  closeVideo: function () {
    this.setData({
      videoControl: false
    })
  },
  playVideo: function (e) {
    var path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: '/pages/playVideo?path=' + encodeURIComponent(path),
    })
  },
  refreshButton: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.cityControl == true) {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/idea/showBelongCity',
        data: {
          employeeId: that.data.id,
          city: that.data.cityCode
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        }, // 设置请求的 header
        success: function (res) {
          // success
          wx.hideLoading()
          if (res.data.statusCode == "02000000") {
            var currentLat = wx.getStorageSync("currentLocation").currentLat
            var currentLon = wx.getStorageSync("currentLocation").currentLon
            console.log(JSON.stringify(res))
            var ideaList = res.data.data.openList
            for (var i = 0, j = ideaList.length; i < j; i++) {
              if (ideaList[i].praiseOrStep == 1) {
                ideaList[i].praiseUrl = "../../images/ding2.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              } else if (ideaList[i].praiseOrStep == 2) {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai2.png"
              } else {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              }
              if (ideaList[i].ideaDate == null) {
                ideaList[i].startTime = "永久有效"
              } else {
                ideaList[i].startTime = toDate(ideaList[i].ideaDate)
              }
              ideaList[i].createTime = createDate(ideaList[i].createDate)
              if (ideaList[i].addressName == "哪儿都行") {
                ideaList[i].distance = "哪儿都行"
              } else {
                var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaList[i].latitude, ideaList[i].longitude))
                if (distanceValue > 1000) {
                  distanceValue = distanceValue / 1000
                  distanceValue = distanceValue.toFixed(2)
                  ideaList[i].distance = distanceValue + "km"
                } else {
                  ideaList[i].distance = distanceValue + "m"
                }
              }
              if (ideaList[i].gender == "1") {
                ideaList[i].genderCircle = "border:2px solid #2d92ff"
              } else {
                ideaList[i].genderCircle = "border:2px solid #fe3581"
              }
            }
            var lastNum = ideaList.length - 1
            var endIdeaId = ideaList[lastNum].ideaId
            that.setData({
              ideaList: ideaList,
              endIdeaId: endIdeaId,
              toTop: 0
            })
          } else if (res.data.statusCode == "02020007") {
            wx.reLaunch({
              url: '/pages/restart',
            })
          }
        },
        fail: function (res) {
          // fail
          wx.hideLoading()
        },
        complete: function (res) {
          // complete
        }
      })
    } else if (that.data.colleageControl == true) {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/idea/showBelongCollege',
        data: {
          employeeId: that.data.id,
          collegeId: that.data.collegeId
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        }, // 设置请求的 header
        success: function (res) {
          // success
          wx.hideLoading()
          var currentLat = wx.getStorageSync("currentLocation").currentLat
          var currentLon = wx.getStorageSync("currentLocation").currentLon
          console.log(JSON.stringify(res))
          if (res.data.data == null || res.data.data.openList == "") {
            that.setData({
              nothingControl: true,
              nothingContent: "你的学校还没有活动，成为第一个活动创建者吧"
            })
          } else {
            var ideaList = res.data.data.openList
            for (var i = 0, j = ideaList.length; i < j; i++) {
              if (ideaList[i].praiseOrStep == 1) {
                ideaList[i].praiseUrl = "../../images/ding2.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              } else if (ideaList[i].praiseOrStep == 2) {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai2.png"
              } else {
                ideaList[i].praiseUrl = "../../images/ding1.png"
                ideaList[i].caiUrl = "../../images/cai1.png"
              }
              if (ideaList[i].ideaDate == null) {
                ideaList[i].startTime = "永久有效"
              } else {
                ideaList[i].startTime = toDate(ideaList[i].ideaDate)
              }
              ideaList[i].createTime = createDate(ideaList[i].createDate)
              if (ideaList[i].addressName == "哪儿都行") {
                ideaList[i].distance = "哪儿都行"
              } else {
                var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, ideaList[i].latitude, ideaList[i].longitude))
                if (distanceValue > 1000) {
                  distanceValue = distanceValue / 1000
                  distanceValue = distanceValue.toFixed(2)
                  ideaList[i].distance = distanceValue + "km"
                } else {
                  ideaList[i].distance = distanceValue + "m"
                }
              }
              if (ideaList[i].gender == "1") {
                ideaList[i].genderCircle = "border:2px solid #2d92ff"
              } else {
                ideaList[i].genderCircle = "border:2px solid #fe3581"
              }
            }
            var lastNum = ideaList.length - 1
            var endIdeaId = ideaList[lastNum].ideaId
            that.setData({
              ideaList: ideaList,
              endIdeaId: endIdeaId,
              nothingControl: false,
              toTop: 0
            })
          }

        },
        fail: function (res) {
          // fail
          wx.hideLoading()
        },
        complete: function (res) {
          // complete
        }
      })
    }
  },
  moveToTeam: function () {
    wx.navigateTo({
      url: '/pages/group/merchant',
    })
  },
  getInfo: function (e) {
    var ideaId = e.currentTarget.dataset.id
    var isBusinessCertification = e.currentTarget.dataset.status
    var name = e.currentTarget.dataset.name
    this.setData({
      ideaId: ideaId,
      isBusinessCertification: isBusinessCertification,
      ideaName: name
    })
  },
  moveToPromotion: function (e) {
    var promotionId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/group/promotionDetail?promotionId=' + promotionId,
    })
  }
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
//创建时间
function createDate(number) {
  var n = number;
  var date = new Date(n);
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var Min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (M + '-' + D + " " + H + ":" + Min)
}

//通过经纬度计算距离
var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}

/**
 * caculate the great circle distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = getRad(lat1);
  var radLat2 = getRad(lat2);

  var a = radLat1 - radLat2;
  var b = getRad(lng1) - getRad(lng2);

  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000.0;

  return s;
}