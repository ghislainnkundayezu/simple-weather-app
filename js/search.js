import { fetchData, getUnits, fetchIconData } from "./functions.js";
import { displayData, fetchForecast } from "./weatherData.js";
import {  weatherViewPage } from "./pages.js";

function initializeSearch() {
    let searchField = document.querySelector(".search-field");
    let resultsContainer = document.querySelector(".search-results-container");

    function displaySearchResults() {
        searchField.addEventListener("focus", () => {

            if (!searchField.value) {
                displayRecentSearches();

            } else {

                resultsContainer.style.display = "flex";
                displayAutocompleteData(searchField.value, resultsContainer);
            }
        });

        document.addEventListener("click", (e) => {
            if (!(e.target.matches(".search-field") || e.target.closest(".search-results-container"))) {
                resultsContainer.style.display = "none";
            }
        });

        searchField.addEventListener("input", () => {
            if (searchField.value) {
                displayAutocompleteData(searchField.value, resultsContainer);
            }
            else {
                displayRecentSearches();
            }
        });

        searchField.addEventListener("keydown", (e) => {
            if (e.keyCode == 13 && searchField.value) {
                e.preventDefault();
                weatherViewPage();
                let units = getUnits();
                let cityName = searchField.value.charAt(0).toUpperCase() + searchField.value.slice(1);
                
                try {
                    let display = displayData(units, cityName);
                }catch(error){
                    console.log("error")
                }
                
            }
            
        });
    }


    function displayRecentSearches() {
        let recentSearches = localStorage.getItem("recent-searches");
        let recentLocations;

        resultsContainer.style.display = "flex";
        if (!recentSearches) {
            resultsContainer.innerHTML = ` 
            <div class="title">
                <h1>Recent Searches</h1>
            </div>
            <div class="body">
                <p>You have no recent locations</p>
            </div> `;
        } else {
            recentLocations = JSON.parse(localStorage.getItem("recent-searches")).locations;
            if (recentLocations?.length === 0) { 
                resultsContainer.innerHTML = ` 
                <div class="title">
                    <h1>Recent Searches</h1>
                </div>
                <div class="body">
                    <p>You have no recent locations</p>
                </div> `;
            }else {
                let storedData = JSON.parse(recentSearches);

                let recentSearchesList = ''; // Initialize an empty string to store list items

                storedData.locations.forEach(location => {
                    recentSearchesList += `
                <li class="recent-location">
                    <div class="location-weather-info">
                        <img src="" alt="">
                        <p class="temperature"></p>
                        <div class="location-details">
                            <p>${location}</p>
                            <p></p>
                        </div>
                    </div>
                    <button class="delete-button"></button>
                </li>`
                        ;
                });

                resultsContainer.innerHTML = `
                <div class="title">
                    <h1>Recent Searches</h1>
                    <button class="delete-all" >Clear all</button>
                </div>
                <ul class="recent-searches">
                    ${recentSearchesList}
                </ul> `;
                fetchIconData("trash3").then(res => {
                    Array.from(document.querySelectorAll(".delete-button")).forEach(location => location.innerHTML = res);
                });
                const apiKey = "4f09df97fb94404599674234242202";
                const baseUrl = "http://api.weatherapi.com/v1/";

                Array.from(document.querySelectorAll(".recent-location")).forEach(location => {
                    let cityName = location.querySelector(".location-details p:first-child").textContent.trim();
                    let resourceUrl = baseUrl + `current.json?key=${apiKey}&q=${cityName}`;

                    fetchForecast(resourceUrl).then(res => {
                        location.querySelector("img").src = res.current.condition.icon;
                        location.querySelector(".temperature").innerHTML = `${res.current.temp_c}\u00B0`;
                        location.querySelector(".location-details p:last-child").textContent = res.location.country;
                    })

                    location.addEventListener("click", (e) => {

                        if (!e.target.closest(".delete-button")) {
                            
                            weatherViewPage();
                            let units = getUnits();
                            displayData(units, cityName);
                            resultsContainer.style.display = "none";
                            searchField.value = "";
                            initializeSearch()();
                        } else {
                            let storedRecentSearches = JSON.parse(localStorage.getItem("recent-searches"));
                            let locationsList = storedRecentSearches.locations;
                            locationsList.splice(locationsList.indexOf(cityName), 1);
                            storedRecentSearches.locations = locationsList;
                            localStorage.setItem("recent-searches", JSON.stringify(storedRecentSearches));
                            location.style.display = "none";
                            
                            if (locationsList.length === 0) {
                                resultsContainer.style.display = "none";
                            }
                            
                        }
                    })

                })
                document.querySelector(".delete-all").addEventListener("click", () => {
                    let storedRecentSearches = JSON.parse(localStorage.getItem("recent-searches"));
                    storedRecentSearches.locations = [];
                    localStorage.setItem("recent-searches", JSON.stringify(storedRecentSearches));
                    Array.from(document.querySelectorAll(".recent-location")).forEach(location => {
                        location.style.display = "none";
                    })
                    resultsContainer.style.display = "none";
                })
            }
        }
    }

    function displayAutocompleteData(search, container) {
        getAutocompleteData(search)
            .then(response => {
                container.innerHTML = "";
                let suggestionContainer = document.createElement("ul");
                suggestionContainer.classList.add("suggestions-container");

                if (response.length !== 0) {

                    response.forEach(suggestion => {
                        let suggestionItem = document.createElement("li");
                        suggestionItem.classList.add("response");
                        suggestionItem.textContent = `${suggestion.LocalizedName}, ${suggestion.AdministrativeArea.LocalizedName}, ${suggestion.Country.LocalizedName} `;
                        //suggestionItem.textContent = `${ suggestion.name }, ${ suggestion.country } `;
                        suggestionContainer.appendChild(suggestionItem);
                        suggestionItem.addEventListener("click", (e) => {

                            weatherViewPage();
                            let units = getUnits();
                            let cityName = e.target.textContent.split(",")[0].trim();
                            displayData(units, cityName);
                            resultsContainer.style.display = "none";
                            searchField.value = "";

                            let recentSearches = localStorage.getItem("recent-searches");
                            let storedLocations;
                            if (!recentSearches) {
                                storedLocations = { locations: [] };

                            } else {
                                storedLocations = JSON.parse(recentSearches);

                            }
                            if (!storedLocations.locations.includes(cityName)) {
                                storedLocations.locations.push(cityName);
                                localStorage.setItem("recent-searches", JSON.stringify(storedLocations))
                            }
                           


                            initializeSearch()();

                        });
                    });

                } else {
                    suggestionContainer.innerHTML = "";
                    let noSuggestion = document.createElement("li");
                    noSuggestion.classList.add("no-response");
                    noSuggestion.textContent = `No results found`;
                    suggestionContainer.appendChild(noSuggestion);
                }
                container.appendChild(suggestionContainer);
            }

            );
    }
    return displaySearchResults;
}
async function getAutocompleteData(search) {

    const APIKEY = "235Y4h7I5UGWZUVTlbFywQExjPuJZwxQ";
    let resourceUrl = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${search}`;

    //const APIKEY = "4f09df97fb94404599674234242202";
    //let resourceUrl = `http://api.weatherapi.com/v1/search.json?key=${APIKEY}&q=${search}`;
    return fetchData(resourceUrl)
        .then(response => {
            // Check if response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response and return the resulting object
            return response.json();
        })
        .catch(error => {
            // Log and re-throw any errors
            console.error(error);
            throw error;
        });
}

export { initializeSearch }