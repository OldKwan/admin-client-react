import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Select,
    Button,
    message,
} from 'antd'
import {
    LeftOutlined,
} from '@ant-design/icons'
import LinkButton from '@/components/LinkButton'

const { Item } = Form
const { TextArea } = Input
const { Option } = Select

const checkPrice = (rule, value) => {
    console.log(value);
    if (value > 0) {
      return Promise.resolve();
    }

    return Promise.reject('Price must be greater than zero!');
};

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
}
const rules = {
    pName: [
        { required: true, message: 'Please input product name!' },
    ],
    desc: [
        { required: true, message: 'Please input product description!' },
    ],
    price: [
        { required: true, message: 'Please input product price!' },
        { validator: checkPrice },
    ],
}


class AddUpdate extends Component {

    onFinish = vals => {
        console.log(vals);
    }

    onFinishFailed = err => {
        message.error(err.errorFields[0].errors[0])
    }

    render() {
        const title = (
            <span>
                <LinkButton>
                    <LeftOutlined style={{ marginRight: 10, color: '#1da57a' }} onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span>Product Detail</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form {...formLayout} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                    <Item label="Product Name" name="pName" rules={rules.pName}>
                        <Input placeholder="enter product name" />
                    </Item>
                    <Item label="Product Desc" name="desc" rules={rules.desc}>
                        <TextArea placeholder="enter product description" autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item label="Product Price" name="price" rules={rules.price}>
                        <Input placeholder="enter product price" addonAfter="RMB" />
                    </Item>
                    <Item label="Product Category" name="category">
                        <Select value="0">
                            <Option value="0">111</Option>
                            <Option value="1">222</Option>
                        </Select>
                    </Item>
                    <Item label="Product Pictures" name="pic">
                        <Input />
                    </Item>
                    <Item label="Product Detail" name="detail">
                        <Input />
                    </Item>
                    <Button type="primary" htmlType="submit">
                        submit
                    </Button>
                </Form>
            </Card>
        );
    }
}

export default AddUpdate;