//index.js 代码回撤ctr+Z/y
//获取应用实例
//底部导航在app.json里
const app = getApp();
var keyvalue;
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D);
};
Page({
  data: {
    motto: 'Hello World',
    display:'none',
    flag:true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  secondHandler:function(){
    var that = this;
    that.setData({
      display: "block",
      flag:true
    });
      //2、调用小程序API: wx.getWeRunData获取微信运动数据（加密的）；
          wx.getSetting({
            success: function (res) {
              wx.getWeRunData({
                success(resRun) {
                  const encryptedData = resRun;
                  //console.info(resRun);
                  //3、解密步骤2的数据；
                  wx.request({
                    url: '*****',//处理的webapi
                    data: {
                      EncryptedData: resRun.encryptedData,
                      Iv: resRun.iv,
                      Key: keyvalue
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function (resDecrypt) {
                      var wxRundata1 = [];
                      wxRundata1 = resDecrypt.data.stepInfoList;

                      // console.info(wxRundata1);
                      for (var i = 0; i < wxRundata1.length; i++) {
                        var timesData = toDate(wxRundata1[i].timestamp);

                        wxRundata1[i].timestamp = timesData;
                      }

                      app.globalData.wxRundata = wxRundata1;

                      that.setData({ wxRundata: app.globalData.wxRundata });
                      setTimeout(function () {
                        that.setData({
                          display: "block"
                        });
                      }, 50) //延迟时间 这里是0.05秒
                    }
                  });
                }
              })
            }
          })
        
   
    
  },
  goToPage: function(param){
    wx.switchTab({
      url:  "/pages/charts/line/line",
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    
    }
   if(app.globalData.wxRundata==null)
   {
    //1、调用小程序API:wx.login获取code和sessionKey；
    var that = this;
    wx.login({
      success: function (resLogin) {
        if (resLogin.code) {
          wx.request({
            url: '*****',//处理的webapi
            data: {
              Code: resLogin.code
            },
            // juageIsNull(app.userInfo);
            success: function (resSession) {
              keyvalue = resSession.data.session_key;
              //2、调用小程序API: wx.getWeRunData获取微信运动数据（加密的）；
              wx.getWeRunData({
                success(resRun) {
                  const encryptedData = resRun;
                  //3、解密步骤2的数据；
                  wx.request({
                    url: '*****',//处理的webapi
                    data: {
                      EncryptedData: resRun.encryptedData,
                      Iv: resRun.iv,
                      Key: resSession.data.session_key
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function (resDecrypt) {
                      var wxRundata1 = [];
                      wxRundata1 = resDecrypt.data.stepInfoList;
                      for (var i = 0; i < wxRundata1.length; i++) {
                        var timesData = toDate(wxRundata1[i].timestamp);

                        wxRundata1[i].timestamp = timesData;
                      }

                      app.globalData.wxRundata = wxRundata1;
                     
                      that.setData({ wxRundata: app.globalData.wxRundata });
                      setTimeout(function () {
                        that.setData({
                          display: "block",
                        
                        });
                      }, 50) //延迟时间 这里是0.05秒

                    }
                  });
                },
                fail: function () {
                  that.setData({
                    flag:false
                  });
                  wx.showModal({
                    title: '警告',
                    content: '由于您拒绝授权,根据你的微信运动数据制作的图表将无法显示,请点击确定重新获取授权。',
                    success: function (res) {
                      if (res.confirm) {
                        wx.request({
                          url: '*****',//处理的webapi
                          data: {
                            Code: resLogin.code
                          },
                        
                        })
                      }
                    }
                  })
                }
              })
            }


          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }

        

      }
    });
   }
   else{
     wx.switchTab({
       url: "/pages/charts/line/line",
     });
   }
  },
 

  onShareAppMessage: function (res) {
    return {
      //title: '转发', // 转发标题（默认：当前小程序名称）
      path: '/pages/index/index', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      success(e) {
        
        // shareAppMessage: ok,
        // shareTickets 数组，每一项是一个 shareTicket ，对应一个转发对象
        // 需要在页面onLoad()事件中实现接口
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("ShareError");
      },

    }
  }

});
