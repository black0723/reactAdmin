import React from 'react'

import './index.less'

//外形像链接的按钮
//默认暴露，引入时不需要大括号{}
export default function LinkButton(props) {
  return (
    <button {...props} className={'link-button'}></button>
  )
}