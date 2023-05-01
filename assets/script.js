let lat = 0;
let lon = 0;
let weatherReport = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={3816cfa64f75dacc8898b9ab7f936b5e}";
let submitButton = document.getElementById("submit");
let cityValue = document.getElementById("search");
let cityHistory = document.getElementById("cityHistory");

document.addEventListener('DOMContentLoaded', function() {
    let container = document.createElement('h4');
    container.setAttribute('id', "cityList")
    let currentCityList = JSON.parse(localStorage.getItem("cityInput"));
   // let noCommaList = currentCityList.join('\n');
    //container.textContent = (noCommaList);
   // cityHistory.appendChild(container);
    console.log("test")
    currentCityList.forEach(function(city){
        let container = document.createElement('h4');
        container.textContent = city;
        cityHistory.appendChild(container);
    });
});

submitButton.addEventListener("click", function(e) {
    e.preventDefault();
    let city = cityValue.value;
    cityValue.value = '';
    let container = document.createElement('h4');
    let currentCityList = JSON.parse(localStorage.getItem("cityInput"));
    if (currentCityList) {
        currentCityList.push(city);
        localStorage.setItem("cityInput", JSON.stringify(currentCityList));
    } else {
        let newCityList = [];
        newCityList.push(city);
        localStorage.setItem("cityInput", JSON.stringify(newCityList));
    }
    container.setAttribute('id', "cityList")
    container.textContent = (city);
    cityHistory.appendChild(container);
});

cityHistory.addEventListener("click", function(e) {
    e.stopPropagation();
    let displayCity = e.target.textContent;
    cityValue.value = displayCity;
});
