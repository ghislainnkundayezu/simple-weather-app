import { formatDate, getDayName, formatTime, fetchIconData, fetchConditionsIcon, fetchData } from "./functions.js";
import todaysForecastCarousel from "./carousel.js";
import { unknownLocationPage } from "./pages.js";


export const fetchForecast = async function (resourceUrl) {

    return fetchData(resourceUrl)
        .then(response => {
            // Check if response is successful
            if (!response.ok) {
                // Handle specific error cases
                switch(response.status) {
                    case 400: 
                        console.log("Bad request");
                        break;
                    default:
                        console.log("Unhandled error:", response.status);
                }
                // Optionally, return null or some other value to indicate the failure
                return null;
            
            }else{
                // Parse the JSON response and return the resulting object
                return response.json();
            }
            
        })
        .catch(error => {
            //re-throw any errors
            console.log(error)
            throw error;
            
        });


};


export function displayForecastData(units, weatherData) {
    let daysForecasted = weatherData.forecast.forecastday.length - 1;
    
    // this code create the elements and containers used to display the data.
    let parentDiv = document.querySelector(".weather-forecast");
    
    const headerElement = document.createElement("h1");
    headerElement.textContent = `${daysForecasted}
                              DAYS FORECAST`;
    headerElement.classList.add("forecast-header")
    
    parentDiv.appendChild(headerElement);

    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add("forecast-data-container");
    
    for (let i = 1; i <= daysForecasted; i++) {
        const activeDay = weatherData.forecast.forecastday[i];

        const weatherDiv = document.createElement("div");
        weatherDiv.classList.add("forecast");

        
        const div1 = document.createElement("div");
        div1.classList.add("date-forecasted");
        const p1 = document.createElement("p");
        p1.classList.add("date");
        p1.textContent = formatDate(activeDay.date);
        const p2 = document.createElement("p");
        p2.classList.add("day-name")
        p2.textContent = getDayName(activeDay.date);
        div1.appendChild(p1);
        div1.appendChild(p2);

        // Create the div element containing an image and a paragraph
        const div2 = document.createElement("div");
        div2.classList.add("conditions");

        const img = document.createElement("img");
        img.classList.add("conditions-image");
        img.src =  activeDay.day.condition.icon;
        
        const p3 = document.createElement("p");
        p3.textContent = activeDay.day.condition.text;
        div2.appendChild(img);
        div2.appendChild(p3);

        // Create the div element containing the temperature paragraph
        const div3 = document.createElement("div");
        div3.classList.add('temperature-forecasted');

        const p4 = document.createElement("p"); 
        p4.textContent = (units==="c") ? `${activeDay.day.maxtemp_c}\u00B0/${activeDay.day.mintemp_c}\u00B0` : 
                                         `${activeDay.day.maxtemp_f}\u00B0/${activeDay.day.mintemp_f}\u00B0`;
        p4.classList.add("temperature");
        div3.appendChild(p4);

        // Append all div elements to the body
        weatherDiv.appendChild(div1);
        weatherDiv.appendChild(div2);
        weatherDiv.appendChild(div3);

        // Append the weather div to the main div
        forecastContainer.appendChild(weatherDiv);
    }

    parentDiv.appendChild(forecastContainer);
}


export function displayTodaysWeather(units, weatherData) {
    let currentDay = weatherData.forecast.forecastday[0];

    // this code create the elements and containers used to display the data.
    let parentDiv = document.querySelector(".overall-weather");

    //create the information div.
    let infoDiv = document.createElement("div");
    infoDiv.classList.add("info");

    //create the elements for the information that the infoDiv will contain.
    let todaysDate = document.createElement("p");
    todaysDate.classList.add("todays-date")
    todaysDate.textContent = `${formatDate(currentDay.date)}, 
                              ${getDayName(currentDay.date)}`;

    let displayLocation = document.createElement("p");
    displayLocation.classList.add("display-location")
    displayLocation.textContent = `${weatherData.location.name}`;

    let todaysTemperature = document.createElement("p");
    todaysTemperature.classList.add("todays-temperature");
    todaysTemperature.classList.add("temperature");
    todaysTemperature.textContent = (units==="c") ? `${currentDay.day.maxtemp_c}\u00B0/${currentDay.day.mintemp_c}\u00B0`  : 
                                                    `${currentDay.day.maxtemp_f}\u00B0/${currentDay.day.mintemp_f}\u00B0`;
    

    // let's add the elements to the div.
    infoDiv.appendChild(todaysDate);
    infoDiv.appendChild(displayLocation);
    infoDiv.appendChild(todaysTemperature);
    

    // let's create the second div to contain the image showing the conditions of today.
    let imageContainer = document.createElement("div");
    imageContainer.classList.add("conditions-img");

    let imgElement = document.createElement("img");
    fetchConditionsIcon(weatherData.current.condition.icon)
                                                    .then(response => {
                                                        imgElement.src = 'data:image/png;base64,' + response; 
                                                    })
    //e.g: imgElement.src = "https://cdn.weatherapi.com/weather/128x128/day/302.png";
        
    // let's add the image to the div.
    imageContainer.appendChild(imgElement);



    //let's add the two divs to the parent div.
    parentDiv.appendChild(infoDiv);
    parentDiv.appendChild(imageContainer);
}


