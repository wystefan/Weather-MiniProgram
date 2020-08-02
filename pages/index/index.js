//index.js
//获取应用实例
const app = getApp()
const weatherMap = {
  'sunny': 'sunny',
  'cloudy': 'cloudy',
  'overcast': 'overcast',
  'lightrain': 'light rain',
  'heavyrain': 'heavy rain',
  'snow': 'snow'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBg: '',
    hourlyWeather: []
  },

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
  },

  onLoad() {
    this.getNow();
  },

  getNow(callback) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: 'newyork'
      },
      success: function (res) {
        let result = res.data.result;
        let temp = result.now.temp;
        let weather = result.now.weather;
        console.log(temp, weather);
        that.setData({
          nowTemp: temp + '°',
          nowWeather: weatherMap[weather],
          nowWeatherBg: '/images/' + weather + '-bg.png'
        });

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather]
        })

        let hourlyWeather = [];
        let nowHour = new Date().getHours();
        let forecast = result.forecast;
        for ( let i=0; i < 24; i+=3) {
          hourlyWeather.push({
            time:(i + nowHour) % 24 + ":00",
            iconPath: '/images/' + forecast[i/3].weather + '-icon.png',
            temp: '12°'
          })
        }
        hourlyWeather[0].time = "Now";
        that.setData({
          hourlyWeather
        })
      },

      complete: () => {
        callback && callback();
      }
    })
  }
})
