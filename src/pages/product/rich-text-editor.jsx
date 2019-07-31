import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {EditorState, convertToRaw,ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/**
 * 富文本编辑器
 */
export default class RichTextEditor extends Component {

  state = {
    //创建一个没有内容的编辑对象
    editorState: EditorState.createEmpty(),
  }

  /**
   * 验证接收到父组件数据类型
   * @type {{content: shim}}
   */
  static propTypes = {
    content: PropTypes.string
  }

  constructor(props) {
    super(props)
    const html = this.props.content
    if(html){
      //
      const contentBlocks = htmlToDraft(html)
      const sampleEditorContent = ContentState.createFromBlockArray(contentBlocks)
      const editorState = EditorState.createWithContent(sampleEditorContent)
      this.state = {
        editorState:editorState,
      }
    }else{
      this.state = {
        //创建一个没有内容的编辑对象
        editorState: EditorState.createEmpty(),
      }
    }
  }


  /**
   * 获取当前的输入内容，供父组件调用
   */
  getContent = () => {
    //返回带有HTML格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  /**
   * 输入过程中实时回调
   * @param editorState
   */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const {editorState} = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border: '1px solid #ccc', minHeight: 200, paddingLeft: 10}}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    )
  }
}