export function displayTodaysForecast(units, weatherData) {
    let currentDay = weatherData.forecast.forecastday[0];
    let hoursForecasted = currentDay.hour.length;

    // this code create the elements and containers used to display the data.
    let parentDiv = document.querySelector(".current-day-forecast");


    //let's create the title.
    let titleElement = document.createElement("p");
    titleElement.classList.add("title");
    titleElement.textContent = "TODAY'S FORECAST";
    //let's add the title to the parent div.
    parentDiv.appendChild(titleElement);

    //let's create the container to hold our daily forecasts.
    let forecastContainer = document.createElement("div");
    forecastContainer.classList.add("forecast-container");
    forecastContainer.classList.add("carousel-track");

    // let's create a loop to add all of the 24 hours forecasts for today.
    for (let i=0; i<hoursForecasted; i++) {
        //lets create the div for an individual forecast.
        let forecastDiv = document.createElement("div");
        forecastDiv.classList.add("forecast-div");
        forecastDiv.classList.add("carousel-slide");

        //lets create all elements to be forecasted.
        let forecastHour = document.createElement("p");
        forecastHour.classList.add("hour")
        forecastHour.textContent = formatTime(currentDay.hour[i].time);

        let forecastConditions = document.createElement("img");
        forecastConditions.src = currentDay.hour[i].condition.icon; 

        let forecastTemperature = document.createElement("p");
        forecastTemperature.classList.add("temperature");
        forecastTemperature.textContent = (units==="c") ? `${currentDay.hour[i].temp_c}\u00B0` : `${currentDay.hour[i].temp_f}\u00B0`;
        
        //let's add all the elements in the container
        forecastDiv.appendChild(forecastHour);
        forecastDiv.appendChild(forecastConditions);
        forecastDiv.appendChild(forecastTemperature);

        //finally let's add the forecastdiv to forecast container.
        forecastContainer.appendChild(forecastDiv);
    }

    parentDiv.appendChild(forecastContainer);
}

export function displayWeatherDetails (units, weatherData) {
    let currentDay = weatherData.forecast.forecastday[0];
    let currentConditions = weatherData.current; // it takes data from the current variable in the api.
    let hoursForecasted = currentDay.hour.length;

    // this code create the elements and containers used to display the data.
    let parentDiv = document.querySelector(".weather-details");


    let titleElement = document.createElement("p");
    titleElement.classList.add("details-title");
    titleElement.textContent = "WEATHER DETAILS";
    //let's add the title to the parent div.
    parentDiv.appendChild(titleElement);

    //let's create the container to hold our daily forecasts.
    let detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-container");

    //let's create individual container of weather details and their elements.
    let details = [
        {
            data_name : "Sunrise",
            data_ref : currentDay.astro.sunrise,
            icon_name: "sunrise"
        },
        {
            data_name : "Sunset",
            data_ref : currentDay.astro.sunset,
            icon_name: "sunset"
        },

        {
            data_name : "Chance of rain",
            data_ref : `${currentDay.day.daily_chance_of_rain}%`,
            icon_name: "droplet"
        },

        {
            data_name : "Wind",
            data_ref : `${currentConditions.wind_kph} Km/h`,
            icon_name: "wind"
        },

        {
            data_name : "UV index",
            data_ref : `${currentConditions.uv} of 10`,
            icon_name: "sun"
        },

        {
            data_name : "Feels like",
            data_ref : (units==="c") ? `${currentConditions.feelslike_c}\u00B0` : `${currentConditions.feelslike_f}\u00B0`,
            icon_name: "thermometer-half",
            class_name: "temperature"
        }    
    ]
    
    //This for loop iterates through the details and 
    //places each to its correct div according to the index of the data
    for (let i=0; i < details.length; i++) {
        let dataDiv = document.createElement("div");
        dataDiv.classList.add("individual-detail");

        //code for the description part in words.
        let descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("details-description");

        let detailsName = document.createElement("p");
        detailsName.classList.add("details-name");
        detailsName.textContent = details[i]["data_name"];

        let detailsMeasure = document.createElement("p");
        detailsMeasure.classList.add("details-measure");
        detailsMeasure.textContent = details[i]["data_ref"];

        if (details[i].class_name) {
            detailsMeasure.classList.add(details[i].class_name);
        }

        descriptionDiv.appendChild(detailsName);
        descriptionDiv.appendChild(detailsMeasure);


        // code for the icon.
        let imageDiv = document.createElement("div");
        imageDiv.classList.add("details-img");

        fetchIconData(details[i]["icon_name"])
        .then(res => {
            imageDiv.innerHTML = res;
        });

        dataDiv.appendChild(descriptionDiv);
        dataDiv.appendChild(imageDiv);
        
        detailsContainer.appendChild(dataDiv);
    }

    //finally let's add the details container to the parent div(weather details)
    parentDiv.appendChild(detailsContainer);
}


//code to display the data to the page. 
export function displayData(units, cityName) {
    
    const apiKey = "4f09df97fb94404599674234242202";
    const baseUrl = "http://api.weatherapi.com/v1/";
    const days = "8";
    //let cityNames = "kl"
    let resourceUrl = baseUrl + `forecast.json?key=${apiKey}&q=${cityName}&days=${days}`;
    
            
    fetchForecast(resourceUrl)
        .then(response => {
            if (response){
                displayTodaysForecast(units, response);
                displayTodaysWeather(units, response);
                displayWeatherDetails(units, response);
                displayForecastData(units, response);
                todaysForecastCarousel();
               
            
            }else {
                unknownLocationPage();
                //return "no response";
            }
        })
        .catch(error => {
            //throw error;
            return "no response";
        });
}

