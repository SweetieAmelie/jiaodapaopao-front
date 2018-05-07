// restart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openAuth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '登录中',
    })
    var that = this
    var QQMapWX = require('../utils/qqmap-wx-jssdk.min.js');
    var qqmapsdk;
    var currentLat
    var currentLon
    var status = options.status //跳转页面位置 1代表商家活动页面
    wx.setStorageSync('route', status)
    wx.getLocation({
      success: function (res) {
        wx.showLoading({
          title: '注册信息获取中',
        })
        // var location = {
        //   currentLat: res.latitude,
        //   currentLon: res.longitude
        // }
        // currentLat = res.latitude
        // currentLon = res.longitude
        // wx.setStorage({
        //   key: 'currentLocation',
        //   data: location,
        // })
      },
    })
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
        wx.checkSession({
          success: function () {
            wx.login({
              success: function (res) {
                // success
                var code = res.code
                console.log(res.code)
                wx.getUserInfo({
                  success: function (res) {
                    console.log(JSON.stringify(res))
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    var encryptData = res.encryptedData
                    var iv = res.iv
                    wx.request({
                      url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
                      data: {
                        code: code,
                        nickName: nickName,
                        avatarUrl: avatarUrl,
                        gender: gender,
                        province: province,
                        city: city,
                        country: country,
                        encryptedData: encryptData,
                        iv: iv
                      },
                      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                        'content-type': 'application/json'
                      }, // 设置请求的 header
                      dataType: 'json',
                      success: function (res) {
                        // success
                        console.log("success:" + JSON.stringify(res))
                        if (res.data.statusCode == "02000000") {
                          wx.setStorageSync('userInfo', res.data.data)
                          console.log(res.data.data.unionId)
                          wx.request({
                            url: 'https://upload.duodework.cn/zhongxin-web-front/employee/loginUnion',
                            data: {
                              unionid: res.data.data.unionId
                            },
                            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            header: {
                              'content-type': 'application/json'
                            }, // 设置请求的 header
                            dataType: 'json',
                            success: function (res) {
                              console.log(JSON.stringify(res))
                              if (res.data.statusCode == "02000000") {
                                var cookie = res.header['Set-Cookie']
                                wx.setStorageSync('cookie', cookie)
                                wx.switchTab({
                                  url: '/pages/index/team',
                                })
                                //wx.hideLoading()
                              }
                            },
                            fail: function (res) {

                            },
                            complete: function (res) {

                            }
                          })
                        }
                      },
                      fail: function (res) {
                        console.log("fail:" + res)
                        // fail
                      },
                      complete: function (res) {
                        console.log("complete:" + res)
                        // complete
                      }
                    })
                  },
                  fail: function (res) {
                    // fail
                    wx.showToast({
                      title: '获取用户信息失败，请检查网络设置',
                      icon: 'loading',
                      duration: 2000
                    })
                    that.setData({
                      openAuth: true
                    })
                  },
                  complete: function (res) {
                    // complete
                  }
                })
              },
              fail: function (res) {
                // fail
                wx.showToast({
                  title: '登录失败，请检查网络设置',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function (res) {
                // complete
              }
            })
          },
          fail: function () {
            wx.login({
              success: function (res) {
                // success
                var code = res.code
                console.log(res.code)
                wx.getUserInfo({
                  success: function (res) {
                    console.log(JSON.stringify(res))
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    var encryptData = res.encryptedData
                    var iv = res.iv
                    wx.request({
                      url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
                      data: {
                        code: code,
                        nickName: nickName,
                        avatarUrl: avatarUrl,
                        gender: gender,
                        province: province,
                        city: city,
                        country: country,
                        encryptedData: encryptData,
                        iv: iv
                      },
                      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                        'content-type': 'application/json'
                      }, // 设置请求的 header
                      dataType: 'json',
                      success: function (res) {
                        // success
                        console.log("success:" + JSON.stringify(res))
                        if (res.data.statusCode == "02000000") {
                          wx.setStorageSync('userInfo', res.data.data)
                          console.log(res.data.data.unionId)
                          wx.request({
                            url: 'https://upload.duodework.cn/zhongxin-web-front/employee/loginUnion',
                            data: {
                              unionid: res.data.data.unionId
                            },
                            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            header: {
                              'content-type': 'application/json'
                            }, // 设置请求的 header
                            dataType: 'json',
                            success: function (res) {
                              //console.log(JSON.stringify(res))
                              if (res.data.statusCode == "02000000") {
                                var cookie = res.header['Set-Cookie']
                                wx.setStorageSync('cookie', cookie)
                                // wx.switchTab({
                                //   url: '/pages/index/team',
                                // })
                                //wx.hideLoading()
                              }
                            },
                            fail: function (res) {

                            },
                            complete: function (res) {

                            }
                          })
                        }
                      },
                      fail: function (res) {
                        console.log("fail:" + res)
                        // fail
                      },
                      complete: function (res) {
                        console.log("complete:" + res)
                        // complete
                      }
                    })
                  },
                  fail: function (res) {
                    // fail
                    wx.showToast({
                      title: '获取用户信息失败，请检查网络设置',
                      icon: 'loading',
                      duration: 2000
                    })
                    that.setData({
                      openAuth: true
                    })
                  },
                  complete: function (res) {
                    // complete
                  }
                })
              },
              fail: function (res) {
                // fail
                wx.showToast({
                  title: '登录失败，请检查网络设置',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function (res) {
                // complete
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getSetting({
      success(res) {
        console.log("setting:" + JSON.stringify(res))
        if (res.authSetting['scope.userInfo'] == false) {
          that.setData({
            openAuth: true
          })
          wx.showModal({
            title: '提醒',
            content: '使用组队大师需要您的授权，是否前往授权',
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
                    if (res.authSetting['scope.userInfo']) {
                      wx.checkSession({
                        success: function () {
                          wx.login({
                            success: function (res) {
                              // success
                              var code = res.code
                              console.log(res.code)
                              wx.getUserInfo({
                                success: function (res) {
                                  console.log(JSON.stringify(res))
                                  var userInfo = res.userInfo
                                  var nickName = userInfo.nickName
                                  var avatarUrl = userInfo.avatarUrl
                                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                                  var province = userInfo.province
                                  var city = userInfo.city
                                  var country = userInfo.country
                                  var encryptData = res.encryptedData
                                  var iv = res.iv
                                  wx.request({
                                    url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
                                    data: {
                                      code: code,
                                      nickName: nickName,
                                      avatarUrl: avatarUrl,
                                      gender: gender,
                                      province: province,
                                      city: city,
                                      country: country,
                                      encryptedData: encryptData,
                                      iv: iv
                                    },
                                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    header: {
                                      'content-type': 'application/json'
                                    }, // 设置请求的 header
                                    dataType: 'json',
                                    success: function (res) {
                                      // success
                                      console.log("success:" + JSON.stringify(res))
                                      if (res.data.statusCode == "02000000") {
                                        wx.setStorageSync('userInfo', res.data.data)
                                        console.log(res.data.data.unionId)
                                        wx.request({
                                          url: 'https://upload.duodework.cn/zhongxin-web-front/employee/loginUnion',
                                          data: {
                                            unionid: res.data.data.unionId
                                          },
                                          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                          header: {
                                            'content-type': 'application/json'
                                          }, // 设置请求的 header
                                          dataType: 'json',
                                          success: function (res) {
                                            console.log(JSON.stringify(res))
                                            if (res.data.statusCode == "02000000") {
                                              var cookie = res.header['Set-Cookie']
                                              wx.setStorageSync('cookie', cookie)
                                              // wx.switchTab({
                                              //   url: '/pages/index/team',
                                              // })
                                              //wx.hideLoading()
                                            }
                                          },
                                          fail: function (res) {

                                          },
                                          complete: function (res) {

                                          }
                                        })
                                      }
                                    },
                                    fail: function (res) {
                                      console.log("fail:" + res)
                                      // fail
                                    },
                                    complete: function (res) {
                                      console.log("complete:" + res)
                                      // complete
                                    }
                                  })
                                },
                                fail: function (res) {
                                  // fail
                                  wx.showToast({
                                    title: '获取用户信息失败，请检查网络设置',
                                    icon: 'loading',
                                    duration: 2000
                                  })
                                },
                                complete: function (res) {
                                  // complete
                                }
                              })
                            },
                            fail: function (res) {
                              // fail
                              wx.showToast({
                                title: '登录失败，请检查网络设置',
                                icon: 'loading',
                                duration: 2000
                              })
                            },
                            complete: function (res) {
                              // complete
                            }
                          })
                        },
                        fail: function () {
                          wx.login({
                            success: function (res) {
                              // success
                              var code = res.code
                              console.log(res.code)
                              wx.getUserInfo({
                                success: function (res) {
                                  console.log(JSON.stringify(res))
                                  var userInfo = res.userInfo
                                  var nickName = userInfo.nickName
                                  var avatarUrl = userInfo.avatarUrl
                                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                                  var province = userInfo.province
                                  var city = userInfo.city
                                  var country = userInfo.country
                                  var encryptData = res.encryptedData
                                  var iv = res.iv
                                  wx.request({
                                    url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
                                    data: {
                                      code: code,
                                      nickName: nickName,
                                      avatarUrl: avatarUrl,
                                      gender: gender,
                                      province: province,
                                      city: city,
                                      country: country,
                                      encryptedData: encryptData,
                                      iv: iv
                                    },
                                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    header: {
                                      'content-type': 'application/json'
                                    }, // 设置请求的 header
                                    dataType: 'json',
                                    success: function (res) {
                                      // success
                                      console.log("success:" + JSON.stringify(res))
                                      if (res.data.statusCode == "02000000") {
                                        wx.setStorageSync('userInfo', res.data.data)
                                        console.log(res.data.data.unionId)
                                        wx.request({
                                          url: 'https://upload.duodework.cn/zhongxin-web-front/employee/loginUnion',
                                          data: {
                                            unionid: res.data.data.unionId
                                          },
                                          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                          header: {
                                            'content-type': 'application/json'
                                          }, // 设置请求的 header
                                          dataType: 'json',
                                          success: function (res) {
                                            //console.log(JSON.stringify(res))
                                            if (res.data.statusCode == "02000000") {
                                              var cookie = res.header['Set-Cookie']
                                              wx.setStorageSync('cookie', cookie)
                                              // wx.switchTab({
                                              //   url: '/pages/index/team',
                                              // })
                                              //wx.hideLoading()
                                            }
                                          },
                                          fail: function (res) {

                                          },
                                          complete: function (res) {

                                          }
                                        })
                                      }
                                    },
                                    fail: function (res) {
                                      console.log("fail:" + res)
                                      // fail
                                    },
                                    complete: function (res) {
                                      console.log("complete:" + res)
                                      // complete
                                    }
                                  })
                                },
                                fail: function (res) {
                                  // fail
                                  wx.showToast({
                                    title: '获取用户信息失败，请检查网络设置',
                                    icon: 'loading',
                                    duration: 2000
                                  })
                                },
                                complete: function (res) {
                                  // complete
                                }
                              })
                            },
                            fail: function (res) {
                              // fail
                              wx.showToast({
                                title: '登录失败，请检查网络设置',
                                icon: 'loading',
                                duration: 2000
                              })
                            },
                            complete: function (res) {
                              // complete
                            }
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
  authorized: function () {
    var that = this
    wx.getSetting({
      success(res) {
        console.log("setting:" + JSON.stringify(res))
        if (res.authSetting['scope.userInfo'] == false) {
          wx.showModal({
            title: '提醒',
            content: '使用组队大师需要您的授权，是否前往授权',
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
                    if (res.authSetting['scope.userInfo']) {
                      wx.checkSession({
                        success: function () {
                          wx.login({
                            success: function (res) {
                              // success
                              var code = res.code
                              console.log(res.code)
                              wx.getUserInfo({
                                success: function (res) {
                                  console.log(JSON.stringify(res))
                                  var userInfo = res.userInfo
                                  var nickName = userInfo.nickName
                                  var avatarUrl = userInfo.avatarUrl
                                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                                  var province = userInfo.province
                                  var city = userInfo.city
                                  var country = userInfo.country
                                  var encryptData = res.encryptedData
                                  var iv = res.iv
                                  wx.request({
                                    url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
                                    data: {
                                      code: code,
                                      nickName: nickName,
                                      avatarUrl: avatarUrl,
                                      gender: gender,
                                      province: province,
                                      city: city,
                                      country: country,
                                      encryptedData: encryptData,
                                      iv: iv
                                    },
                                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    header: {
                                      'content-type': 'application/json'
                                    }, // 设置请求的 header
                                    dataType: 'json',
                                    success: function (res) {
                                      // success
                                      console.log("success:" + JSON.stringify(res))
                                      if (res.data.statusCode == "02000000") {
                                        wx.setStorageSync('userInfo', res.data.data)
                                        console.log(res.data.data.unionId)
                                        wx.request({
                                          url: 'https://upload.duodework.cn/zhongxin-web-front/employee/loginUnion',
                                          data: {
                                            unionid: res.data.data.unionId
                                          },
                                          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                          header: {
                                            'content-type': 'application/json'
                                          }, // 设置请求的 header
                                          dataType: 'json',
                                          success: function (res) {
                                            console.log(JSON.stringify(res))
                                            if (res.data.statusCode == "02000000") {
                                              var cookie = res.header['Set-Cookie']
                                              wx.setStorageSync('cookie', cookie)
                                              // wx.switchTab({
                                              //   url: '/pages/index/team',
                                              // })
                                              //wx.hideLoading()
                                            }
                                          },
                                          fail: function (res) {

                                          },
                                          complete: function (res) {

                                          }
                                        })
                                      }
                                    },
                                    fail: function (res) {
                                      console.log("fail:" + res)
                                      // fail
                                    },
                                    complete: function (res) {
                                      console.log("complete:" + res)
                                      // complete
                                    }
                                  })
                                },
                                fail: function (res) {
                                  // fail
                                  wx.showToast({
                                    title: '获取用户信息失败，请检查网络设置',
                                    icon: 'loading',
                                    duration: 2000
                                  })
                                },
                                complete: function (res) {
                                  // complete
                                }
                              })
                            },
                            fail: function (res) {
                              // fail
                              wx.showToast({
                                title: '登录失败，请检查网络设置',
                                icon: 'loading',
                                duration: 2000
                              })
                            },
                            complete: function (res) {
                              // complete
                            }
                          })
                        },
                        fail: function () {
                          wx.login({
                            success: function (res) {
                              // success
                              var code = res.code
                              console.log(res.code)
                              wx.getUserInfo({
                                success: function (res) {
                                  console.log(JSON.stringify(res))
                                  var userInfo = res.userInfo
                                  var nickName = userInfo.nickName
                                  var avatarUrl = userInfo.avatarUrl
                                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                                  var province = userInfo.province
                                  var city = userInfo.city
                                  var country = userInfo.country
                                  var encryptData = res.encryptedData
                                  var iv = res.iv
                                  wx.request({
                                    url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
                                    data: {
                                      code: code,
                                      nickName: nickName,
                                      avatarUrl: avatarUrl,
                                      gender: gender,
                                      province: province,
                                      city: city,
                                      country: country,
                                      encryptedData: encryptData,
                                      iv: iv
                                    },
                                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                    header: {
                                      'content-type': 'application/json'
                                    }, // 设置请求的 header
                                    dataType: 'json',
                                    success: function (res) {
                                      // success
                                      console.log("success:" + JSON.stringify(res))
                                      if (res.data.statusCode == "02000000") {
                                        wx.setStorageSync('userInfo', res.data.data)
                                        console.log(res.data.data.unionId)
                                        wx.request({
                                          url: 'https://upload.duodework.cn/zhongxin-web-front/employee/loginUnion',
                                          data: {
                                            unionid: res.data.data.unionId
                                          },
                                          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                          header: {
                                            'content-type': 'application/json'
                                          }, // 设置请求的 header
                                          dataType: 'json',
                                          success: function (res) {
                                            //console.log(JSON.stringify(res))
                                            if (res.data.statusCode == "02000000") {
                                              var cookie = res.header['Set-Cookie']
                                              wx.setStorageSync('cookie', cookie)
                                              // wx.switchTab({
                                              //   url: '/pages/index/team',
                                              // })
                                              //wx.hideLoading()
                                            }
                                          },
                                          fail: function (res) {

                                          },
                                          complete: function (res) {

                                          }
                                        })
                                      }
                                    },
                                    fail: function (res) {
                                      console.log("fail:" + res)
                                      // fail
                                    },
                                    complete: function (res) {
                                      console.log("complete:" + res)
                                      // complete
                                    }
                                  })
                                },
                                fail: function (res) {
                                  // fail
                                  wx.showToast({
                                    title: '获取用户信息失败，请检查网络设置',
                                    icon: 'loading',
                                    duration: 2000
                                  })
                                },
                                complete: function (res) {
                                  // complete
                                }
                              })
                            },
                            fail: function (res) {
                              // fail
                              wx.showToast({
                                title: '登录失败，请检查网络设置',
                                icon: 'loading',
                                duration: 2000
                              })
                            },
                            complete: function (res) {
                              // complete
                            }
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
    })
  },
  cancel: function () {
    // wx.switchTab({
    //   url: '/pages/index/team',
    // })
  }
})