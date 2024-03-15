const date = new Date("2024-04-05");
const day = date.getDate();
console.log(date);

const date2 = new Date();
const hours = date2.getHours();
const minutes = date2.getMinutes();
console.log(date2);
console.log(hours);
console.log(minutes);
console.log(13%12);

function numbel(number) {
    let m;
    switch(number) {
        case "no":
            m = "one";
        case "ok":
            m = "two";

        default:
            m = "not above"
    }
    return m;
}

let z= "no";

console.log(numbel(z));