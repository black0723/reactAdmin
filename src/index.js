/*
* 入口js
* */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

//使用了按需打包，这个就不需要引入了
//import 'antd/dist/antd.css'

//渲染组件App
ReactDOM.render(<App />,document.getElementById('root'))
