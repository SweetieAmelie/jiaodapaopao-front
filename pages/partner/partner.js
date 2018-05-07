Page({
  data: {
    id: "",
    name: "",
    partnerList: "",
    displayControl: "hide",
    labelList: "",
    selections: [],
    filter: "",
    endEmployeeId: "",
    moreEmployeeSwitch: false,
    selectedAll: "active",
    selectedCity: "",
    selectedColleage: "",
    allControl: true,
    cityControl: false,
    colleageControl: false,
    showMoreSwitch: false,
  },
  onLoad: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    var cookie = wx.getStorageSync("cookie")
    that.setData({
      cookie: cookie,
      id: userInfo.id,
      name: userInfo.nickName,
      collegeId: userInfo.collegeId,
      cityCode: cityInfo.cityCode
    })
    wx.setNavigationBarTitle({
      title: '校园生活',
    })
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/messageRecord/monitor',
      data: {
        employeeId: that.data.id
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.statusCode == "02000000") {

        } else if (res.data.statusCode == "02020007") {
          wx.reLaunch({
            url: '/pages/restart',
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this
    console.log(JSON.stringify(res))
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.name + ' 分享的心情',
      path: '/pages/partner/showPartnerDetail?selectedId=' + res.target.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReady: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: '',
      data: {
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        wx.hideLoading()
      },
      fail: function (res) {
        //失败
        wx.hideLoading()
      },
      complete: function (res) {
        //完成
      }
    })
  },
  onShow: function () {
  },
  editButton: function (e) {
    wx.navigateTo({
      url: 'ability',
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
  displaySelections: function () {
    var that = this
    this.setData({
      displayControl: "",
      filter: "filter"
    })
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/label/show',
      data: {
        id: "010000"
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.statusCode == "02000000") {
          that.setData({
            labelList: res.data.data
          })
        } else if (res.data.statusCode == "02020007") {
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
  selected: function (e) {
    var that = this
    var selectedId = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.index
    if (e.currentTarget.dataset.disabled == "1") {
      var list = that.data.labelList
      list[idx].action = ""
      list[idx].selected = "0"
      that.setData({
        labelList: list
      })
      var selections = that.data.selections
      var deletedIndex = 0
      for (var i = 0, j = selections.length; i < j; i++) {
        if (selections[i].id == selectedId) {
          deletedIndex = i
        }
      }
      selections.splice(deletedIndex, 1)
      that.setData({
        selections: selections
      })
    } else {
      var list = that.data.labelList
      list[idx].action = "action"
      list[idx].selected = "1"
      that.setData({
        labelList: list
      })
      var selections = that.data.selections
      var index = selections.length;
      selections[index] = {
        id: selectedId
      }
      that.setData({
        selections: selections
      })
    }
  },
  closeAction: function () {
    this.setData({
      displayControl: "hide",
      filter: ""
    })
  },
  praise: function (e) {
    var that = this
    var ideaId = e.currentTarget.dataset.idea
    var index = e.currentTarget.dataset.index
    var partnerList = this.data.partnerList
    var praiseOrStep = partnerList[index].praiseOrStep
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
          url: 'https://upload.duodework.cn/client-web-front/personComment/save',
          data: {
            personId: ideaId,
            personCommentResult: 1,
            personCommentator: this.data.name,
            personCommentatorId: this.data.id
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          },
          success: function (res) {
            console.log(JSON.stringify(res))
            if (res.data.statusCode == "02000000") {
              partnerList[index].praiseUrl = "/images/ding2.png"
              partnerList[index].praiseNum = partnerList[index].praiseNum + 1
              partnerList[index].praiseOrStep = 1
              that.setData({
                partnerList: partnerList
              })
            } else if (res.data.statusCode == "02020007") {
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
    }
  },
  trample: function (e) {
    var that = this
    var ideaId = e.currentTarget.dataset.idea
    var index = e.currentTarget.dataset.index
    var partnerList = this.data.partnerList
    var praiseOrStep = partnerList[index].praiseOrStep
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
          url: 'https://upload.duodework.cn/client-web-front/personComment/save',
          data: {
            personId: ideaId,
            personCommentResult: 2,
            personCommentator: this.data.name,
            personCommentatorId: this.data.id
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          },
          success: function (res) {
            console.log(JSON.stringify(res))
            if (res.data.statusCode == "02000000") {
              partnerList[index].caiUrl = "/images/cai2.png"
              partnerList[index].stepNum = partnerList[index].stepNum + 1
              partnerList[index].praiseOrStep = 2
              that.setData({
                partnerList: partnerList
              })
            } else if (res.data.statusCode == "02020007") {
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
    }
  },
  sendMessage: function (e) {
    var targetId = e.currentTarget.dataset.target
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../message/messageInfo?targetId=' + targetId + '&status=' + status,
    })
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
        if (that.data.allControl == true) {
          wx.request({
            url: 'https://upload.duodework.cn/client-web-front/main/showAllPersonForward',
            data: {
              pageCurrentPage: that.data.currentPage
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
              'Cookie': that.data.cookie
            },
            success: function (res) {
              console.log(JSON.stringify(res))
              wx.hideLoading()
              if (res.data.statusCode == "02000000" && res.data.data != "") {
                var partnerList = res.data.data.showPersonResponseList
                for (var i = 0, j = partnerList.length; i < j; i++) {
                  if (partnerList[i].praiseOrStep == 1) {
                    partnerList[i].praiseUrl = "/images/ding2.png"
                    partnerList[i].caiUrl = "/images/cai1.png"
                  } else if (partnerList[i].praiseOrStep == 2) {
                    partnerList[i].praiseUrl = "/images/ding1.png"
                    partnerList[i].caiUrl = "/images/cai2.png"
                  } else {
                    partnerList[i].praiseUrl = "/images/ding1.png"
                    partnerList[i].caiUrl = "/images/cai1.png"
                  }
                  if (partnerList[i].gender == "1") {
                    partnerList[i].genderCircle = "border:2px solid #2d92ff"
                  } else {
                    partnerList[i].genderCircle = "border:2px solid #fe3581"
                  }
                  partnerList[i].createTime = createDate(partnerList[i].createDate)
                }
                var lastNum = partnerList.length - 1
                var newPartnerList = that.data.partnerList
                for (var i = 0, j = partnerList.length; i < j; i++) {
                  newPartnerList.push(partnerList[i])
                }
                that.setData({
                  partnerList: newPartnerList,
                  currentPage: res.data.data.currentPage,
                  showMoreSwitch: false
                })
              } else if (res.data.statusCode == "02020007") {
                wx.reLaunch({
                  url: '../index/team',
                })
              }
            },
            fail: function (res) {
              //失败
              wx.hideLoading()
            },
            complete: function (res) {
              //完成
            }
          })
        } else if (that.data.cityControl == true) {
          wx.request({
            url: 'https://upload.duodework.cn/client-web-front/person/showBelongCityForwarding',
            data: {
              employeeId: that.data.id,
              city: that.data.cityCode,
              pageCurrentPage: that.data.currentPage
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
              'Cookie': that.data.cookie
            },
            success: function (res) {
              console.log(JSON.stringify(res))
              wx.hideLoading()
              if (res.data.statusCode == "02000000" && res.data.data != "") {
                var partnerList = res.data.data.showPersonResponseList
                for (var i = 0, j = partnerList.length; i < j; i++) {
                  if (partnerList[i].praiseOrStep == 1) {
                    partnerList[i].praiseUrl = "/images/ding2.png"
                    partnerList[i].caiUrl = "/images/cai1.png"
                  } else if (partnerList[i].praiseOrStep == 2) {
                    partnerList[i].praiseUrl = "/images/ding1.png"
                    partnerList[i].caiUrl = "/images/cai2.png"
                  } else {
                    partnerList[i].praiseUrl = "/images/ding1.png"
                    partnerList[i].caiUrl = "/images/cai1.png"
                  }
                  if (partnerList[i].gender == "1") {
                    partnerList[i].genderCircle = "border:2px solid #2d92ff"
                  } else {
                    partnerList[i].genderCircle = "border:2px solid #fe3581"
                  }
                  partnerList[i].createTime = createDate(partnerList[i].createDate)
                }
                var lastNum = partnerList.length - 1
                var newPartnerList = that.data.partnerList
                for (var i = 0, j = partnerList.length; i < j; i++) {
                  newPartnerList.push(partnerList[i])
                }
                that.setData({
                  partnerList: newPartnerList,
                  currentPage: res.data.data.currentPage,
                  showMoreSwitch: false
                })
              } else if (res.data.statusCode == "02020007") {
                wx.reLaunch({
                  url: '../index/team',
                })
              }
            },
            fail: function (res) {
              //失败
              wx.hideLoading()
            },
            complete: function (res) {
              //完成
            }
          })
        } else if (that.data.colleageControl == true) {
          wx.request({
            url: 'https://upload.duodework.cn/client-web-front/person/showBelongCollegeForwarding',
            data: {
              employeeId: that.data.id,
              collegeId: that.data.collegeId,
              pageCurrentPage: that.data.currentPage
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
              'Cookie': that.data.cookie
            },
            success: function (res) {
              console.log(JSON.stringify(res))
              wx.hideLoading()
              if (res.data.statusCode == "02000000") {
                var partnerList = res.data.data.showPersonResponseList
                for (var i = 0, j = partnerList.length; i < j; i++) {
                  if (partnerList[i].praiseOrStep == 1) {
                    partnerList[i].praiseUrl = "/images/ding2.png"
                    partnerList[i].caiUrl = "/images/cai1.png"
                  } else if (partnerList[i].praiseOrStep == 2) {
                    partnerList[i].praiseUrl = "/images/ding1.png"
                    partnerList[i].caiUrl = "/images/cai2.png"
                  } else {
                    partnerList[i].praiseUrl = "/images/ding1.png"
                    partnerList[i].caiUrl = "/images/cai1.png"
                  }
                  if (partnerList[i].gender == "1") {
                    partnerList[i].genderCircle = "border:2px solid #2d92ff"
                  } else {
                    partnerList[i].genderCircle = "border:2px solid #fe3581"
                  }
                  partnerList[i].createTime = createDate(partnerList[i].createDate)
                }
                var lastNum = partnerList.length - 1
                var newPartnerList = that.data.partnerList
                for (var i = 0, j = partnerList.length; i < j; i++) {
                  newPartnerList.push(partnerList[i])
                }
                that.setData({
                  partnerList: newPartnerList,
                  currentPage: res.data.data.currentPage,
                  showMoreSwitch: false
                })

              } else if (res.data.statusCode == "02020007") {
                wx.reLaunch({
                  url: '/pages/restart',
                })
              }
            },
            fail: function (res) {
              //失败
              wx.hideLoading()
            },
            complete: function (res) {
              //完成
            }
          })
        }
      }, 500)

    }
  },
  onReachBottom: function () {

  },
  moveToSearch: function () {
    wx.navigateTo({
      url: '../search/searchResult',
    })
  },
  selectedPic: function (e) {
    var idx = e.currentTarget.dataset.index
    var picIdx = e.currentTarget.dataset.pic
    var partnerList = this.data.partnerList
    var picList = partnerList[idx].showAnnexLibraryElemList
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
  moveToPersonDetail: function (e) {
    var selectedId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/partner/showPartnerDetail?selectedId=' + selectedId,
    })
  },
  moveToPerson: function (e) {
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
  allButton: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      selectedAll: "active",
      selectedCity: "",
      selectedColleage: "",
      allControl: true,
      cityControl: false,
      colleageControl: false,
      nothingControl: false,
      partnerList: []
    })
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/main/showAllPersonForward',
      data: {
        pageCurrentPage: 1
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        wx.hideLoading()
        if (res.data.statusCode == "02000000") {
          var partnerList = res.data.data.showPersonResponseList
          for (var i = 0, j = partnerList.length; i < j; i++) {
            if (partnerList[i].praiseOrStep == 1) {
              partnerList[i].praiseUrl = "/images/ding2.png"
              partnerList[i].caiUrl = "/images/cai1.png"
            } else if (partnerList[i].praiseOrStep == 2) {
              partnerList[i].praiseUrl = "/images/ding1.png"
              partnerList[i].caiUrl = "/images/cai2.png"
            } else {
              partnerList[i].praiseUrl = "/images/ding1.png"
              partnerList[i].caiUrl = "/images/cai1.png"
            }
            if (partnerList[i].gender == "1") {
              partnerList[i].genderCircle = "border:2px solid #2d92ff"
            } else {
              partnerList[i].genderCircle = "border:2px solid #fe3581"
            }
            partnerList[i].createTime = createDate(partnerList[i].createDate)
          }
          var lastNum = partnerList.length - 1
          that.setData({
            partnerList: partnerList,
            currentPage: res.data.data.currentPage,
          })

        } else if (res.data.statusCode == "02020007") {
          wx.reLaunch({
            url: '../index/team',
          })
        }
      },
      fail: function (res) {
        //失败
        wx.hideLoading()
      },
      complete: function (res) {
        //完成
      }
    })
  },
  cityButton: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      selectedAll: "",
      selectedCity: "active",
      selectedColleage: "",
      allControl: false,
      cityControl: true,
      colleageControl: false,
      nothingControl: false,
      partnerList: []
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
      url: 'https://upload.duodework.cn/client-web-front/person/showBelongCityForwarding',
      data: {
        employeeId: this.data.id,
        city: this.data.cityCode,
        pageCurrentPage: 1
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        wx.hideLoading()
        if (res.data.statusCode == "02000000") {
          var partnerList = res.data.data.showPersonResponseList
          for (var i = 0, j = partnerList.length; i < j; i++) {
            if (partnerList[i].praiseOrStep == 1) {
              partnerList[i].praiseUrl = "/images/ding2.png"
              partnerList[i].caiUrl = "/images/cai1.png"
            } else if (partnerList[i].praiseOrStep == 2) {
              partnerList[i].praiseUrl = "/images/ding1.png"
              partnerList[i].caiUrl = "/images/cai2.png"
            } else {
              partnerList[i].praiseUrl = "/images/ding1.png"
              partnerList[i].caiUrl = "/images/cai1.png"
            }
            if (partnerList[i].gender == "1") {
              partnerList[i].genderCircle = "border:2px solid #2d92ff"
            } else {
              partnerList[i].genderCircle = "border:2px solid #fe3581"
            }
            partnerList[i].createTime = createDate(partnerList[i].createDate)
          }
          var lastNum = partnerList.length - 1
          that.setData({
            partnerList: partnerList,
            currentPage: res.data.data.currentPage,
          })

        } else if (res.data.statusCode == "02020007") {
          wx.reLaunch({
            url: '../index/team',
          })
        }
      },
      fail: function (res) {
        //失败
        wx.hideLoading()
      },
      complete: function (res) {
        //完成
      }
    })
  },
  colleageButton: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      selectedAll: "",
      selectedCity: "",
      selectedColleage: "active",
      allControl: false,
      cityControl: false,
      colleageControl: true
    })
    var userInfo = wx.getStorageSync("userInfo")
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
        partnerList: []
      })
    } else {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/person/showBelongCollegeForwarding',
        data: {
          employeeId: this.data.id,
          collegeId: this.data.collegeId,
          pageCurrentPage: 1
        },
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        },
        success: function (res) {
          console.log(JSON.stringify(res))
          wx.hideLoading()
          if (res.data.data == null || res.data.data == "") {
            that.setData({
              nothingControl: true,
              nothingContent: "你的学校还没有“一个人”，成为第一个心情创建者吧",
            })
          } else {
            if (res.data.statusCode == "02000000") {
              var partnerList = res.data.data.showPersonResponseList
              for (var i = 0, j = partnerList.length; i < j; i++) {
                if (partnerList[i].praiseOrStep == 1) {
                  partnerList[i].praiseUrl = "/images/ding2.png"
                  partnerList[i].caiUrl = "/images/cai1.png"
                } else if (partnerList[i].praiseOrStep == 2) {
                  partnerList[i].praiseUrl = "/images/ding1.png"
                  partnerList[i].caiUrl = "/images/cai2.png"
                } else {
                  partnerList[i].praiseUrl = "/images/ding1.png"
                  partnerList[i].caiUrl = "/images/cai1.png"
                }
                if (partnerList[i].gender == "1") {
                  partnerList[i].genderCircle = "border:2px solid #2d92ff"
                } else {
                  partnerList[i].genderCircle = "border:2px solid #fe3581"
                }
                partnerList[i].createTime = createDate(partnerList[i].createDate)
              }
              var lastNum = partnerList.length - 1
              that.setData({
                partnerList: partnerList,
                currentPage: res.data.data.currentPage,
                nothingControl: false,
              })
            } else if (res.data.statusCode == "02020007") {
              wx.reLaunch({
                url: '../index/team',
              })
            }
          }

        },
        fail: function (res) {
          //失败
          wx.hideLoading()
        },
        complete: function (res) {
          //完成
        }
      })
    }
  },
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
    if (that.data.allControl == true) {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/main/showAllPersonForward',
        data: {
          pageCurrentPage: 1
        },
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        },
        success: function (res) {
          console.log(JSON.stringify(res))
          wx.hideLoading()
          if (res.data.statusCode == "02000000") {
            var partnerList = res.data.data.showPersonResponseList
            for (var i = 0, j = partnerList.length; i < j; i++) {
              if (partnerList[i].praiseOrStep == 1) {
                partnerList[i].praiseUrl = "/images/ding2.png"
                partnerList[i].caiUrl = "/images/cai1.png"
              } else if (partnerList[i].praiseOrStep == 2) {
                partnerList[i].praiseUrl = "/images/ding1.png"
                partnerList[i].caiUrl = "/images/cai2.png"
              } else {
                partnerList[i].praiseUrl = "/images/ding1.png"
                partnerList[i].caiUrl = "/images/cai1.png"
              }
              if (partnerList[i].gender == "1") {
                partnerList[i].genderCircle = "border:2px solid #2d92ff"
              } else {
                partnerList[i].genderCircle = "border:2px solid #fe3581"
              }
              partnerList[i].createTime = createDate(partnerList[i].createDate)
            }
            var lastNum = partnerList.length - 1
            that.setData({
              partnerList: partnerList,
              currentPage: res.data.data.currentPage,
              toTop: 0
            })

          } else if (res.data.statusCode == "02020007") {
            wx.reLaunch({
              url: '../index/team',
            })
          }
        },
        fail: function (res) {
          //失败
          wx.hideLoading()
        },
        complete: function (res) {
          //完成
          wx.stopPullDownRefresh()
        }
      })
    } else if (that.data.cityControl == true) {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/person/showBelongCityForwarding',
        data: {
          employeeId: this.data.id,
          city: this.data.cityCode,
          pageCurrentPage: 1
        },
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        },
        success: function (res) {
          console.log(JSON.stringify(res))
          wx.hideLoading()
          if (res.data.statusCode == "02000000") {
            var partnerList = res.data.data.showPersonResponseList
            for (var i = 0, j = partnerList.length; i < j; i++) {
              if (partnerList[i].praiseOrStep == 1) {
                partnerList[i].praiseUrl = "/images/ding2.png"
                partnerList[i].caiUrl = "/images/cai1.png"
              } else if (partnerList[i].praiseOrStep == 2) {
                partnerList[i].praiseUrl = "/images/ding1.png"
                partnerList[i].caiUrl = "/images/cai2.png"
              } else {
                partnerList[i].praiseUrl = "/images/ding1.png"
                partnerList[i].caiUrl = "/images/cai1.png"
              }
              if (partnerList[i].gender == "1") {
                partnerList[i].genderCircle = "border:2px solid #2d92ff"
              } else {
                partnerList[i].genderCircle = "border:2px solid #fe3581"
              }
              partnerList[i].createTime = createDate(partnerList[i].createDate)
            }
            var lastNum = partnerList.length - 1
            that.setData({
              partnerList: partnerList,
              currentPage: res.data.data.currentPage,
              toTop: 0
            })

          } else if (res.data.statusCode == "02020007") {
            wx.reLaunch({
              url: '../index/team',
            })
          }
        },
        fail: function (res) {
          wx.hideLoading()
          //失败
        },
        complete: function (res) {
          //完成
          wx.stopPullDownRefresh()
        }
      })
    } else if (that.data.colleageControl == true) {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/person/showBelongCollegeForwarding',
        data: {
          employeeId: this.data.id,
          collegeId: this.data.collegeId,
          pageCurrentPage: 1
        },
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        },
        success: function (res) {
          console.log(JSON.stringify(res))
          wx.hideLoading()
          if (res.data.data == null || res.data.data == "") {
            that.setData({
              nothingControl: true,
              nothingContent: "你的学校还没有“一个人”，成为第一个心情创建者吧",
            })
          } else {
            if (res.data.statusCode == "02000000") {
              var partnerList = res.data.data.showPersonResponseList
              for (var i = 0, j = partnerList.length; i < j; i++) {
                if (partnerList[i].praiseOrStep == 1) {
                  partnerList[i].praiseUrl = "/images/ding2.png"
                  partnerList[i].caiUrl = "/images/cai1.png"
                } else if (partnerList[i].praiseOrStep == 2) {
                  partnerList[i].praiseUrl = "/images/ding1.png"
                  partnerList[i].caiUrl = "/images/cai2.png"
                } else {
                  partnerList[i].praiseUrl = "/images/ding1.png"
                  partnerList[i].caiUrl = "/images/cai1.png"
                }
                if (partnerList[i].gender == "1") {
                  partnerList[i].genderCircle = "border:2px solid #2d92ff"
                } else {
                  partnerList[i].genderCircle = "border:2px solid #fe3581"
                }
                partnerList[i].createTime = createDate(partnerList[i].createDate)
              }
              var lastNum = partnerList.length - 1
              that.setData({
                partnerList: partnerList,
                currentPage: res.data.data.currentPage,
                nothingControl: false,
                toTop: 0
              })
            } else if (res.data.statusCode == "02020007") {
              wx.reLaunch({
                url: '../index/team',
              })
            }
          }

        },
        fail: function (res) {
          //失败
          wx.hideLoading()
        },
        complete: function (res) {
          //完成
          wx.stopPullDownRefresh()
        }
      })
    }
  },
  searchLable: function (e) {
    var searchInfo = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/search/searchResult?searchInfo=' + searchInfo,
    })
  }
})
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