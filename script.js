let btn = document.getElementById("submit-button");
let searchInput = document.getElementById("title-search");
let error = document.getElementById("error");
let resultPage = document.getElementById("result-page");
let autocompleteContainer = document.getElementById("autocomplete-container");
let prevPageBtn = document.getElementById("prev");
let nextPageBtn = document.getElementById("next");
let pagination = document.getElementById("pagination");
let currentPage = 1;

//debounce function
function debounce(func, time) {
    let timerID;
    return function(...params) {
        clearTimeout(timerID);
        timerID = setTimeout(func, time, ...params);
    }
}

let debouncedAutocomplete = debounce(fillAutocomplete, 500);

//event listeners
btn.addEventListener("click", function() {
    let titleInput = document.getElementById("title-search").value.trim();
    let type = document.getElementById("select-type").value;
    fetchData(titleInput, type, currentPage);
});


nextPageBtn.addEventListener("click", function() {
    let titleInput = document.getElementById("title-search").value.trim();
    let type = document.getElementById("select-type").value;
    currentPage = currentPage + 1;
    prevPageBtn.disabled = false;
    fetchData(titleInput, type, currentPage);
})

prevPageBtn.addEventListener("click", function() {
    let titleInput = document.getElementById("title-search").value.trim();
    let type = document.getElementById("select-type").value;
    currentPage = currentPage - 1;
    fetchData(titleInput, type, currentPage);
})


//starting with the first page every time the user makes a search and calling a debounced function to fill autocomplete
searchInput.addEventListener("input", function() {
    currentPage = 1;
    let titleInput = document.getElementById("title-search").value.trim();
    let type = document.getElementById("select-type").value;
    debouncedAutocomplete(titleInput, type);
})


//fill autocomplete fn 
function fillAutocomplete(titleInput, type) {
    resultPage.innerHTML = "";
    autocompleteContainer.innerHTML = "";
    fetch(`http://www.omdbapi.com/?apikey=a6d0fd52&s=${titleInput}&type=${type}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.Response === "True") {
                data.Search.forEach(result => {
                    let div = document.createElement("div");
                    div.classList.add("autocomplete");
                    let h4 = document.createElement("h4");
                    h4.innerHTML = result.Title;
                    div.append(h4);
                    autocompleteContainer.append(div);
                    div.addEventListener("click", () => {
                        autocompleteContainer.innerHTML = "";
                        let div = document.createElement("div");
                        div.classList.add("result-info");
                        let poster = document.createElement("img");
                        poster.src = result.Poster;
                        let title = document.createElement("h2");
                        title.innerHTML = result.Title;
                        let year = document.createElement("h4");
                        year.innerHTML = result.Year;
                        div.append(poster, title, year);
                        resultPage.append(div);
                    })
                })
            }
        })
}


//fetching data
function fetchData(titleInput, type, currentPage) {
    error.innerHTML = "";
    resultPage.innerHTML = "";
    fetch(`http://www.omdbapi.com/?apikey=a6d0fd52&s=${titleInput}&type=${type}&page=${currentPage}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.Response === "False") {
                error.innerHTML = data.Error;
            } else {
                let totalResults = data.totalResults;
                //disabling next and previuos buttons when there are no more results to show
                if (currentPage < Math.ceil(totalResults / 10)) {
                    nextPageBtn.disabled = false;
                } else {
                    nextPageBtn.disabled = true;
                }
                if (currentPage > 1) {
                    prevPageBtn.disabled = false;
                } else {
                    prevPageBtn.disabled = true;
                }
                data.Search.forEach(res => {
                    let title = res.Title;
                    let poster = res.Poster;
                    let year = res.Year;
                    printResults(title, poster, year, currentPage);
                    pagination.style.display = "block";
                })
            }

        })
}


//printing results from user search
function printResults(title, poster, year, currentPage) {
    autocompleteContainer.innerHTML = "";
    let div = document.createElement("div");
    div.classList.add("results");
    let img = document.createElement("img");
    img.src = poster;
    let h2 = document.createElement("h2");
    h2.innerHTML = title;
    let h4 = document.createElement("h4");
    h4.innerHTML = year;
    div.append(img, h2, h4);
    resultPage.append(div);
    document.getElementById("page").innerHTML = currentPage;
}