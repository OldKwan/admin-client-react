import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class RichTextEditor extends Component {
  constructor(props) {
    super(props)
    const detail = this.props.detail
    let editorState
    if (detail) {
      const blocksFromHtml = htmlToDraft(detail);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      editorState = EditorState.createWithContent(contentState);
    } else {
      editorState = EditorState.createEmpty()
    }
    this.state = {
      editorState,
    }
  }
  

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  // get rich text content
  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{height: 250, border: '1px solid #F1F1F1', padding: '0 10px'}}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

export default RichTextEditor
