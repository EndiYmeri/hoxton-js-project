const state = {
    movies: [],
    keyword: "latest"
}





function getData(keyword) {

    return fetch(`http://api.themoviedb.org/3/movie/${keyword}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}

function getPopularMovies() {
    let popular = "popular"
    getData(popular)
    state.keyword
    render()
}


function movieList() {
    const ulEl = document.createElement('ul')
    ulEl.innerHTML = ``

    for (const movie of state.movies) {
        const movieLiEl = document.createElement('li')
        const movieTitle = document.createElement('h2')

        movieTitle.textContent = movie.title

        movieLiEl.append(movieTitle)
        ulEl.append(movieLiEl)
    }
    return ulEl
}

const header = document.createElement(`header`)

const main = document.createElement(`main`)

const footer = document.createElement(`footer`)




function render() {

    document.body.innerHTML = ""
    main.append(movieList())
    document.body.append(header, main, footer)

}


render()

function init() {
    getData(state.keyword).then(function(item) {
        state.movies = item
    })
    render()
}
init()