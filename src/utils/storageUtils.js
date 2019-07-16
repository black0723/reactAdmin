/*
进行local数据存储
 */

import store from 'store'

const USERKEY = 'user_key'
export default {
  /*
  保存user
   */
  saveUser(user) {
    // 原生
    // localStorage.setItem(USERKEY, JSON.stringify(user))
    // 使用store库
    store.set(USERKEY, user)
  },

  /*
  读取user
   */
  getUser() {
    //return JSON.parse(localStorage.getItem(USERKEY) || '{}')
    return store.get(USERKEY) || {}
  },

  /*
  删除user
   */
  removeUser() {
    //localStorage.removeItem(USERKEY)
    store.remove(USERKEY)
  }
}
