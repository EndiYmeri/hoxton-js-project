const state = {
    movies: [],
    movie: null,
    keyword: ["upcoming", "popular", "top_rated"],
    signedIn: false,
    user: {},
}

const header = document.createElement(`header`)
const footer = document.createElement(`footer`)
const main = document.createElement('main')
const body = document.querySelector(`body`)


// Server Functions
function getData(keyword) {
    return fetch(`http://api.themoviedb.org/3/movie/${keyword}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}


function getUsers() {
    return fetch('http://localhost:3000/users').then((resp) => {
        console.log(resp.users)
        return resp.json();
    })

}

function checkIfUserExists(username, pass) {
    let userExists = false

    getUsers().then((resp) => {
        let respArray = [...resp]

        respArray.forEach((user) => {
            if (user.userName === username && user.password === pass) {
                userExists = true
                console.log("User Exists:" + user.userName + " with password: " + user.password)
            }
        })

        if (!userExists) {
            addUserToDB(addNewUser(username, pass))
        }
    })
}


function addNewUser(userName, password) {
    let user = {}
    user.userName = userName
    user.password = password
    user.minutesWatched = 0

    state.user = user
    return user
}


function addUserToDB(user) {

    fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            userName: user.userName,
            password: user.password,
            minutesWatched: user.minutesWatched
        })
    })
}

function updateUserInfo(id, minutes) {
    return fetch(`http://localhost:3000/users${id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            minutesWatched: minutes
        })
    })
}

// Get Single Movie Information
function getSingleMovieData(movieID) {
    return fetch(`http://api.themoviedb.org/3/movie/${movieID}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}


// Update state.movies for each keyword on get Data and then render the Main Sections for each keyword
function updateState(keyword) {
    getData(keyword).then(function(item) {
        state.movies = item.results

    }).then(() => {
        main.append(renderMainSections(keyword))
    })
}

// Update State Single Movie ID from Server
function getSingleMovieInfo(movieID) {
    getSingleMovieData(movieID).then(function(item) {
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

    const accountDiv = document.createElement('div')
    accountDiv.setAttribute('class', 'account-info')

    header.append(divEl, accountDiv)
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

    moviePoster.addEventListener(`click`, function() {
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

function renderSignInModal() {
    const modalDiv = document.createElement('div')
    modalDiv.setAttribute('class', 'modal')

    const modalTitle = document.createElement('h2')


    if (!state.signedIn) {
        modalTitle.textContent = "SIGN IN"
        const formEl = document.createElement('form')
        const inputNameEl = document.createElement('input')
        inputNameEl.setAttribute('type', 'text')
        inputNameEl.setAttribute('name', 'username')
        inputNameEl.setAttribute('placeholder', 'Write username')

        const inputPasswordEl = document.createElement('input')
        inputPasswordEl.setAttribute('type', 'password')
        inputPasswordEl.setAttribute('name', 'password')
        inputPasswordEl.setAttribute('placeholder', 'Write password')

        const signInButton = document.createElement('button')
        signInButton.setAttribute('type', 'submit')
        signInButton.setAttribute('class', 'button sign-in-button')
        signInButton.textContent = "SIGN IN"

        formEl.addEventListener('submit', (e) => {
            e.preventDefault()
            state.signedIn = true
            checkIfUserExists(inputNameEl.value, inputPasswordEl.value)
            render()
        })

        formEl.append(inputNameEl, inputPasswordEl, signInButton)
        modalDiv.append(modalTitle, formEl)

    } else {
        modalTitle.textContent = "SIGN OUT"

        const signOutP = document.createElement('p')
        signOutP.textContent = `Hello ${state.user.userName}, would you like to sign out?`

        const signOutButton = document.createElement('button')
        signOutButton.setAttribute('class', 'button sign-out-button')
        signOutButton.textContent = "SIGN OUT"
        signOutButton.addEventListener('click', () => {
            state.signedIn = false
            render()
        })
        modalDiv.append(modalTitle, signOutP, signOutButton)
    }

    body.append(modalDiv)
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
}
init()