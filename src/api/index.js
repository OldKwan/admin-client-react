import request from './setUp'

export const post_login = (data) => (
    request.post('/login', data)
)