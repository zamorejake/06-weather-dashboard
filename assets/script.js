const key = "3816cfa64f75dacc8898b9ab7f936b5e";
let submitButton = document.getElementById("submit");
var cityValue = document.getElementById("search");
let cityHistory = document.getElementById("cityHistory");
var currentCityList = JSON.parse(localStorage.getItem("cityInput"));

document.addEventListener("DOMContentLoaded", function () {
  let container = document.createElement("h4");
  container.setAttribute("id", "cityList");
  if (!currentCityList) {
    return;
  } else {
    currentCityList.forEach(function (city) {
      let container = document.createElement("span");
      container.textContent = `${city} `;
      cityHistory.appendChild(container);
    });
  }
});

function search() {
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
}
submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  search();
});

cityHistory.addEventListener("click", function (e) {
  e.stopPropagation();
  let displayCity = e.target.textContent;
  cityValue.value = displayCity;
  search();
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
      var lat = data[0].lat;
      var lon = data[0].lon;
      return { lat, lon };
    })
    .then((locData) => {
      findWeather(locData.lat, locData.lon);
    });
}
async function findWeather(lat, lon) {
  var weatherReport = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=1&appid=${key}`;
  fetch(weatherReport)
    .then((info) => {
      return info.json();
    })
    .then((weather) => {
      const city = weather.name;
      const date = new Date(weather.dt * 1000);
      const weatherDesc = weather.weather[0].description;
      const tempK = weather.main.temp;
      const tempF = Math.round((tempK - 273.15) * 9/5 + 32);
      const humidity = weather.main.humidity;
      const windSpeed = weather.wind.speed;
      return {city, date, weatherDesc, tempF, humidity, windSpeed}
    })
    .then((vars) => {
      generateContent(vars.city, vars.date, vars.weatherDesc, vars.tempF, vars.humidity, vars.windSpeed)
    });
}

function generateContent(city, date, weatherDesc, tempF, humidity, windSpeed) {

}
