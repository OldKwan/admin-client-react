import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import icoERR from '@/assets/images/err.png'
import {
    post_removedPic
} from '@/api'
import CONFIG from '@/config'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  componentWillMount() {
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
        this.setState({
            fileList: imgs.map((item, index) => ({
                uid: -(index + 1),
                name: item,
                urlName: item,
                status: 'done',
                url: CONFIG.BASE_IMG_URL + item,
            }))
        })
    }
  }
  
  getPics = () => {
    return this.state.fileList.map(item => item.urlName)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (file.status === 'error') {
        message.error('upload error')
        return
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async ({file, fileList }) => {
    if (file.status === 'done') {
        if (file.response.status === 0) {
            message.success('upload success!')
            this.setState({
                fileList: fileList.map(item => ({
                    ...item,
                    url: item.response && item.response.data && item.response.data.url,
                    urlName: item.response && item.response.data && item.response.data.name,
                }))
            })
        } else {
            message.error('upload error')
        }
    } else if (file.status === 'removed') {
        const { data } = await post_removedPic({
            name: file.urlName
        })
        if (data.status === 0) {
            message.success('removed success!')
            this.setState({
                fileList,
            })
        } else {
            message.error('removed error')
        }
    } else { // 處理 uploading
        this.setState({
            fileList,
        })
    }
    // this.setState({
    //     fileList: fileList.map(item => {
    //         if (item.status === 'error') {
    //             return {
    //                 ...item,
    //                 url: icoERR,
    //                 thumbUrl: icoERR,
    //             }
    //         } else {
    //             return {
    //                 ...item,
    //                 url: item.response && item.response.data && item.response.data.url
    //             }
    //         }
    //     })
    // })
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          accept="image/*"
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall
