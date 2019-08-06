/*
  放置接口请求函数，每个函数返回promise对象
 */
import {message} from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'

//后台URL前缀
const ADMIN_URL_PREFIX = '/admin'

/**
 * 登录接口
 */
//登录,使用箭头函数 分别暴露引入时需要{}
export const reqLogin = (username, password, roleId) => ajax(ADMIN_URL_PREFIX + '/login', {
  username, password, roleId
}, 'POST')

//登录，使用普通函数
export function reqLogin2(username, password, usertype) {
  return ajax(ADMIN_URL_PREFIX + '/login', {username, password, usertype}, 'POST')
}

//登录，使用箭头函数，{里要return}
export const reqLogin3 = (username, password, usertype) => {
  return ajax(ADMIN_URL_PREFIX + '/login', {username, password, usertype}, 'POST')
}


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

/**
 * 分类接口
 */
//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(ADMIN_URL_PREFIX + '/category/add', {
  parentId, categoryName
}, 'POST')

//修改分类
export const reqUpdateCategory = ({id, categoryName}) => ajax(ADMIN_URL_PREFIX + '/category/update', {
  id, categoryName
}, 'POST')

//获取分类列表
export const reqGetCategory = (parentId) => ajax(ADMIN_URL_PREFIX + '/category/list', {parentId})

/**
 * 获取商品列表
 * @param pageIndxe
 * @param pageSize
 */
export const reqProduct = (pageIndex, pageSize, title, intro) => ajax(ADMIN_URL_PREFIX + '/product/list', {
  pageIndex,
  pageSize,
  title,
  intro
})

/**
 * 获取商品详情
 * @param id
 */
export const reqProductDetail = (id) => ajax(ADMIN_URL_PREFIX + `/product/detail/${id}`)

/**
 * 更新商品状态，上架/下架
 * @param id
 * @param status
 */
export const reqUpdateProductStatus = (id, status) => ajax(ADMIN_URL_PREFIX + `/product/updateStatus`, {id, status})

/**
 * 删除图片
 * @param name
 */
export const reqDeleteImage = (name) => ajax('/file/delete', {name}, 'POST')

/**
 * 保存商品
 * @param product
 */
export const reqSaveProduct = (product) => ajax(ADMIN_URL_PREFIX + '/product/save', product, 'POST')

/**
 * 获取角色列表
 */
export const reqGetRoles = () => ajax(ADMIN_URL_PREFIX + '/role/list')

/**
 * 添加角色/修改角色/设置menus权限
 * @param name
 */
export const reqAddRoles = (name) => ajax(ADMIN_URL_PREFIX + '/role/save', {name}, 'POST')

/**
 * 设置角色
 * @param role
 */
export const reqSetRolesAuth = (role) => ajax(ADMIN_URL_PREFIX + '/role/save', role, 'POST')

/**
 * 用户接口
 */
export const reqSaveUser = (user) => ajax(ADMIN_URL_PREFIX + '/user/save', user, 'POST')

/**
 * 用户接口
 */
export const reqUsers = () => ajax(ADMIN_URL_PREFIX + '/user/list')

/**
 * 删除用户
 * @param userId
 */
export const reqDeleteUser = (userId) => ajax(ADMIN_URL_PREFIX + '/user/delete', {userId}, 'POST')
