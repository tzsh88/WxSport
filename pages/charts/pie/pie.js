var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
function Weekday(date){
  var weekArray = new Array("week7", "week1", "week2", "week3", "week4", "week5", "week6");
return weekArray[new Date(date).getDay()];
};
var pieChart = null;
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"完整4周运动量占比"
  },
  touchStartHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });//图表中展示数据详细内容(目前仅支持line和area图表类型)
  }, 
  touchHandle:function(e){
    var i = e.currentTarget.dataset.week
    console.log(i);
    var weekIndex = "week1";
    if(i==1){
      weekIndex ="week1"
      this.setData({
        title:"周一运动趋势"
      })
    } 
    else if (i == 2) {
      weekIndex = "week2"
      this.setData({
        title: "周二运动趋势"
      })
    }
    else if (i == 3) {
      weekIndex = "week3"
      this.setData({
        title: "周三运动趋势"
      })
    }
    else if (i == 4) {
      weekIndex = "week4"
      this.setData({
        title: "周四运动趋势"
      })
    }
    else if (i == 5) {
      weekIndex = "week5"
      this.setData({
        title: "周五运动趋势"
      })
    }
    else if (i == 6) {
      weekIndex = "week6"
      this.setData({
        title: "周六运动趋势"
      })
    }
    else  {
      weekIndex = "week7"
      this.setData({
        title: "周日运动趋势"
      })
    }

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    lineChart = new wxCharts({
      canvasId: 'pieCanvas',
      type: 'line',
      categories: this.data[weekIndex].dateTime,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '步数',
        data: this.data[weekIndex].date,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '每天行走步数',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: windowWidth,
      height: 250,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });





  },

  createSimulationData: function (category) {
   
    var data = [];
    var dateTime=[];
    var arr = app.globalData.wxRundata;
    for (var i = 0; i < 28; i++) {
      var count=0;
      if (category == Weekday(arr[i].timestamp))
       {
         count++;
         dateTime.push(arr[i].timestamp);
         data.push(arr[i].step);
       }
       if(count==4){
         break;
       }

    };
    Array.prototype.sum = function () {
      var result = 0;
      for (var i = 0; i < this.length; i++) {
        result += this[i];
      }
      return result;
    };
    this.setData({
      [category]:{
        date:data,
        dateTime:dateTime,
        dataSum: data.sum()
      }

    })
    
    return {
      
      data: data.sum()
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '周日',
        data: this.createSimulationData('week7').data
      }, {
        name: '周一',
        data: this.createSimulationData('week1').data,
      }, {
        name: '周二',
        data: this.createSimulationData('week2').data,
      }, {
        name: '周三',
        data: this.createSimulationData('week3').data,
      }, {
        name: '周四',
        data: this.createSimulationData('week4').data,
      }, {
        name: '周五',
        data: this.createSimulationData('week5').data,
      }, {
        name: '周六',
        data: this.createSimulationData('week6').data,
      }],
      width: windowWidth,
      height: 255,
      dataLabel: true,
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
})