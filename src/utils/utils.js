/*
  格式化日期
*/
export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return date.getFullYear() + '-' + ((date.getMonth() + 1) + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
        + ' ' + (date.getHours() + '').padStart(2, '0') + ':' + (date.getMinutes() + '').padStart(2, '0') + ':' + (date.getSeconds() + '').padStart(2, '0')
}