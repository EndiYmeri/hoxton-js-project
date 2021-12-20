const state = {
    movies: [],
    movie: null,
    keyword: "upcoming"
}





function getData(keyword) {

    return fetch(`http://api.themoviedb.org/3/movie/${keyword}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function (resp) {
        return resp.json()
    })
}


function getSingleMovieData(movieID) {
    return fetch(`http://api.themoviedb.org/3/movie/${movieID}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function (resp) {
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

    for (const movie of state.movies) {
        const movieLiEl = document.createElement('li')
        const movieTitle = document.createElement('h2')

        movieTitle.textContent = movie.title

        movieLiEl.append(movieTitle)

        movieLiEl.addEventListener('click', () => {
            getSingleMovieInfo(movie.id)
            render()
        })

        ulEl.append(movieLiEl)
    }

    return ulEl
}


function renderSingleMovie(movie) {
    const articleEl = document.createElement('article')

    const moviePoster = document.createElement('img')

    moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`)

    const movieInfo = document.createElement('div')
    movieTitle = document.createElement('h1')
    movieTitle.textContent = movie.title

    movieInfo.append(movieTitle)

    articleEl.append(moviePoster, movieInfo)
    return articleEl
}


const header = document.createElement(`header`)


const footer = document.createElement(`footer`)

const body = document.querySelector(`body`)


function renderMain() {
    const main = document.createElement(`main`)

    if (!state.movie) {
        main.append(movieList())
    }
    else {
        main.append(renderSingleMovie(state.movie))
    }

    return main
}



function getSingleMovieInfo(movieID) {
    getSingleMovieData(movieID).then(function (item) {
        state.movie = item
    })
}


function render() {
    body.innerHTML = ``
    body.append(header, renderMain(), footer)
}




function init() {
    getData(state.keyword).then(function (item) {
        state.movies = item.results
    })

    setTimeout(function () {
        render()
    }, 300)

}
init()



