const state = {
    movies: [],
    singleMovie: {
        movie: null
    },
    keyword: ["upcoming", "popular", "top_rated"],
    signedIn: false,
    showMyMovies: false,
    user: {},
    searchTerm: "",
}

const header = document.createElement(`header`)
const footer = document.createElement(`footer`)
const main = document.createElement('main')
const body = document.querySelector(`body`)



// Server Functions
// Get data from server on that keyword
function getData(keyword, page) {
    return fetch(`http://api.themoviedb.org/3/movie/${keyword}?api_key=713b8a6c62fe6832204cde2d50900308&page=${page}`).then(function(resp) {
        return resp.json()
    })
}

function getSearchedMovies(searchTerm) {
    return fetch(`http://api.themoviedb.org/3/search/movie/${searchTerm}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}

// Get Single Movie Information
function getSingleMovieData(movieID) {
    return fetch(`http://api.themoviedb.org/3/movie/${movieID}?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}

// Get Similar Movies
function getSimilarMovies(movieID) {
    return fetch(`http://api.themoviedb.org/3/movie/${movieID}/similar?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}

// Get Behind The Scenes
function getBehindTheScenesData(movieID) {
    return fetch(`http://api.themoviedb.org/3/movie/${movieID}/videos?api_key=713b8a6c62fe6832204cde2d50900308`).then(function(resp) {
        return resp.json()
    })
}

// Get users from our DB
function getUsers() {
    return fetch('http://localhost:3000/users').then((resp) => {
        return resp.json();
    })

}

// Adding new user to db
function addUserToDB(user) {
    return fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            userName: user.userName,
            password: user.password,
            minutesWatched: user.minutesWatched,
            moviesWatched: user.moviesWatched,
            watchLater: user.watchLater
        })
    })
}

// Deleting user from db
function deleteAccount(user) {
    fetch(`http://localhost:3000/users/${user.id}`, {
        method: "DELETE",
    })

}


// Check if user exsists or not, then create user if not and add the user to state.user 
function checkIfUserExists(username, pass) {
    let userExists = false
    return getUsers().then((resp) => {
        let respArray = [...resp]

        respArray.forEach((user) => {
            if (user.userName === username && user.password === pass) {
                userExists = true
                state.user = user
            }
        })

        if (!userExists) {
            addUserToDB(addNewUser(username, pass)).then(() => {
                checkIfUserExists(username, pass)
            })
        }
    }).then(() => {
        render()
    })
}

// Updating user info on db
function updateUserInfo(user) {
    return fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            minutesWatched: user.minutesWatched,
            moviesWatched: user.moviesWatched,
            watchLater: user.watchLater
        })
    })
}

// Update state.movies for each keyword on get Data and then render the Main Sections for each keyword
function getMainMoviesInfo(keyword) {
    // state.movies = []
    getData(keyword, 1).then(function(item) {
        return state.movies = item.results
    }).then(() => {
        main.append(renderMainSections(keyword))
    })
}

// Update State Single Movie ID from Server 
function getSingleMovieInfo(movieID) {
    getSingleMovieData(movieID).then(function(item) {
        state.singleMovie.movie = item
    }).then(() => {
        render()
    })

}

// Helper functions
// Go home function to clear some things
function goHome() {
    state.singleMovie = {
        movie: null
    }
    state.searchTerm = ""
    state.showMyMovies = false
    render()
}

// Change the state for when we search something
function search(word) {
    state.singleMovie = {
        movie: null
    }
    state.showMyMovies = false
    state.searchTerm = word
    render()
}

// Change the state for when we want to want to watch our movies
function myMovies() {
    state.singleMovie = {
        movie: null
    }
    state.searchTerm = ""
    state.showMyMovies = true
    render()
}

// Creating new user 
function addNewUser(userName, password) {
    let user = {}
    user.userName = userName
    user.password = password
    user.minutesWatched = 0
    user.moviesWatched = []
    user.watchLater = []

    return user
}

// Calculate how much time we wasted watching movies
function calculateMinutesWatched() {
    state.user.minutesWatched = 0
    for (const movie of state.user.moviesWatched) {
        state.user.minutesWatched += movie.runtime
    }
}

