/*
* 入口js
* */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

//使用了按需打包，这个就不需要引入了
//import 'antd/dist/antd.css'

import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

/*
读取local中存储的user,保存到内存中
 */
const user = storageUtils.getUser()
memoryUtils.user = user

//渲染组件App
ReactDOM.render(<App />,document.getElementById('root'))
