const key = "3816cfa64f75dacc8898b9ab7f936b5e";
let submitButton = document.getElementById("submit");
var cityValue = document.getElementById("search");
let cityHistory = document.getElementById("cityHistory");
var currentCityList = JSON.parse(localStorage.getItem("cityInput"));

document.addEventListener("DOMContentLoaded", function () {
  let container = document.createElement("h4");
  container.setAttribute("id", "cityList");
  if (!currentCityList){
    return
  } else {
    currentCityList.forEach(function (city) {
        let container = document.createElement("span");
        container.textContent = `${city} `;
        cityHistory.appendChild(container);
      });
  }
});

submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  let city = cityValue.value;
  let container = document.createElement("span");
  let currentCityList = JSON.parse(localStorage.getItem("cityInput"));
  if (currentCityList) {
    currentCityList.push(city);
    localStorage.setItem("cityInput", JSON.stringify(currentCityList));
  } else {
    let newCityList = [];
    newCityList.push(city);
    localStorage.setItem("cityInput", JSON.stringify(newCityList));
  }
  container.setAttribute("id", "cityList");
  container.textContent = city;
  cityHistory.appendChild(container);
  findCity();
});

cityHistory.addEventListener("click", function (e) {
  e.stopPropagation();
  let displayCity = e.target.textContent;
  cityValue.value = displayCity;
});
function findCity() {
  let city = cityValue.value;
  let cityFinder = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`;
  console.log(cityFinder);
  cityValue.value = "";

  fetch(cityFinder)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var name = data[0].name;
      var lat = data[0].lat;
      var lon = data[0].lon;
      return {name, lat, lon};
    })
    .then((locData) => {
        findWeather(locData.lat, locData.lon);
      });
}
async function findWeather(lat,lon) {
    var weatherReport = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;
    fetch(weatherReport)
    .then((info) => {
      return info.json();
    })
    .then((week) => {
        console.log(week);
      })
}

