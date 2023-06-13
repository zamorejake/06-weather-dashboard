const key = "3816cfa64f75dacc8898b9ab7f936b5e";
let submitButton = document.getElementById("submit");
var cityValue = document.getElementById("search");
var content = document.getElementById("content");
let cityHistory = document.getElementById("cityHistory");
var currentCityList = JSON.parse(localStorage.getItem("cityInput"));

document.addEventListener("DOMContentLoaded", function () {
  let container = document.createElement("span");
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
  findCity();
});
function findCity() {
  let city = cityValue.value;
  let cityFinder = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`;
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
      const unCleanDate = new Date(weather.dt * 1000);
      const timezone = (weather.timezone / 60);
      //for whatever reason the time is always 5 hours behind so I manually added those back to fix it
      const currentTime = new Date(unCleanDate.getTime() + (timezone * 60000) + (300 * 60000));
      const date = dayjs(currentTime).format('hA, M/D/YYYY');
      const weatherDesc = weather.weather[0].description;
      const weatherIcon = weather.weather[0].icon;
      const tempK = weather.main.temp;
      const tempF = Math.round((tempK - 273.15) * 9/5 + 32);
      const humidity = weather.main.humidity;
      const windSpeed = weather.wind.speed;
      return {city, date, weatherDesc, weatherIcon, tempF, humidity, windSpeed}
    })
    .then((vars) => {
      generateContent(vars.city, vars.date, vars.weatherDesc, vars.weatherIcon, vars.tempF, vars.humidity, vars.windSpeed)
    });
}

function generateContent(city, date, weatherDesc, weatherIcon, tempF, humidity, windSpeed) {
  var currentBox = '';
  currentBox += generateBox(city, date, weatherDesc, weatherIcon, tempF, humidity, windSpeed);
  
  content.innerHTML = currentBox;
  
  function generateBox(city, date, weatherDesc, weatherIcon, tempF, humidity, windSpeed) {
    return `
      <divcurrent style="border: 0.1em solid black;">
        <h2>${city} (${date})</h2>
        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDesc}">
        <p>Temp: ${tempF}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed}mph</p>
      </divcurrent>
    `;
  }
}