// Add a movie to movies watched
function addMovieToMoviesWatched(movie) {
    state.user.moviesWatched.push(movie)
    calculateMinutesWatched()
    updateUserInfo(state.user)
}

// Remove a movie from movies watched
function removeMovieFromMoviesWatched(movieToBeRemoved) {
    state.user.moviesWatched = state.user.moviesWatched.filter((movie) => {
        return movie.title !== movieToBeRemoved.title
    })
    calculateMinutesWatched()
    updateUserInfo(state.user)
}

// Add a movie to watch later 
function addMovieToWatchLater(movie) {
    state.user.watchLater.push(movie)
    updateUserInfo(state.user)
}

// Remove e movie from watch later
function removeMovieFromWatchLater(movie) {
    state.user.watchLater = state.user.watchLater.filter((movie) => {
        return movie !== movie
    })
    updateUserInfo(state.user)

}

// Render Functions 
// Render my Movies watched and watch later 
function renderMyMovies() {

    const myMoviesDiv = document.createElement('div')

    if (state.user.moviesWatched.length > 0) {
        const ulEl = document.createElement('ul')
        const sectionTitle = document.createElement('h1')
        sectionTitle.setAttribute('class', 'section-title')
        sectionTitle.textContent = "Movies Watched"

        for (const movie of state.user.moviesWatched) {
            ulEl.append(renderMoviesList(movie))
        }
        myMoviesDiv.append(sectionTitle, ulEl)
    }

    if (state.user.watchLater.length > 0) {
        const ulEl = document.createElement('ul')
        const sectionTitle = document.createElement('h1')
        sectionTitle.setAttribute('class', 'section-title')
        sectionTitle.textContent = "Watch Later"
        for (const movie of state.user.watchLater) {
            ulEl.append(renderMoviesList(movie))
        }
        myMoviesDiv.append(sectionTitle, ulEl)
    }

    return myMoviesDiv
}

// Render a ul with similiar movies of that movie 
function renderSimilarMovies(movieID) {
    const ulEl = document.createElement('ul')
    getSimilarMovies(movieID).then(function(item) {
        state.singleMovie.similar = item.results
    }).then(() => {
        for (const similarMovie of state.singleMovie.similar) {
            ulEl.append(renderMoviesList(similarMovie))
        }
    })
    return ulEl
}

// Render the behind the scenes videos of that movie
function renderBehindTheScenes(movieID) {
    const ulEl = document.createElement('ul')
    getBehindTheScenesData(movieID).then(function(item) {
        state.singleMovie.behind = item.results
    }).then(() => {
        for (const behind of state.singleMovie.behind) {
            ulEl.append(renderBehindTheSceneElement(behind))
        }
    })
    return ulEl
}

