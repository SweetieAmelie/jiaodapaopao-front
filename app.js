//app.js
App({

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var currentLat
    var currentLon
    wx.getLocation({
      success: function (res) {
        var location = {
          currentLat: res.latitude,
          currentLon: res.longitude
        }
        currentLat = res.latitude
        currentLon = res.longitude
        wx.setStorage({
          key: 'currentLocation',
          data: location,
        })
      },
    })
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
                            wx.hideLoading()
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
                            wx.hideLoading()
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
  },
  onShow: function (options) {
    var currentLat
    var currentLon
    wx.getLocation({
      success: function (res) {
        var location = {
          currentLat: res.latitude,
          currentLon: res.longitude
        }
        currentLat = res.latitude
        currentLon = res.longitude
        wx.setStorage({
          key: 'currentLocation',
          data: location,
        })
      },
    })
    console.log("scene:" + options.scene)
    if (options.scene == 1007 || options.scene == 1008) {
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
                              wx.hideLoading()
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
                          url: 'https://upload.duodework.cn/zhongxin-web-front/employee/login',
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
                              wx.hideLoading()
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
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },

})
