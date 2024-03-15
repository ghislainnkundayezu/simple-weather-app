import { fetchIconData, getUnits } from "./functions.js";
import { initializeSearch } from "./search.js";
import { displayData } from "./weatherData.js";


export const weatherViewPage = () => {

    // Create nav element
    let weatherPage = `
    <nav>
        <div class="container">
            <div class="logo">
                <img src="assets/images/logo.png" alt="The Logo of the website">
                <p>Weatherly</p>
            </div>
            <div class="search-view">
                <input type="search" name="search-bar" class="search-field" placeholder="Search for cities" autocomplete="off">
                <div class="search-results-container">
                    
                </div>
            </div>
            <div class="unit-converter">
                <button id="fahreneit" data-units="f" class="units">&deg;F</button>
                <button id="degrees" data-units="c" class="units active-unit">&deg;C</button>
            </div>
        </div>
    </nav>

    <main>

        <div class="container">
            <div class="current-weather">
                <div class="overall-weather">
            
                </div>
                
                <div class="current-day-forecast carousel-track-container">
                
                </div>
                
                <div class="other-data">
                    <div class="weather-details">
                   
                    </div>
                    <div class="weather-forecast">

                    </div>
                </div>
            
            </div>

            
        </div>

    </main>
    <script type="module" src="js/mains.js"></script>
    `;

    document.body.innerHTML = weatherPage;
    document.querySelector(".logo").addEventListener("click", () => {
        homePage();
    })
    initializeSearch()();
}


export const homePage = () => {
    let homePage;
    homePage = `
    <nav>
        <div class="container">
            <div class="logo">
                <img src="assets/images/logo.png" alt="The Logo of the website">
                <p>Weatherly</p>
            </div>
        </div>
    </nav>

    <main id="welcome-page">
        <div class="container">
            <div class="search-view">
                <input type="search" name="search-bar" class="search-field" placeholder="Search for cities" autocomplete="off">
                <div class="search-results-container">

                </div>
            </div>
            <div>OR</div>
            <div class="user-location">
                <button id="get-location">
                    <span class="location-icon">

                    </span>
                    <p> use your current location </p>
                </button>
            </div>
        </div>
    </main>
    
    <script type="module" src="js/mains.js"></script>
    `;

    document.body.innerHTML = homePage;
    initializeSearch()();
    let locationIcon = document.querySelector(".location-icon");

    // Fetch the icon data asynchronously
    fetchIconData("geo-alt")
        .then(res => {
            // Set the innerHTML of the location icon span element with the SVG content
            locationIcon.innerHTML = res;
        });

        let locationBtn = document.querySelector("#get-location");
        locationBtn.addEventListener("click", () => {
            
            getUserLocation()
                .then(({ latitude, longitude }) => {
                    weatherViewPage();
                    let units = getUnits();
                    let cityName = `${latitude},${longitude}`;
                    displayData(units, cityName);
                })
                .catch(error => {
                    console.error("Error getting user location:", error);
                });
        });
        
        function getUserLocation() {
            return new Promise((resolve, reject) => {
                function getLocation(position) {
                    // Extract latitude and longitude from the position object
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
        
                    // Resolve the promise with latitude and longitude
                    resolve({ latitude, longitude });
                }
        
                // Check if geolocation is supported by the browser
                if ("geolocation" in navigator) {
                    // Get the user's current position
                    navigator.geolocation.getCurrentPosition(getLocation, reject);
                } else {
                    // Geolocation is not supported by the browser
                    reject(new Error("Geolocation is not supported by this browser."));
                }
            });
        }
        
};

export const unknownLocationPage = () => {
    let errorPage = `
    <nav>
        <div class="container">
            <div class="logo">
                <img src="assets/images/logo.png" alt="The Logo of the website">
                <p>Weatherly</p>
            </div>
            <div class="search-view">
                <input type="search" name="search-bar" class="search-field" placeholder="Search for cities" autocomplete="off">
                <div class="search-results-container">
                    
                </div>
            </div>
            <div class="unit-converter">
                <button id="fahreneit" data-units="f" class="units">&deg;F</button>
                <button id="degrees" data-units="c" class="units active-unit">&deg;C</button>
            </div>
        </div>
        
    </nav>

    <main id="location-not-found">

        <div class="container">
            <img src="assets/images/cloud-error-illustration.svg" class="error-image" alt="SVG Image">
            <p>Oh no!</p>
            <p>something went wrong.</p>
            <button class="to-homepage">Return To Home Page</button>
        </div>

    </main>



    <script type="module" src="js/mains.js"></script>

    `
    document.body.innerHTML = errorPage;
    document.querySelector(".logo").addEventListener("click", () => {
        homePage();
    });
    document.querySelector(".to-homepage").addEventListener("click", () => {
        homePage();
    })
    initializeSearch()();
}