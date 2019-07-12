/*
  放置接口请求函数，每个函数返回promise对象
 */

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
