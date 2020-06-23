import history from './history'

export const push = (path = '/', data) => {
    history.push(path, data)
}

export const replace = (path = '/', data) => {
    history.replace(path, data)
}

export const goBack = () => {
    history.goBack()
}

