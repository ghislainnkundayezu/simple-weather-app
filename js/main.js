import { homePage } from "./pages.js";



homePage();



// let locationBtn = document.querySelector("#get-location");
// locationBtn.addEventListener("click", () => {
//     console.log("btni")
//     getUserLocation()
//         .then(({ latitude, longitude }) => {
//             weatherViewPage();
//             let units = getUnits();
//             let cityName = `${latitude},${longitude}`;
//             displayData(units, cityName);
//         })
//         .catch(error => {
//             console.error("Error getting user location:", error);
//         });
// });

// function getUserLocation() {
//     return new Promise((resolve, reject) => {
//         function getLocation(position) {
//             // Extract latitude and longitude from the position object
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;

//             // Resolve the promise with latitude and longitude
//             resolve({ latitude, longitude });
//         }

//         // Check if geolocation is supported by the browser
//         if ("geolocation" in navigator) {
//             // Get the user's current position
//             navigator.geolocation.getCurrentPosition(getLocation, reject);
//         } else {
//             // Geolocation is not supported by the browser
//             reject(new Error("Geolocation is not supported by this browser."));
//         }
//     });
// }
