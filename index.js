const state = {
    movies: [],
    movie: null,
    keyword: ["upcoming", "popular", "top_rated"]

}



const header = document.createElement(`header`)
const footer = document.createElement(`footer`)
const main = document.createElement('main')
const body = document.querySelector(`body`)


// Server Functions
function getData(keyword) {
    return fetch(`http://api.themoviedb.org/3/movie/${keyword}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function (resp) {
        return resp.json()
    })
}

// Get Single Movie Information
function getSingleMovieData(movieID) {
    return fetch(`http://api.themoviedb.org/3/movie/${movieID}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function (resp) {
        return resp.json()
    })
}


// Update state.movies for each keyword on get Data and then render the Main Sections for each keyword
function updateState(keyword) {
    return getData(keyword).then(function (item) {
        state.movies = item.results

    }).then(() => {
        main.append(renderMainSections(keyword))
    })
}

// Update State Single Movie ID from Server
function getSingleMovieInfo(movieID) {
    getSingleMovieData(movieID).then(function (item) {
        state.movie = item
    }).then(() => {
        render()
    })

}

// Render Functions 
// Render Movies List
function renderMoviesList(movie) {
    const movieLiEl = document.createElement('li')
    const movieTitle = document.createElement('h3')
    const moviePoster = document.createElement(`img`)
    moviePoster.setAttribute(`class`, `smallPosters`)
    moviePoster.setAttribute(`src`, `https://image.tmdb.org/t/p/w500${movie.poster_path}`)

    movieTitle.textContent = movie.title

    movieLiEl.append(moviePoster, movieTitle)

    movieLiEl.addEventListener('click', () => {
        getSingleMovieInfo(movie.id)
    })

    return movieLiEl
}

// Render Header

function renderHeader() {
    header.innerHTML = ``
    const divEl = document.createElement(`div`)
    const logo = document.createElement(`h1`)
    logo.setAttribute(`class`, `logo`)
    logo.textContent = `GOVIE MEEKS`
    divEl.append(logo)
    header.append(divEl)
}

// Render Main Sections
function renderMainSections(keyword) {
    const sectionEl = document.createElement('section')

    const sectionTitle = document.createElement('h1')
    sectionTitle.setAttribute('class', 'section-title')

    if (keyword === "popular") {
        sectionTitle.textContent = "Popular"
    }
    if (keyword === "upcoming") {
        sectionTitle.textContent = "Upcoming"
    }
    if (keyword === "top_rated") {
        sectionTitle.textContent = "Top Rated"
    }

    const ulEl = document.createElement('ul')

    for (const movie of state.movies) {
        ulEl.append(renderMoviesList(movie))
    }
    sectionEl.append(sectionTitle, ulEl)

    return sectionEl
}


// Render Single Movie
function renderSingleMovie(movie) {
    const divEl = document.createElement(`div`)
    divEl.setAttribute(`class`, `infoGroup`)
    const articleEl = document.createElement('article')
    articleEl.setAttribute(`class`, `singleMovie`)
    const moviePoster = document.createElement('img')
    moviePoster.setAttribute(`class`, `infoPoster`)
    moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`)

    moviePoster.addEventListener(`click`, function () {
        moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`)
    })

    const movieInfo = document.createElement('div')
    movieTitle = document.createElement('h1')
    movieTitle.setAttribute(`class`, `movieTitle`)
    movieTitle.textContent = movie.title
    movieInfo.append(movieTitle)

    const secondArticle = document.createElement(`article`)
    secondArticle.setAttribute(`class`, `movieData`)

    const releaseDate = document.createElement(`h3`)
    releaseDate.textContent = `Release Date: ${movie.release_date}`

    const voteAverage = document.createElement(`h3`)
    voteAverage.textContent = `Vote Average: ${movie.vote_average}`

    const runTime = document.createElement(`h3`)
    runTime.textContent = `Runtime: ${movie.runtime} min`

    const plot = document.createElement(`h3`)
    plot.setAttribute(`class`, `plot`)
    plot.textContent = `Plot:`

    const overview = document.createElement(`p`)
    overview.textContent = movie.overview


    articleEl.append(moviePoster)
    secondArticle.append(movieInfo, releaseDate, voteAverage, runTime, plot, overview)
    divEl.append(articleEl, secondArticle)
    main.append(divEl)
}

// Render Main depending on state and state.keyword
function renderMain() {
    main.innerHTML = ""

    if (!state.movie) {
        for (const keyword of state.keyword) {
            updateState(keyword)
        }
    } else {
        main.append(renderSingleMovie(state.movie))
        main.lastChild.remove()
    }

}

function render() {
    body.innerHTML = ""
    renderHeader()
    renderMain()
    body.append(header, main, footer)
}

function init() {
    render()

    // setTimeout(function() {
    //     render()
    // }, 2000)

}
init()