// showDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    replyId: "",
    detailControl: false,
    commentValue: "",
    displayControl: '',
    lotteryNumList: [],
    modelControl: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    var cookie = wx.getStorageSync("cookie")
    console.log("userId:" + userInfo.id)
    var ideaId = options.ideaId
    that.setData({
      cookie: cookie,
      ideaId: ideaId,
      index: options.index,
      id: userInfo.id,
      name: userInfo.nickName,
      telephone: userInfo.telephone,
      college: userInfo.college,
      gender: userInfo.gender,
      avatarUrl: userInfo.avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    console.log(that.data.cookie)
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/idea/showOnlyOne',
      data: {
        id: that.data.ideaId,
        employeeId: that.data.id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        var currentLat = wx.getStorageSync("currentLocation").currentLat
        var currentLon = wx.getStorageSync("currentLocation").currentLon
        if (res.data.statusCode == "02000000") {
          var idea = res.data.data
          if (idea.praiseOrStep == 1) {
            idea.praiseUrl = "../../images/ding2.png"
            idea.caiUrl = "../../images/cai1.png"
          } else if (idea.praiseOrStep == 2) {
            idea.praiseUrl = "../../images/ding1.png"
            idea.caiUrl = "../../images/cai2.png"
          } else {
            idea.praiseUrl = "../../images/ding1.png"
            idea.caiUrl = "../../images/cai1.png"
          }
          if (idea.ideaDate == null) {
            idea.startTime = "永久有效"
          } else {
            idea.startTime = toDate(idea.ideaDate)
          }
          idea.createTime = createDate(idea.createDate)
          if (idea.addressName == "哪儿都行") {
            idea.distance = "哪儿都行"
          } else {
            var distanceValue = parseInt(getGreatCircleDistance(currentLat, currentLon, idea.latitude, idea.longitude))
            if (distanceValue > 1000) {
              distanceValue = distanceValue / 1000
              distanceValue = distanceValue.toFixed(2)
              idea.distance = distanceValue + "km"
            } else {
              idea.distance = distanceValue + "m"
            }
          }
          if (idea.gender == 1) {
            idea.headBorder = "border: 4rpx solid #3db4f4"
          } else {
            idea.headBorder = "border: 4rpx solid #fe3851"
          }
          that.setData({
            idea: idea,
            //endIdeaId: endIdeaId
          })
          if (that.data.id == idea.managerId) {
            that.setData({
              detailControl: true,
            })
          } else {
            if (idea.isSignUp == 1) {
              that.setData({
                quitControl: true
              })
            } else {
              if (idea.peopleCounting == 0 || idea.applicantNumber != idea.peopleCounting && idea.isOutDate != 1) {
                that.setData({
                  applyControl: true
                })
              }
            }
          }
          if (idea.isBusinessCertification == 1) {
            wx.request({
              url: 'https://upload.duodework.cn/client-web-front/forwarding/showList',
              data: {
                employeeId: that.data.id,
                ideaId: that.data.ideaId
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/json',
                'Cookie': that.data.cookie
              },
              success: function (res) {
                console.log(JSON.stringify(res))
                if (res.data.statusCode == "02000000") {
                  var list = res.data.data
                  var lotteryNumList = []
                  for (var i = 0, j = list.length; i < j; i++) {
                    var Li = {
                      winningNumber: list[i].winningNumber
                    }
                    lotteryNumList.push(Li)
                  }
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
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/leaveMessageIdea/showLeaveMessageIdea',
      data: {
        ideaId: that.data.ideaId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.data == null) {
          console.log("ok")
          that.setData({
            noneDiscuss: true
          })
        }
        if (res.data.statusCode == "02000000") {
          if (res.data.data == null) {
            console.log("ok")
            that.setData({
              noneDiscuss: true
            })
          } else {
            var messageList = res.data.data
            for (var i = 0, j = messageList.length; i < j; i++) {
              messageList[i].createTime = createDate(messageList[i].createDate)
            }
            that.setData({
              messageList: messageList
            })
          }
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  detailButton: function () {
    var ideaId = this.data.ideaId
    wx.navigateTo({
      url: '/pages/index/applyDetail?ideaId=' + ideaId,
    })
  },
  applyButton: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    var ideaId = this.data.ideaId
    var applicantId = userInfo.id
    if (userInfo.telephone == null) {
      that.setData({
        modelControl: true
      })
    } else {
      if (userInfo.college == null) {
        wx.showModal({
          title: '提醒',
          content: '商家已设定活动推送范围，请您输入您的学校',
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
      } else {
        wx.showModal({
          title: '提醒',
          content: '报名成功后您的手机号将发送给活动组织者，方便活动组织者联系到您，是否继续报名',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.request({
                url: 'https://upload.duodework.cn/client-web-front/ideaEnter/save',
                data: {
                  ideaId: ideaId,
                  applicantId: applicantId
                },
                method: "POST",
                header: {
                  'content-type': 'application/json',
                  'Cookie': that.data.cookie
                },
                success: function (res) {
                  console.log(JSON.stringify(res))
                  switch (res.data.statusCode) {
                    case "02000000":
                      var headBorder = ""
                      wx.showToast({
                        title: '报名成功',
                      })
                      var idea = that.data.idea
                      if (that.data.gender == 1) {
                        headBorder = "border: 4rpx solid #3db4f4"
                      } else {
                        headBorder = "border: 4rpx solid #fe3851"
                      }
                      var applicantNumber = idea.applicantNumber + 1
                      idea.applicantNumber = applicantNumber
                      var apply = {
                        gender: that.data.gender,
                        headUrl: that.data.avatarUrl,
                        userId: that.data.userId
                      }
                      idea.ideaEnterElemList.push(apply)
                      that.setData({
                        applyControl: false,
                        quitControl: true,
                        detailControl: false,
                        idea: idea
                      })
                      var pages = getCurrentPages();
                      var prevPage = pages[pages.length - 2];
                      console.log(JSON.stringify(prevPage))
                      var prevIdeaList = prevPage.data.ideaList
                      var index = that.data.index
                      prevIdeaList[index].applicantNumber = prevIdeaList[index].applicantNumber + 1
                      prevIdeaList[index].isSignUp = 1
                      prevPage.setData({
                        ideaList: prevIdeaList
                      })
                      //记录是否已获得抽奖码
                      if (idea.isBusinessCertification == 1) {
                        wx.request({
                          url: 'https://upload.duodework.cn/client-web-front/forwarding/save',
                          data: {
                            ideaId: that.data.ideaId,
                            employeeId: that.data.id,
                            enterStatus: 1
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
                      break;
                    case "02020033":
                      wx.showModal({
                        title: '提醒',
                        content: '您的学校不在，活动范围，请关注更多的组队大师活动',
                      })
                      break
                    case "02020031":
                      wx.showModal({
                        title: '提醒',
                        content: '您已报名成功',
                      })
                      break
                    case "02020035":
                      wx.showModal({
                        title: '提醒',
                        content: '报名人数已满，您可以关注其它活动',
                      })
                      break
                  }
                },
                fail: function (res) {

                },
                complete: function (res) {

                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var userInfo = wx.getStorageSync("userInfo")
    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.request({
        url: 'https://upload.duodework.cn/client-web-front/telephone/analysis',
        data: {
          employeeId: userInfo.id,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        },
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Cookie': that.data.cookie
        },
        success: function (res) {
          console.log(JSON.stringify(res))
          if (res.data.statusCode == "02000000") {
            if (res.data.data != '') {
              userInfo.telephone = res.data.data
              wx.setStorageSync('userInfo', userInfo)
              that.setData({
                modelControl: false
              })
              if (that.data.idea.money == 0) {
                var ideaId = that.data.ideaId
                var applicantId = userInfo.id
                if (that.data.college == null) {
                  wx.showModal({
                    title: '提醒',
                    content: '商家已设定活动推送范围，请您输入您的学校',
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
                } else {
                  wx.showModal({
                    title: '提醒',
                    content: '报名成功后您的手机号将发送给活动组织者，方便活动组织者联系到您，是否继续报名',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        wx.request({
                          url: 'https://upload.duodework.cn/client-web-front/ideaEnter/save',
                          data: {
                            ideaId: ideaId,
                            applicantId: applicantId
                          },
                          method: "POST",
                          header: {
                            'content-type': 'application/json',
                            'Cookie': that.data.cookie
                          },
                          success: function (res) {
                            console.log(JSON.stringify(res))
                            switch (res.data.statusCode) {
                              case "02000000":
                                var headBorder = ""
                                wx.showToast({
                                  title: '报名成功',
                                })
                                var idea = that.data.idea
                                if (that.data.gender == 1) {
                                  headBorder = "border: 4rpx solid #3db4f4"
                                } else {
                                  headBorder = "border: 4rpx solid #fe3851"
                                }
                                var applicantNumber = idea.applicantNumber + 1
                                idea.applicantNumber = applicantNumber
                                var apply = {
                                  gender: that.data.gender,
                                  headUrl: that.data.avatarUrl,
                                  userId: that.data.userId
                                }
                                idea.ideaEnterElemList.push(apply)
                                that.setData({
                                  applyControl: false,
                                  quitControl: true,
                                  detailControl: false,
                                  idea: idea
                                })
                                var pages = getCurrentPages();
                                var prevPage = pages[pages.length - 2];
                                console.log(JSON.stringify(prevPage))
                                var prevIdeaList = prevPage.data.ideaList
                                var index = that.data.index
                                prevIdeaList[index].applicantNumber = prevIdeaList[index].applicantNumber + 1
                                prevIdeaList[index].isSignUp = 1
                                prevPage.setData({
                                  ideaList: prevIdeaList
                                })
                                //记录是否已获得抽奖码
                                if (idea.isBusinessCertification == 1) {
                                  wx.request({
                                    url: 'https://upload.duodework.cn/client-web-front/forwarding/save',
                                    data: {
                                      ideaId: that.data.ideaId,
                                      employeeId: that.data.id,
                                      enterStatus: 1
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
                                break;
                              case "02020033":
                                wx.showModal({
                                  title: '提醒',
                                  content: '您的学校不在，活动范围，请关注更多的组队大师活动',
                                })
                                break
                              case "02020031":
                                wx.showModal({
                                  title: '提醒',
                                  content: '您已报名成功',
                                })
                                break
                              case "02020035":
                                wx.showModal({
                                  title: '提醒',
                                  content: '报名人数已满，您可以关注其它活动',
                                })
                                break
                            }
                          },
                          fail: function (res) {

                          },
                          complete: function (res) {

                          }
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              } else {
                var total_fee = that.data.idea.money
                var utilMd5 = require('../../utils/md5.js');
                var ideaId = that.data.ideaId
                var applicantId = userInfo.id
                if (that.data.college == null) {
                  wx.showModal({
                    title: '提醒',
                    content: '商家已设定活动推送范围，请您输入您的学校',
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
                } else {
                  wx.showModal({
                    title: '提醒',
                    content: '报名成功后您的手机号将发送给活动组织者，方便活动组织者联系到您，是否继续报名',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        wx.request({
                          url: 'https://upload.duodework.cn/client-web-front/pay/unifiedorder',
                          data: {
                            totalFee: total_fee,
                            openid: userInfo.openid
                          },
                          method: "POST",
                          header: {
                            'content-type': 'application/json',
                            'Cookie': that.data.cookie
                          },
                          success: function (res) {
                            console.log(JSON.stringify(res))
                            if (res.data.statusCode == "02000000") {
                              var timeStamp = String(res.data.data.timeStamp)
                              var packageString = 'prepay_id=' + res.data.data.prepay_id
                              var paySignString = 'appId=wx09312511620a5c88&nonceStr=' + res.data.data.nonceStr + '&package=prepay_id=' + res.data.data.prepay_id + '&signType=MD5&timeStamp=' + timeStamp + '&key=DxW4HbAcFa36prGRGhfEXFZmyzR6DByY'
                              var paySign = utilMd5.hexMD5(paySignString)
                              console.log(packageString)
                              wx.requestPayment({
                                timeStamp: String(res.data.data.timeStamp),
                                nonceStr: res.data.data.nonceStr,
                                package: packageString,
                                signType: 'MD5',
                                paySign: paySign,
                                'success': function (res) {
                                  console.log(JSON.stringify(res))
                                  wx.request({
                                    url: 'https://upload.duodework.cn/client-web-front/ideaEnter/save',
                                    data: {
                                      ideaId: ideaId,
                                      applicantId: applicantId
                                    },
                                    method: "POST",
                                    header: {
                                      'content-type': 'application/json',
                                      'Cookie': that.data.cookie
                                    },
                                    success: function (res) {
                                      console.log(JSON.stringify(res))
                                      switch (res.data.statusCode) {
                                        case "02000000":
                                          var headBorder = ""
                                          wx.showToast({
                                            title: '报名成功',
                                          })
                                          var idea = that.data.idea
                                          if (that.data.gender == 1) {
                                            headBorder = "border: 4rpx solid #3db4f4"
                                          } else {
                                            headBorder = "border: 4rpx solid #fe3851"
                                          }
                                          var applicantNumber = idea.applicantNumber + 1
                                          idea.applicantNumber = applicantNumber
                                          var apply = {
                                            gender: that.data.gender,
                                            headUrl: that.data.avatarUrl,
                                            userId: that.data.userId
                                          }
                                          idea.ideaEnterElemList.push(apply)
                                          that.setData({
                                            applyControl: false,
                                            quitControl: true,
                                            detailControl: false,
                                            idea: idea
                                          })
                                          var pages = getCurrentPages();
                                          var prevPage = pages[pages.length - 2];
                                          console.log(JSON.stringify(prevPage))
                                          var prevIdeaList = prevPage.data.ideaList
                                          var index = that.data.index
                                          prevIdeaList[index].applicantNumber = prevIdeaList[index].applicantNumber + 1
                                          prevIdeaList[index].isSignUp = 1
                                          prevPage.setData({
                                            ideaList: prevIdeaList
                                          })
                                          //记录是否已获得抽奖码
                                          if (idea.isBusinessCertification == 1) {
                                            wx.request({
                                              url: 'https://upload.duodework.cn/client-web-front/forwarding/save',
                                              data: {
                                                ideaId: that.data.ideaId,
                                                employeeId: that.data.id,
                                                enterStatus: 1
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
                                          break;
                                        case "02020033":
                                          wx.showModal({
                                            title: '提醒',
                                            content: '您的学校不在，活动范围，请关注更多的组队大师活动',
                                          })
                                          break
                                        case "02020031":
                                          wx.showModal({
                                            title: '提醒',
                                            content: '您已报名成功',
                                          })
                                          break
                                        case "02020035":
                                          wx.showModal({
                                            title: '提醒',
                                            content: '报名人数已满，您可以关注其它活动',
                                          })
                                          break
                                      }
                                    },
                                    fail: function (res) {

                                    },
                                    complete: function (res) {

                                    }
                                  })
                                },
                                'fail': function (res) {
                                  console.log(JSON.stringify(res))
                                  wx.showModal({
                                    title: '提醒',
                                    content: '支付失败',
                                  })
                                }
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
            } else {
              wx.showModal({
                title: '提醒',
                content: '您的微信为绑定手机号，是否前往绑定手机号？',
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
            }

          }
        },
        fail: function (res) {

        },
        complete: function (res) {

        }
      })
    } else {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'loading'
      })
    }

  },
  quitButton: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    var ideaId = this.data.ideaId
    var applicantId = userInfo.id
    wx.request({
      url: 'https://upload.duodework.cn/client-web-front/ideaEnter/quit',
      data: {
        ideaId: ideaId,
        applicantId: applicantId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': that.data.cookie
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        if (res.data.statusCode == "02000000") {
          wx.showToast({
            title: '退出报名成功',
          })
          if (res.data.data == []) {
            idea.ideaEnterElemList = []
            idea.applicantNumber = idea.applicantNumber - 1
            that.setData({
              applyControl: true,
              quitControl: false,
              detailControl: false,
              idea: idea
            })
          } else {
            var applyList = res.data.data
            var idea = that.data.idea
            var newIdeaEnterElemList = []
            for (var i = 0, j = applyList.length; i < j; i++) {
              var headBorder = ""
              if (applyList[i].gender == 1) {
                headBorder = "border: 4rpx solid #3db4f4"
              } else {
                headBorder = "border: 4rpx solid #fe3851"
              }
              var newIdeaEnterElem = {
                headUrl: applyList[i].headUrl,
                userId: applyList[i].applicantId,
                userName: applyList[i].applicant,
                gender: applyList[i].gender,
                headBorder: headBorder
              }
              newIdeaEnterElemList.push(newIdeaEnterElem)
            }
            idea.ideaEnterElemList = newIdeaEnterElemList
            idea.applicantNumber = idea.applicantNumber - 1
            that.setData({
              applyControl: true,
              quitControl: false,
              detailControl: false,
              idea: idea
            })
          }
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          console.log(JSON.stringify(prevPage))
          var prevIdeaList = prevPage.data.ideaList
          var index = that.data.index
          prevIdeaList[index].applicantNumber = prevIdeaList[index].applicantNumber - 1
          prevIdeaList[index].isSignUp = 2
          prevPage.setData({
            ideaList: prevIdeaList
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
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
  getCommentInfo: function (e) {
    var commentValue = e.detail.value
    this.setData({
      commentValue: commentValue
    })
    if (commentValue == "") {
      this.setData({
        replyId: ""
      })
    }
  },
  sendComment: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    console.log("userId::" + userInfo.id)
    if (that.data.commentValue == "") {
      wx.showToast({
        title: '请填写评论内容',
      })
    } else {
      if (that.data.replyId == "" || that.data.replyId == undefined) {
        wx.request({
          url: 'https://upload.duodework.cn/client-web-front/leaveMessageIdea/save',
          data: {
            ideaId: this.data.ideaId,
            commentContent: this.data.commentValue,
            commentator: userInfo.nickName,
            commentatorId: userInfo.id
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          },
          success: function (res) {
            console.log(JSON.stringify(res))
            if (res.data.statusCode == "02000000") {
              var messageList = that.data.messageList
              var messageLi = res.data.data
              messageLi.createTime = createDate(messageLi.createDate)
              messageLi.gender = userInfo.gender
              messageLi.commentatorId = userInfo.id
              messageList.push(messageLi)
              that.setData({
                messageList: messageList,
                commentValue: "",
                noneDiscuss: false
              })
              setTimeout(function () {
                that.setData({
                  toViewId: res.data.data.id
                })
              }, 300)
            }
          },
          fail: function (res) {

          },
          complete: function (res) {
            that.setData({
              commentValue: ""
            })
          }
        })
      } else {
        wx.request({
          url: 'https://upload.duodework.cn/client-web-front/leaveMessageIdea/leaveMessageReplySave',
          data: {
            leaveMessageId: this.data.leaveMessageId,
            replyContent: this.data.name + " " + this.data.commentValue,
            replyId: this.data.replyId,
            replyName: this.data.replyName,
            senderId: userInfo.id,
            senderName: userInfo.nickName
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Cookie': that.data.cookie
          },
          success: function (res) {
            console.log(JSON.stringify(res))
            if (res.data.statusCode == "02000000") {
              var messageList = that.data.messageList
              var replyIndex = that.data.replyIndex
              var messageLi = {
                id: res.data.data,
                leaveMessageId: that.data.leaveMessageId,
                replyContent: that.data.name + " " + that.data.commentValue,
                replyId: that.data.replyId,
                replyName: that.data.replyName,
                senderId: userInfo.id,
                senderName: that.data.name
              }
              messageList[replyIndex].leaveMessageReplyVOList.push(messageLi)
              that.setData({
                messageList: messageList,
                commentValue: "",
                replyName: "",
                replyId: "",
                replyIndex: ""
              })
              setTimeout(function () {
                that.setData({
                  toViewId: res.data.data.id
                })
              }, 300)
            }
          },
          fail: function (res) {
            wx.showToast({
              icon: 'warn',
              title: '信息发送失败',
            })
          },
          complete: function (res) {
            that.setData({
              commentValue: ""
            })
          }
        })
      }

    }

  },
  getRepaly: function (e) {
    var that = this
    var getName = e.currentTarget.dataset.name
    var replyId = e.currentTarget.dataset.reply
    var leaveMessageId = e.currentTarget.dataset.id
    var replyIndex = e.currentTarget.dataset.index
    if (replyId == this.data.id) {
      wx.showActionSheet({
        itemList: ['删除'],
        success: function (res) {
          console.log(res.tapIndex)
          switch (res.tapIndex) {
            case 0:
              var replyType = e.currentTarget.dataset.type
              if (replyType == "message") {
                wx.request({
                  url: 'https://upload.duodework.cn/client-web-front/leaveMessageIdea/delete',
                  data: {
                    id: leaveMessageId
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/json',
                    'Cookie': that.data.cookie
                  },
                  success: function (res) {
                    if (res.data.statusCode == "02000000") {
                      var messageList = that.data.messageList
                      messageList.splice(replyIndex, 1)
                      that.setData({
                        messageList: messageList
                      })
                    }
                  }
                })
              } else if (replyType == "reply") {
                var replyMessageId = e.currentTarget.dataset.replyid
                wx.request({
                  url: 'https://upload.duodework.cn/client-web-front/leaveMessageIdea/leaveMessageReplyDelete',
                  data: {
                    id: replyMessageId
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/json',
                    'Cookie': that.data.cookie
                  },
                  success: function (res) {
                    if (res.data.statusCode == "02000000") {
                      var messageList = that.data.messageList
                      var replyidx = e.currentTarget.dataset.replyidx
                      messageList[replyIndex].leaveMessageReplyVOList.splice(replyidx, 1)
                      that.setData({
                        messageList: messageList
                      })
                    }
                  }
                })
              }
              break;
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else {
      this.setData({
        commentValue: "回复 " + getName + ": ",
        replyId: replyId,
        leaveMessageId: leaveMessageId,
        replyName: getName,
        replyIndex: replyIndex
      })
    }

  },
  playVideo: function (e) {
    var path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: '/pages/playVideo?path=' + encodeURIComponent(path),
    })
  },
  selectedPic: function (e) {
    var picIdx = e.currentTarget.dataset.pic
    var picList = this.data.idea.showAnnexLibraryElemList
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
  contact: function (e) {
    var telephone = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: telephone,
    })
  },
  amendButtom: function () {
    wx.redirectTo({
      url: '/pages/index/amendIdea?ideaId=' + this.data.ideaId,
    })
  },
  indexButton: function () {
    wx.switchTab({
      url: '/pages/index/team',
    })
  },
  moveToPromotion: function (e) {
    var promotionId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/group/promotionDetail?promotionId=' + promotionId,
    })
  },
  moreRules: function () {
    var rules = '1、活动报名结束的当日收盘时上证指数 x 深证成指 x 10000 = 12位数。（如遇节假日，则以下一个交易日收盘指数计算。指数以证交所公布数字为准）；\n2、将此12位数字倒序排列后（如首位是0则直接抹去），再除以本次活动结束时的抽奖码总数，所得到的余数加1即为获奖号码之一；\n3、12位数字除以抽奖码总数所得的数字的整数部分继续除以抽奖码总数后取余数加1，获得第二个获奖号码，以此类推，直至所有获奖号码被抽出；\n4、若除至最后数字小于抽奖码总数以致无法取余数，则用该数字 x 上证指数 x 深成指数 x 10000 所得的数字继续重复以上步骤，直至所有中奖号码被抽出；\n5、同一次活动中，每个抽奖码和每个参与用户只有一次中奖机会，重复中奖的用户和抽奖码将被跳过。'
    this.setData({
      rules: rules,
      displayControl: 'hide'
    })
  },
  payButton: function () {
    var that = this
    var total_fee = that.data.idea.money
    var utilMd5 = require('../../utils/md5.js');
    var userInfo = wx.getStorageSync("userInfo")
    var ideaId = that.data.ideaId
    var applicantId = userInfo.id
    if (userInfo.telephone == null) {
      that.setData({
        modelControl: true
      })
    } else {
      if (userInfo.college == null) {
        wx.showModal({
          title: '提醒',
          content: '商家已设定活动推送范围，请您输入您的学校',
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
      } else {
        wx.showModal({
          title: '提醒',
          content: '报名成功后您的手机号将发送给活动组织者，方便活动组织者联系到您，是否继续报名',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.request({
                url: 'https://upload.duodework.cn/client-web-front/pay/unifiedorder',
                data: {
                  totalFee: total_fee,
                  openid: userInfo.openid
                },
                method: "POST",
                header: {
                  'content-type': 'application/json',
                  'Cookie': that.data.cookie
                },
                success: function (res) {
                  console.log(JSON.stringify(res))
                  if (res.data.statusCode == "02000000") {
                    var timeStamp = String(res.data.data.timeStamp)
                    var packageString = 'prepay_id=' + res.data.data.prepay_id
                    var paySignString = 'appId=wx09312511620a5c88&nonceStr=' + res.data.data.nonceStr + '&package=prepay_id=' + res.data.data.prepay_id + '&signType=MD5&timeStamp=' + timeStamp + '&key=DxW4HbAcFa36prGRGhfEXFZmyzR6DByY'
                    var paySign = utilMd5.hexMD5(paySignString)
                    console.log(packageString)
                    wx.requestPayment({
                      timeStamp: String(res.data.data.timeStamp),
                      nonceStr: res.data.data.nonceStr,
                      package: packageString,
                      signType: 'MD5',
                      paySign: paySign,
                      'success': function (res) {
                        console.log(JSON.stringify(res))
                        wx.request({
                          url: 'https://upload.duodework.cn/client-web-front/ideaEnter/save',
                          data: {
                            ideaId: ideaId,
                            applicantId: applicantId
                          },
                          method: "POST",
                          header: {
                            'content-type': 'application/json',
                            'Cookie': that.data.cookie
                          },
                          success: function (res) {
                            console.log(JSON.stringify(res))
                            switch (res.data.statusCode) {
                              case "02000000":
                                var headBorder = ""
                                wx.showToast({
                                  title: '报名成功',
                                })
                                var idea = that.data.idea
                                if (that.data.gender == 1) {
                                  headBorder = "border: 4rpx solid #3db4f4"
                                } else {
                                  headBorder = "border: 4rpx solid #fe3851"
                                }
                                var applicantNumber = idea.applicantNumber + 1
                                idea.applicantNumber = applicantNumber
                                var apply = {
                                  gender: that.data.gender,
                                  headUrl: that.data.avatarUrl,
                                  userId: that.data.userId
                                }
                                idea.ideaEnterElemList.push(apply)
                                that.setData({
                                  applyControl: false,
                                  quitControl: true,
                                  detailControl: false,
                                  idea: idea
                                })
                                var pages = getCurrentPages();
                                var prevPage = pages[pages.length - 2];
                                console.log(JSON.stringify(prevPage))
                                var prevIdeaList = prevPage.data.ideaList
                                var index = that.data.index
                                prevIdeaList[index].applicantNumber = prevIdeaList[index].applicantNumber + 1
                                prevIdeaList[index].isSignUp = 1
                                prevPage.setData({
                                  ideaList: prevIdeaList
                                })
                                //记录是否已获得抽奖码
                                if (idea.isBusinessCertification == 1) {
                                  wx.request({
                                    url: 'https://upload.duodework.cn/client-web-front/forwarding/save',
                                    data: {
                                      ideaId: that.data.ideaId,
                                      employeeId: that.data.id,
                                      enterStatus: 1
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
                                break;
                              case "02020033":
                                wx.showModal({
                                  title: '提醒',
                                  content: '您的学校不在，活动范围，请关注更多的组队大师活动',
                                })
                                break
                              case "02020031":
                                wx.showModal({
                                  title: '提醒',
                                  content: '您已报名成功',
                                })
                                break
                              case "02020035":
                                wx.showModal({
                                  title: '提醒',
                                  content: '报名人数已满，您可以关注其它活动',
                                })
                                break
                            }
                          },
                          fail: function (res) {

                          },
                          complete: function (res) {

                          }
                        })
                      },
                      'fail': function (res) {
                        console.log(JSON.stringify(res))
                        wx.showModal({
                          title: '提醒',
                          content: '支付失败',
                        })
                      }
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
  },
  modelCancel: function () {
    this.setData({
      modelControl: false
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

//生成32位随机字符串
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