// Render each li for the behind the scenes function
function renderBehindTheSceneElement(theScene) {
    const liEL = document.createElement('li')
    const video = document.createElement('div')

    video.innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${theScene.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
        // <iframe width="560" height="315" src="https://www.youtube.com/embed/Ylufh8C79BI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    liEL.append(video)
    return liEL
}

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
    logo.textContent = `GOVIE\r\nMEEKS`
    logo.addEventListener('click', () => {
        goHome()
    })
    divEl.append(logo)

    const searchForm = document.createElement(`form`)
    searchForm.setAttribute(`class`, `search-form`)

    const searchEl = document.createElement(`input`)
    searchEl.setAttribute(`type`, `text`)
    searchEl.setAttribute(`class`, `search-el`)
    searchEl.setAttribute(`placeholder`, `Search...`)

    const submitEl = document.createElement(`input`)
    submitEl.setAttribute(`type`, `submit`)
    submitEl.setAttribute(`value`, `Search`)
    submitEl.setAttribute(`class`, `submit-btn`)

    searchForm.append(searchEl, submitEl)
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
        search(searchEl.value)
    })

    const accountDiv = document.createElement('div')
    accountDiv.setAttribute('class', 'account-info')
    if (state.signedIn) {
        const helloEl = document.createElement('h3')
        helloEl.setAttribute(`class`, `hello-user`)

        helloEl.textContent = `Welcome, ${state.user.userName}!`

        const afterSignIn = document.createElement(`div`)
        afterSignIn.setAttribute(`class`, `after-signin`)

        const afterMoviesAndMinutes = document.createElement(`div`)
        afterMoviesAndMinutes.setAttribute(`class`, `after-movies`)

        const timeWatched = document.createElement(`p`)
        timeWatched.setAttribute(`class`, `time-watched`)
        timeWatched.textContent = `You have watched: ${state.user.minutesWatched} min`

        const moviesWatched = document.createElement(`p`)
        moviesWatched.setAttribute(`class`, `movies-watched-el`)
        moviesWatched.textContent = `Movies Watched: ${state.user.moviesWatched.length}`

        helloEl.addEventListener('click', () => {
            renderSignInModal()
        })

        afterMoviesAndMinutes.append(timeWatched, moviesWatched)
        afterSignIn.append(helloEl, afterMoviesAndMinutes)
        accountDiv.append(afterSignIn)

    } else {
        const signInButton = document.createElement('button')
        signInButton.setAttribute('class', 'button sign-in-button')
        signInButton.textContent = "SIGN IN"
        signInButton.addEventListener('click', () => {
            renderSignInModal()
        })
        accountDiv.append(signInButton)
    }

    // accountDiv.append()
    header.append(divEl, searchForm, accountDiv)
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

    if (!state.searchTerm) {
        for (const movie of state.movies) {
            ulEl.append(renderMoviesList(movie))
        }
        sectionEl.append(sectionTitle, ulEl)
    } else {
        state.movies = state.movies.filter((element) => {
            return element.title.toUpperCase().includes(state.searchTerm.toUpperCase())
        })
        for (const movie of state.movies) {
            ulEl.append(renderMoviesList(movie))
        }
        sectionEl.append(sectionTitle, ulEl)
    }

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

    let backdrop = false
    moviePoster.addEventListener(`click`, function() {
        if (backdrop) {
            moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
            backdrop = !backdrop
        } else {
            moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`)
            backdrop = !backdrop
        }
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

    if (state.signedIn) {
        const addToMoviesWatchedButton = document.createElement('button')
        addToMoviesWatchedButton.setAttribute('class', 'add-to-movies-watched-button')
        addToMoviesWatchedButton.textContent = "Add to Watched Movies"


        for (const watchedMovie of state.user.moviesWatched) {
            if (watchedMovie.title === movie.title) {
                addToMoviesWatchedButton.textContent = "Remove from Watched Movies"
                addToMoviesWatchedButton.classList.toggle(`btn-activate`)
            }
        }

        addToMoviesWatchedButton.addEventListener('click', (e) => {
            addToMoviesWatchedButton.classList.toggle(`btn-activate`)
            e.preventDefault()
            if (addToMoviesWatchedButton.textContent === "Add to Watched Movies") {
                addToMoviesWatchedButton.textContent = "Remove from Watched Movies"

                addMovieToMoviesWatched(movie)
            } else {
                addToMoviesWatchedButton.textContent = "Add to Watched Movies"
                removeMovieFromMoviesWatched(movie)
            }
            render()
        })



        const addToWatchLaterButton = document.createElement('button')
        addToWatchLaterButton.setAttribute('class', 'add-to-movies-watched-button')
        addToWatchLaterButton.textContent = "Watch Later"

        for (const watchLaterMovie of state.user.watchLater) {
            if (watchLaterMovie.title === movie.title) {
                addToWatchLaterButton.textContent = "Remove from watch later"
                addToWatchLaterButton.classList.toggle(`btn-activate`)
            }

        }

        addToWatchLaterButton.addEventListener('click', (e) => {
            addToWatchLaterButton.classList.toggle(`btn-activate`)
            e.preventDefault()
            if (addToWatchLaterButton.textContent === "Watch Later") {
                addToWatchLaterButton.textContent = "Remove from watch later"
                addMovieToWatchLater(movie)
            } else {
                addToWatchLaterButton.textContent = "Watch Later"
                removeMovieFromWatchLater(movie)
            }
        })


        secondArticle.append(addToMoviesWatchedButton, addToWatchLaterButton)
    }

    divEl.append(articleEl, secondArticle)

    const similarMoviesDiv = document.createElement('div')



    const similarTitle = document.createElement(`h2`)
    similarTitle.setAttribute(`class`, `similar-title`)
    similarTitle.textContent = `Similar Movies`

    const behindTheScenes = document.createElement('div')

    const behindTheScenesTitle = document.createElement(`h2`)
    behindTheScenesTitle.setAttribute(`class`, `behind-the-scenes`)
    behindTheScenesTitle.textContent = `Behind The Scenes and Trailers`


    similarMoviesDiv.append(similarTitle, renderSimilarMovies(movie.id))

    main.append(divEl, behindTheScenesTitle, renderBehindTheScenes(movie.id), similarMoviesDiv, behindTheScenes)
}

// Render sign in modal
function renderSignInModal() {
    const modal = document.querySelector('.modal')

    if (modal) {
        modal.remove()

    } else {
        const modalDiv = document.createElement('div')
        modalDiv.setAttribute('class', 'modal')
        const modalTitle = document.createElement('h2')

        const modalInner = document.createElement(`div`)
        modalInner.setAttribute(`class`, `modal-inner`)

        const closeButton = document.createElement('button')
        closeButton.setAttribute('class', 'button modal-close-button')
        closeButton.innerText = "X"

        closeButton.addEventListener('click', (e) => {
            e.preventDefault()
            const modal = document.querySelector('.modal')
            modal.remove()
        })


        modalInner.append(closeButton)
        modalDiv.append(modalInner)

        if (!state.signedIn) {
            modalTitle.textContent = "SIGN IN"
            const formEl = document.createElement('form')
            const inputNameEl = document.createElement('input')
            inputNameEl.setAttribute('type', 'text')
            inputNameEl.setAttribute('name', 'username')
            inputNameEl.setAttribute('required', '')
            inputNameEl.setAttribute('placeholder', 'Write username')

            const inputPasswordEl = document.createElement('input')
            inputPasswordEl.setAttribute('type', 'password')
            inputPasswordEl.setAttribute('name', 'password')
            inputPasswordEl.setAttribute('required', '')
            inputPasswordEl.setAttribute('placeholder', 'Write password')

            const signInButton = document.createElement('button')
            signInButton.setAttribute('type', 'submit')
            signInButton.setAttribute('class', 'button sign-in-button')
            signInButton.textContent = "SIGN IN"

            formEl.addEventListener('submit', (e) => {
                e.preventDefault()
                state.signedIn = true
                checkIfUserExists(inputNameEl.value, inputPasswordEl.value)
            })

            formEl.append(inputNameEl, inputPasswordEl, signInButton)
            modalInner.append(modalTitle, formEl)
            modalDiv.append(modalInner)

        } else {
            modalTitle.textContent = "SIGN OUT"

            const signOutP = document.createElement('p')
            signOutP.textContent = `Hello ${state.user.userName}, what would you like to do?`

            const accountButtonsDiv = document.createElement('div')

            const showMyMoviesButton = document.createElement('button')
            showMyMoviesButton.setAttribute(`class`, `show-my-movies`)
            showMyMoviesButton.textContent = "My Profile"
            showMyMoviesButton.addEventListener('click', () => {
                myMovies()
            })

            const deleteMyAccountButton = document.createElement('button')
            deleteMyAccountButton.setAttribute(`class`, `delete-account`)
            deleteMyAccountButton.textContent = "Delete account"
            deleteMyAccountButton.addEventListener('click', () => {
                deleteAccount(state.user)
                state.signedIn = false
                state.showMyMovies = false
                state.user = {}
                render()
            })

            accountButtonsDiv.append(showMyMoviesButton, deleteMyAccountButton)
            const signOutButton = document.createElement('button')
            signOutButton.setAttribute('class', 'button sign-out-button')
            signOutButton.textContent = "SIGN OUT"
            signOutButton.addEventListener('click', () => {
                state.signedIn = false
                state.showMyMovies = false
                state.user = {}
                render()
            })
            modalInner.append(modalTitle, signOutP, accountButtonsDiv, signOutButton)
            modalDiv.append(modalInner)
        }



        body.append(modalDiv)
    }

}
// Render Main depending on state and state.keyword
function renderMain() {
    main.innerHTML = ""

    if (!state.singleMovie.movie) {

        if (state.showMyMovies) {
            main.append(renderMyMovies())
        } else {
            for (const keyword of state.keyword) {
                getMainMoviesInfo(keyword)
            }
        }
    } else {
        main.append(renderSingleMovie(state.singleMovie.movie))
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