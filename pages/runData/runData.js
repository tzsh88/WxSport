function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
} ;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */


  data: {
   
    wxRundata: [],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
      //1、调用小程序API:wx.login获取code和sessionKey；
    var that=this;
      wx.login({
        success: function (resLogin) {
          if (resLogin.code) {
            wx.request({
              url: 'https://www.sunweb.site/MiniTest/onloginHandler.ashx',
              data: {
                Code: resLogin.code
              },
              success: function (resSession) {
                //2、调用小程序API: wx.getWeRunData获取微信运动数据（加密的）；
                wx.getWeRunData({
                  success(resRun) {
                    const encryptedData = resRun
                    //console.info(resRun);
                    //3、解密步骤2的数据；
                    wx.request({
                      url: 'https://www.sunweb.site/MiniTest/decryptHandler.ashx',
                      data: {
                        EncryptedData: resRun.encryptedData,
                        Iv: resRun.iv,
                        Key: resSession.data.session_key
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // header: {}, // 设置请求的 header
                      success: function (resDecrypt) {
                        var wxRundata1=[];
                        wxRundata1 = resDecrypt.data.stepInfoList;
                        
                       // console.info(wxRundata1);
                        for (var i = 0; i < wxRundata1.length;i++)
                        {
                          var timesData = toDate(wxRundata1[i].timestamp);
                         
                          wxRundata1[i].timestamp = timesData;
                        }
                      
                        app.globalData.wxRundata = wxRundata1;
                       
                        that.setData({ wxRundata: app.globalData.wxRundata });


                      }
                    });
                  }
                })
              }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})