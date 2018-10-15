var wxCharts = require('../../utils/wxcharts.js');
const app = getApp();
var weekArray = new Array('week7', 'week1', 'week2', 'week3', 'week4', 'week5', 'week6');
function Weekday(date) {
  return weekArray[new Date(date).getDay()];
};
function CalculatePredicteData(arr, week) {//30天步数以及周几来输出
  var count = 0;
  var predata = [];
  for (var i = 0; i < 28; i++) {
    if (week == Weekday(arr[i].timestamp)) {
      count++;
      predata.push(arr[i].step);
    }
    if (count == 4) {

      return {
        [week]: predata
      }
      break;
    }

  };

};
//预测的7天日期，一定要用xxxx/xx/xx不然苹果解析不了
function PredictDate(){
  var categories=[];
  for (var i = 1; i <= 7; i++) {
    var date = new Date();
    date.setDate(date.getDate() + i);
    var time = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    categories.push(time);
  }
  return categories;
};
//步数预测
Array.prototype.pre = function () {
  var result = 0;
  for (var i = 0; i < this.length; i++) {
    if (i == 0) {
      result += 0.1 * this[i];
    } else if (i == 1) {
      result += 0.2 * this[i];
    } else if (i == 2) {
      result += 0.3 * this[i];
    } else {
      result += 0.4 * this[i];
    }

  }
  return parseInt(result);
};

var columnChart = null;
Page({
  data: {
    display: 'block',
  
  },
 
  createSimulationData: function (categories,cdata) {
    
   return {
            categories: categories,
            data: cdata
         }
  },

  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    };
    
    var categories = [];
    categories = PredictDate();//找出后七天
    var cdata = [];
    var arr = app.globalData.wxRundata;
    for (var i = 0; i < weekArray.length; i++) {
      this.setData(CalculatePredicteData(arr, weekArray[i]))
    }
    for (var i = 0; i < categories.length; i++) {
     
      var weeklkey = Weekday(categories[i])//对应的周几
      var weekItemdata = this.data[weeklkey];
      var reStep = weekItemdata.pre();//预测值
      cdata.push(reStep);
    };
    var simulationData = this.createSimulationData(categories,cdata);
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '步数',
        data: simulationData.data,
        format: function (val, name) {
          return val ;
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
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    this.setData({
      categories: categories,
      cdata: simulationData.data
    })
   
   
  },
  onShareAppMessage: function (res) {
    return {
     
      path: '/pages/index/index', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("ShareError");
      },

    }
  }


});