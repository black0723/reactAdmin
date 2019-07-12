/*
  能发送 ajax 请求的函数模块
  包装 axios
  函数的返回值是 promise 对象
  axios.get()/post()返回的就是 promise 对象
  返回自己创建的 promise 对象:
  优化
  1.统一处理请求异常，在外面包一个自己的Promise对象
  2.异步返回结果数据, 而不是包含结果数据的 response
*/

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, params = {}, method = 'GET') {

  //在外面包一个自己的Promise对象
  return new Promise((resolve, reject) => {
    let promise
    //1.执行异步ajax请求
    if (method === 'GET') {
      promise = axios.get(url, {
        params  //请求参数
      })
    } else if (method === 'POST') {
      promise = axios.post(url, params)
    } else {
      throw new Error('请求方式出错！')
    }

    promise.then(response => {
      //成功了调用resolve(value)
      //异步返回结果数据, 而不是包含结果数据的 response
      resolve(response.data)
    }).catch(error => {
      //失败了不调用reject(error)，而是提示异常信息
      //reject(error)
      //alert('请求出错了'+error)
      message.error('请求出错了' + error.message)
    })

  })
}

// export default function ajax2(url, params = {}, method = 'GET') {
//   if (method === 'GET') {
//     return axios.get(url, {
//       params  //请求参数
//     })
//   } else if (method === 'POST') {
//     return axios.post(url, params)
//   } else {
//     throw new Error('请求方式出错！')
//   }
// }

//请求登录接口
//ajax('/ajax',{username:'admin','password':'admin'},'POST').then()