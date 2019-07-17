/*
  放置接口请求函数，每个函数返回promise对象
 */
import {message} from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'

//后台URL前缀
const ADMIN_URL_PREFIX = '/admin'

//登录,使用箭头函数
export const reqLogin = (username, password, usertype) => ajax(ADMIN_URL_PREFIX + '/login', {
  username,
  password,
  usertype
}, 'POST')

//登录，使用普通函数
export function reqLogin2(username, password, usertype) {
  return ajax(ADMIN_URL_PREFIX + '/login', {username, password, usertype}, 'POST')
}

//登录，使用箭头函数，{里要return}
export const reqLogin3 = (username, password, usertype) => {
  return ajax(ADMIN_URL_PREFIX + '/login', {username, password, usertype}, 'POST')
}


//添加用户
export const reqAddUser = (user) => ajax(ADMIN_URL_PREFIX + '/user/add', user, 'POST')

/**
 * jsonp接口请求函数，获取天气预报
 */
export const reqWeather = (city) => {

  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    //发送jsonp请求
    jsonp(url, {}, (err, data) => {
      //console.log('jsonp()', err, data)
      //如果成功了
      if (!err && data.status === 'success') {
        //解构返回的天气值
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        //失败了
        message.error('获取天气数据失败' + err)
      }
    })
  })
}

//测试
//reqWeather('北京')