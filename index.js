const autoCompleteConfig = {
    renderOption(movie){
        const imgSRC = movie.Poster === "N/A"  ? "" : movie.Poster;
        return `<img src = "${imgSRC}"/>
        ${movie.Title}
        ${movie.Year}`;
    },  
        inputValue(movie){
         return movie.Title;
        },
        async fetchData(searchedTerm){
            const response = await axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: "c02aface",
                    s: searchedTerm
                }
            })
            if(response.data.Error){
                return [];
            }
            return response.data.Search;
        } 
}

createAutoComplete({...autoCompleteConfig,
                     root: document.querySelector("#left-autocomplete"),
                     onOptionSelect(movie){
                        document.querySelector(".tutorial").classList.add("is-hidden");
                        let leftSummary = document.querySelector(".left-summary")
                        onMovieSelect(movie, leftSummary, "left")
                    }});
createAutoComplete({...autoCompleteConfig,
                        root: document.querySelector("#right-autocomplete"),
                        onOptionSelect(movie){
                            document.querySelector(".tutorial").classList.add("is-hidden");
                            let rightSummary = document.querySelector(".right-summary")
                            onMovieSelect(movie, rightSummary, "right")
                        }});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summary, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "c02aface",
            i: movie.imdbID
        }
    });
    summary.innerHTML =  movieTemplate(response.data);
    if(side === "left"){
        leftMovie = response.data;
    }else {
        rightMovie = response.data;
    }
    if(leftMovie && rightMovie){
        runComparison();
    }
    
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll(".left-summary .notification");
    const rightSideStats = document.querySelectorAll(".right-summary .notification");

    leftSideStats.forEach((leftStats, index) => {
        let rightStats = rightSideStats[index];
        let rightValue = parseInt(rightStats.getAttribute("data-value"));
        let leftValue  = parseInt(leftStats.getAttribute("data-value"));

        if(rightValue > leftValue){
            leftStats.classList.remove("is-primary");
            leftStats.classList.add("is-warning");
        }else if(rightValue === leftValue){
            return;
        } else {
            rightStats.classList.remove("is-primary");
            rightStats.classList.add("is-warning");
        }
    })
}

const movieTemplate = (movieDetail) => {
    let dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, ""). replace(/,/g, ""));
    let metascore = parseInt(movieDetail.Metascore);
    let IMDBRating = parseFloat(movieDetail.imdbVotes);
    let IMDBvotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
    let awards =  movieDetail.Awards.split(" ").reduce((prev, curr) => {
        let value = parseInt(curr);
        if(isNaN(value)){
            return prev;
        }else {
            return prev + value;
        }
    }, 0);
    console.log(dollars, metascore, IMDBRating, IMDBvotes, awards);

    return `
    <article class = "media">
        <figure class = "media-left">
            <p class = "image">
                <img = src = "${movieDetail.Poster}"/>
            </p>
        </figure>
        <div class = "media-content">
            <div class = "content">
                <h1> ${movieDetail.Title}</h1>
                <h4> ${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value = "${awards}" class = "notification is-primary">
        <p class = "title">${movieDetail.Awards}</p>
        <p class = "subtitle">Awards</p>
    </article>
    <article data-value = "${dollars}" class = "notification is-primary">
        <p class = "title">${movieDetail.BoxOffice}</p>
        <p class = "subtitle">Box Office</p>
    </article>
    <article data-value = "${metascore}" class = "notification is-primary">
        <p class = "title">${movieDetail.Metascore}</p>
        <p class = "subtitle">Metascore</p>
    </article>
    <article data-value = "${IMDBRating}" class = "notification is-primary">
        <p class = "title">${movieDetail.imdbRating}</p>
        <p class = "subtitle">IMDB Rating</p>
    </article>
    <article data-value = "${IMDBvotes}" class = "notification is-primary">
        <p class = "title">${movieDetail.imdbVotes}</p>
        <p class = "subtitle">IMDB Votes</p>
    </article>
    `;
}


