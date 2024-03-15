const myFirstPromise = new Promise(function(resolve, reject){
    let m = 11;

    if (m==11){
        resolve("I made it Fam");
    }else {
        reject("fuck off!");
    }
});

const mySecondPromise = new Promise(function(resolve, reject){
    setTimeout(() => {
        resolve("Welcome home after 3 seconds")
    }, 
        3000);
});

const fetchData = function() { 
    return new Promise(function(resolve, reject){
        let result = fetch('https://dummyjson.com/products/1');
        result
            .then(response => {
                if (!response.ok) {
                    throw new Error("Access Denied");
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
})};

// async function activity() {
//     let myValue = await myFirstPromise;
//     console.log(myValue);
// }

//activity();

mySecondPromise
    .then(res => console.log(res))
    .catch(error => console.log(error));


myFirstPromise
    .then(response => console.log(response))
    .catch(error => console.log("An Error Occurred:", error));

fetchData()
    .then(data => {
        console.log("Fetched Data:", data)
    })
    .catch(error => {
        console.log("Failed to execute:". error);
    });

console.log("I'm not asynchronous");

