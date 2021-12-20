const state = {
    movies: []
}

const header = document.createElement(`header`)

const main = document.createElement(`main`)

const footer = document.createElement(`footer`)

document.body.append(header, main, footer)

function getData() {
    return fetch('http://api.themoviedb.org/3/movie/popular?api_key=713b8a6c62fe6832204cde2d50900308').then(function (resp) {
        return resp.json()
    })
}

function getState() {
    getData().then(function (item) {
        state.movies = item
        render()
    })
}

function render() {

}

getState()

render()

