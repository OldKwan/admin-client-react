import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom'

import CONFIG from '@/config'
import logo from '@/assets/images/logo.png'
import {
    post_login,
} from '@/api'
import storage from '@/storage'


import './login.less'

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onFinish = values => {
        this.loadLogin({...values})
    };

    loadLogin = async ({username, password}) => {
        try {
            const {data} = await post_login({
                username,
                password,
            })
            if (data.data && data.status === CONFIG.SUCCESS_CODE) {
                message.success('登录成功!')
                storage.saveUser(data.data)
                this.props.history.replace('/')
            }
        } finally {

        }
        
    }

    render() {
        const user = storage.getUser()
        if (user && user._id) {
            return <Redirect to="/" />
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '用户名必填' },
                                { max: 12, message: '用户名不可大于12位' },
                                { min: 4, message: '用户名不可小于4位' },
                                { pattern: /^[a-zA-Z0-9]+$/, message: '用户名不可含非法符号' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '密码必填' },
                                { max: 12, message: '密码不可大于12位' },
                                { min: 4, message: '密码不可小于4位' },
                                { pattern: /^[a-zA-Z0-9]+$/, message: '密码不可含非法符号' },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                                Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}

export default login
