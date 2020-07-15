import jsonp from 'jsonp'
import {message} from 'antd'
import request from './setUp'
import qs from 'qs'

// 登录
export const post_login = (data) => (
    request.post('/login', data)
)

// 获取天气信息
export const jsonp_weather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气信息失败')
                reject(err)
            }
        })
    })
}

// 分类
export const get_categoryList = (data) => (
    request.get(`/manage/category/list?parentId=${data.parentId}`)
)

export const post_addCategory = (data) => (
    request.post('/manage/category/add', data)
)

export const post_editCategory = (data) => (
    request.post('/manage/category/update', data)
)

// product
export const get_cateById = (data) => (
    request.get('/manage/category/info', {params: {...data}})
)
export const post_ProductList = (data) => (
    request.get(`/manage/product/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`)
)
export const get_searchProduct = (data) => (
    request.get('/manage/product/search', {params: {...data}})
)
export const post_updateProductStatus = (data) => (
    request.post('/manage/product/updateStatus', data)
)
export const post_removedPic = (data) => (
    request.post('/manage/img/delete', data)
)

// role module
export const post_addRole = (data) => (
    request.post('/manage/role/add', data)
)
export const get_getRole = () => (
    request.get('/manage/role/list')
)
export const post_updateRole = (data) => (
    request.post('/manage/role/update', data)
)
