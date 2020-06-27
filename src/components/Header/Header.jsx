import React, { Component } from 'react'

import {
    jsonp_weather,
} from '@/api'
import {
    formateDate,
} from '@/utils/utils'
import storage from '@/storage'

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
    }

    componentDidMount() {
        this.caculaTime()
        this.loadJsonpWeather()
    }

    caculaTime = () => {
        setInterval(() => {
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

    render() {
        const {
            dayPictureUrl,
            weather,
            currentData,
            username,
        } = this.state
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <a href="#">退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">首页</div>
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
