import React, { Component } from 'react'
import {
  Form,
  Input,
  message,
} from 'antd'
import {
  post_addRole,
} from '@/api'
import CONFIG from '@/config'

const Item = Form.Item
const FormItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 16},
}
const rules = {
  roleName: [
      { required: true, message: 'Please input role name!' },
  ],
}

class AddForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      roleName: '',
    }
  }
  componentDidMount() {
    this.props.setRef && this.props.setRef(this.formRef)
  }

  loadAddRole = async (roleName) => {
    if (!roleName) return
    const {
      onClose,
    } = this.props
    const { data } = await post_addRole({roleName})
    if (data.status === CONFIG.SUCCESS_CODE && data.data) {
      message.success('新增角色成功!')
      this.formRef && this.formRef.resetFields()
      onClose()
    } else {
        message.error('加載角色列表失敗!')
    }
  }

  onFinishFailed = err => {
    console.log(err);
    message.error(err.errorFields[0].errors[0])
  }

  onFinish = async (vals) => {
    console.log(vals);
    this.loadAddRole(vals.roleName)
  }
  
  render() {
    const {
      roleName,
    } = this.state
    return (
      <Form
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        initialValues={{
          roleName,
        }}
        ref={ref => this.formRef = ref}
      >
        <Item label="role name" {...FormItemLayout} name="roleName" rules={rules.roleName}>
          <Input type="text" placeholder="please enter role name" />
        </Item>
      </Form>
    )
  }
}

export default AddForm;