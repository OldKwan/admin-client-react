import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
    baseURL: '/'
})

request.interceptors.request.use(
    config => {
        return config
    },
    err => {
        return err
    }
)

request.interceptors.response.use(
    response => {
        if (response.data.status === 0) {
            return response
        } else {
            message.error('错误: '+response.data.msg)
            return response
        }
    },
    err => {
        console.dir(err);
        if (err.response.status === 500) {
            window.location.href = '/login'
            message.error('服务器炸了: '+err.message)
        } else {
            message.error('请求失败: '+err.message)
        }
        return err
    }
)

export default request
