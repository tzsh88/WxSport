var wxCharts = require('../../../utils/wxcharts.js');
const app = getApp();

function staticticsData(arrstep, arrdate) {
  var step = arrstep;
  var times = arrdate;
  var maxValue = Math.max.apply(Math, step);
  var maxIndex = step.indexOf(maxValue);
  var minValue = Math.min.apply(Math, step);
  var minIndex = step.indexOf(minValue);
  Array.prototype.sum = function () {
    var result = 0;
    for (var i = 0; i < this.length; i++) {
      result += this[i];
    }
    return result;
  };
  Array.prototype.avg = function () {
    if (this.length == 0) {
      return 0;
    }
    return Math.round(this.sum(this) / this.length, 0);
  };
  var avgValue = step.avg();
  return {
    display: "block",
    avgstep: avgValue,
    maxList: { step: maxValue, date: times[maxIndex] },
    minList: { step: minValue, date: times[minIndex] },
    sumstep: step.sum()
  }

};

var lineChart = null;
Page({
  data:{
    display:"none",
    avgstep:null,
    sumstep:null,
    maxList:null,
    minList:null
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  moreLink:function(){
    wx.navigateTo({
      url: '../pie/pie'
    })
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    
    var arr = app.globalData.wxRundata;
    for (var i = 0; i < arr.length;i++){
      categories.push(arr[i].timestamp);
      data.push(arr[i].step);
     
    };
   
    return {
      categories: categories,
      data: data
    }
    
  },
  
  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
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
      height: 265,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    
   this.setData(staticticsData(simulationData.data, simulationData.categories));
    

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