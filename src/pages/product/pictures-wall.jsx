import React from 'react'
import {Upload, Icon, Modal, message} from 'antd';
import PropTypes from 'prop-types'

import {reqDeleteImage} from '../../api'
import {BASE_IMG_URL} from '../../utils/constant'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 图片上传组件
 */
export default class PicturesWall extends React.Component {

  //接收数据的类型
  static propTypes = {
    imagepaths: PropTypes.array
  }

  state = {
    previewVisible: false,  //标识是否大图预览
    previewImage: '', //大图的URL
    //图片列表
    fileList: [
      /*{
        uid: '-1', // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: 'image.png', // 文件名
        status: 'done', // 状态有：uploading done error removed
        response: '{"status": "success"}', // 服务端响应内容
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },*/
    ],
  }

  /**
   * 在构造函数里初始化状态
   * @param props
   */
  constructor(props) {
    super(props)

    let fileList = []
    //如果是修改，传入了imagepaths属性
    const {imagepaths} = this.props
    if (imagepaths && imagepaths.length > 0) {
      fileList = imagepaths.map((o, index) => (
        {
          uid: index,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
          name: o,  // 文件名
          status: 'done', // 状态有：uploading done error removed
          url: BASE_IMG_URL + o
        }
      ))
    }

    //初始化状态
    this.state = {
      previewVisible: false,  //标识是否大图预览
      previewImage: '', //大图的URL
      fileList: fileList
    }
  }

  /**
   * 隐藏预览
   */
  handleCancel = () => this.setState({previewVisible: false})

  /**
   * 预览图片
   * @param file
   * @returns {Promise<void>}
   */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  /**
   * 上传中、完成、失败都会调用这个函数。
   {
      file: { },  当前操作的文件对象。
      fileList: [ ],  当前的文件列表。
      event: { },  上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持。
    }
   * @param fileList
   */
  handleChange = async ({file, fileList, event}) => {
    //console.log('handleChange()', file, fileList, event)
    this.setState({fileList})
    /*
    file对象的属性
    {
      uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
      name: 'xx.png'   // 文件名
      status: 'done', // 状态有：uploading done error removed
      response: '{"status": "success"}', // 服务端响应内容
      linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
    }
    */
    //一旦上传成功，把当前的file的属性进行修正(name,url)
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('图片上传成功！')
        const {fileName, fileUrlSuffix} = result.data
        //取出数组里的最后一个file
        file = fileList[fileList.length - 1]
        file.name = fileName
        file.url = fileUrlSuffix
      } else {
        message.error('图片上传失败！')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImage(file.name)
      if (result.status === 0) {
        message.success('图片删除成功！')
      } else {
        message.error('图片删除失败！')
      }
    }
  }

  /**
   * 获取所有的已上传图片文件名的数组
   */
  getImgs = () => {
    return this.state.fileList.map(o => o.name)
  }

  render() {
    const {previewVisible, previewImage, fileList} = this.state
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          //上传图片的接口地址
          action="/file/upload"
          accept="image/*"  //只接受图片格式
          listType="picture-card"  //上传图片列表样式 text, picture 和 picture-card
          name="file" //发到后台的文件参数名
          fileList={fileList} //所有已上传图片文件列表
          onPreview={this.handlePreview} //
          onChange={this.handleChange} //
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    )
  }
}

/**
 * 1.子组件的数据传递给父组件
 *   a.子组件调用父组件方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
 *   b.父组件调用子组件方法：在父组件中通过ref得到子组件标签对象，调用其方法
 *    分三步：
 *    - 创建容器：在父组件的构造函数中创建用来保存ref标识的标签对象容器
 *      this.pw = React.createRef()
 *    - 附加到容器里：通过ref属性附加到React元素上，自动会把PicturesWall实例塞到pw容器里
 *      <PicturesWall ref={this.pw}/>
 *    - 访问Refs:通过current属性
 *      const node = this.pw.current
 */

