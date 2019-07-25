import React from 'react'
import {Upload, Icon, Modal} from 'antd';

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
  state = {
    previewVisible: false,  //标识是否大图预览
    previewImage: '', //大图的URL
    //图片列表
    fileList: [
      {
        uid: '-1', // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: 'image.png', // 文件名
        status: 'done', // 状态有：uploading done error removed
        response: '{"status": "success"}', // 服务端响应内容
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
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
  handleChange = ({file, fileList, event}) => {
    console.log('handleChange()', file, fileList, event)
    this.setState({fileList})
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
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          accept="image/*"  //只接受图片格式
          listType="picture-card"  //上传图片列表样式 text, picture 和 picture-card
          name="image" //发到后台的文件参数名
          fileList={fileList} //所有已上传图片文件列表
          onPreview={this.handlePreview} //
          onChange={this.handleChange} //
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    )
  }
}

