//This function is used to fetch data from an api.
export async function fetchData(resourceUrl) {
    
    try {
        //code to fetch data from the api.
        const response = await fetch(resourceUrl);

        //code to check if the response is successful
        if (!response.ok) {
            // If the response is not successful, throw an error
            //throw new Error('Network response was not ok');
            console.log("Bad Request")
        }

        //if the response is successful we return the response.
        return response;

    }catch(error) {
        throw error;   //code to rethrow the error resulting from fetching the data.
    }
}

//This function receives a date and returns the day of the week of that date.
export function getDayName(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return days[dayIndex];
}

//This function returns the Ordinal suffix of a number, a day in the context of this web app.
function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

//This function is used to format data using the format: day, name of the day, year
export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const ordinalSuffix = getOrdinalSuffix(day);

    return `${day}${ordinalSuffix} ${month}`;
}


//This function is used to format time using the 12hour format.
export function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'P.M' : 'A.M';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
}

//this function is used to fetch a magnified icons indicating the conditions of a day. 
export async function fetchConditionsIcon(iconLink) {
    let iconUrl = iconLink;
    let lastSlashIndex = iconUrl.lastIndexOf("/");

    // Extract the substring after the last "/"
    let numberString = iconUrl.substring(lastSlashIndex + 1);

    let iconCode = numberString.match(/\d+/)[0];

    try {
        const optionsFetch = {
            method: "GET",
            header: {
                'Content-Type': 'image/png'
            }
        };
        const iconData = await fetch(`https://cdn.weatherapi.com/weather/64x64/day/${iconCode}.png`, optionsFetch);
        if (!iconData.ok) {
            throw new Error('Failed to fetch icon data');
        }

        // Parse the JSON response
        //const data = await iconData.text();

        const blob = await iconData.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]); // Extract base64 data
            };
            reader.onerror = reject;
        });

            
        } catch (error) {
            console.error('Error fetching icon data:', error);
            return null;
        }
    }

//This function is used to fetch the svg of icons from iconify.
export async function fetchIconData(iconName) {
        try {
            // Make a GET request to the Iconify API
            
            const response = await fetch(`https://api.iconify.design/bi/${iconName}.svg`);
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch icon data');
            }

            // Parse the JSON response
            const data = await response.text();

            // Return the icon data
            //response.then(res => console.log(response)).catch(error => console.log(error));
            return data;
        } catch (error) {
            console.error('Error fetching icon data:', error);
            return null;
        }
    }

//This function is used to convert temperature values from Degree Celcius to Degree Fahreneit and vice versa.
export function updateTemperatureDisplays(units) {
        // Get all elements displaying temperatures
        const temperatureElements = document.querySelectorAll(".temperature");

        // Iterate over each temperature element and update its value
        temperatureElements.forEach(element => {
            // Get the temperature value from the element's data attribute
            let temperatureString = element.textContent;
            //element.textContent = "";
            const regex = /-?\d+(\.\d+)?/g;
            //let numericMatch = temperatureString.match(/(\d+(\.\d+)?)/g);
            let numericMatch = temperatureString.match(regex);

            if (numericMatch.length === 1) {
                let tempNumber = parseFloat(numericMatch[0]);
                let convertedTemp = (units === "c") ? convertToCelsius(tempNumber) : convertToFahrenheit(tempNumber);
                // Update the element's text content with the converted temperature
                element.textContent = `${convertedTemp.toFixed(1)}\u00B0`;

            } else {
                let convertedTemps = [];
                numericMatch.forEach((value) => {
                    let tempNumber = parseFloat(value);
                    let convertedTemp = (units === "c") ? convertToCelsius(tempNumber) : convertToFahrenheit(tempNumber);
                    convertedTemps.push(convertedTemp.toFixed(1));
                });
                element.textContent = `${convertedTemps[0]}\u00B0/${convertedTemps[1]}\u00B0`;
            }

        });
    }

//These functions convert temperature from Degree Fahreneit to Degree Celcius.
function convertToCelsius(fahrenheit) {
    return (fahrenheit - 32) * (5 / 9);
}

//These functions convert temperature from Degree Celcius to Degree Fahreneit.
function convertToFahrenheit(celsius) {
    return (celsius * (9 / 5)) + 32;
}

//This function deals with units used to display temperature values of the weather.
export function getUnits() {
    let storedUnits = localStorage.getItem("units");
    let units;
    const unitsButton = document.querySelectorAll(".units");

    if (storedUnits !== null) {
        units = JSON.parse(storedUnits).value;

        let activeBtn = document.querySelector(".active-unit");
        let currentUnits = document.querySelector(`[data-units="${units}"]`);
        if (!currentUnits.classList.contains("active-unit")) {
            activeBtn.classList.remove("active-unit");
            currentUnits.classList.add("active-unit");
        }
    } else {
        units = document.querySelector(".active-unit").getAttribute("data-units");
        localStorage.setItem('units', JSON.stringify({ value: units }));
    }

    function toggleActiveUnit(e) {
        e.preventDefault();
        const activeUnit = document.querySelector(".active-unit");

        if (!e.target.classList.contains("active-unit")) {
            e.target.classList.add("active-unit");
            activeUnit.classList.remove("active-unit");
            units = e.target.getAttribute("data-units");
            updateTemperatureDisplays(units);
            localStorage.setItem('units', JSON.stringify({ value: units }));

        }
    }


    unitsButton.forEach(button => {
        button.addEventListener("click", (e) => toggleActiveUnit(e));
    });

    return units;

}

//This function is used to clean the contents of the screen so that new content added to it.
export function cleanScreeen() {
    let overallWeather = document.querySelector(".overall-weather");
    let currentDayForecast = document.querySelector(".current-day-forecast");
    let weatherDetails = document.querySelector(".weather-details");
    let weatherForecast = document.querySelector(".weather-forecast");

    overallWeather.innerHTML = "";
    currentDayForecast.innerHTML = "";
    weatherDetails.innerHTML = "";
    weatherForecast.innerHTML = "";
}