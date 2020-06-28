import React, { Component } from 'react'
import {Modal} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
    jsonp_weather,
} from '@/api'
import {
    formateDate,
} from '@/utils/utils'
import storage from '@/storage'
import {
    menuList,
} from '@/config/menuConfig.js'

import './Header.less'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dayPictureUrl: '',
            weather: '',
            currentData: formateDate(new Date().getTime()),
            username: storage.getUser().username,
        }
        this.title = ''
        this.timeId = null
    }

    componentDidMount() {
        this.caculaTime()
        this.loadJsonpWeather()
    }

    componentWillUnmount() {
        clearInterval(this.timeId)
    }

    caculaTime = () => {
        this.timeId = setInterval(() => {
            const currentData = formateDate(new Date().getTime())
            this.setState({
                currentData,
            })
        }, 1000);
    }

    loadJsonpWeather = () => {
        jsonp_weather('深圳').then(({
            dayPictureUrl,
            weather,
        }) => {
            this.setState({
                dayPictureUrl,
                weather,
            })
        })
    }

    getTitle = (arr) => {
        const path = window.location.pathname
        arr.forEach(item => {
            if (!item.children) {
                item.key === path && (this.title = item.title)
            } else {
                this.getTitle(item.children)
            }
        })
    }

    handleLogout = () => {
        const that = this
        Modal.confirm({
            title: '登出',
            icon: <ExclamationCircleOutlined />,
            content: '是否确认登出?',
            onOk() {
                storage.removeUser()
                that.props.history.replace('/login')
            },
          });
    }
    
    render() {
        const {
            dayPictureUrl,
            weather,
            currentData,
            username,
        } = this.state
        this.getTitle(menuList)
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <a href="#" onClick={this.handleLogout}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{this.title}</div>
                    <div className="header-bottom-right">
                        <span>{currentData}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header
