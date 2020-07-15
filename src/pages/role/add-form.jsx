import React, { Component } from 'react'
import {
  Form,
  Input,
} from 'antd'

const Item = Form.Item
const FormItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 16},
}

class AddForm extends Component {
  render() {
    return (
      <Form>
        <Item label="role name" {...FormItemLayout}>
          <Input type="text" placeholder="please enter role name" />
        </Item>
      </Form>
    )
  }
}

export default AddForm;