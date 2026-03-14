let favouriteCities = [];

const savedCities = localStorage.getItem("favouriteCities");

if(savedCities) {
    favouriteCities = JSON.parse(savedCities);
}

function saveCities() {
    localStorage.setItem("favouriteCities", JSON.stringify(favouriteCities));
}

const showWeatherButton = document.getElementById("insertButton");
const favCityButton = document.getElementById("favCityButton")
const apiKey = "bd29452cad8da7ce36e7baca61721517";

showWeatherButton.addEventListener("click", () => {

    const cityInput = document.getElementById("insertCity").value;

    getWeather(cityInput);

});

function addFavouriteCity(favName, index) {

    const favCityTable = document.getElementById("favCityTable");
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");

    const favShowWeather = document.createElement("button");
    favShowWeather.textContent = "Show";
    favShowWeather.style.fontSize = "1rem";
    favShowWeather.style.width = "160px";
    cell2.appendChild(favShowWeather);
    favShowWeather.addEventListener("click", () => {
        getWeather(favName);
    });

    const favDeleteButton = document.createElement("button");
    favDeleteButton.textContent = "X";
    favDeleteButton.addEventListener("mouseenter", () => {
        favDeleteButton.style.backgroundColor = "red";
    });
    favDeleteButton.addEventListener("mouseleave", () => {
        favDeleteButton.style.backgroundColor = "rgb(240, 240, 240)";
    });
    favDeleteButton.addEventListener("click", () => {
        if(confirm("Are you sure you want to delete this favourite city?")) {
            row.remove();
            favouriteCities.splice(index, 1);
            saveCities();
        }
    });

    cell1.textContent = favName;

    cell3.appendChild(favDeleteButton);

    favCityTable.appendChild(row);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

}

favCityButton.addEventListener("click", () => {

    const favCityInput = document.getElementById("favCityInput").value;

    if(!favCityInput) {
        alert("Insert the name of a city to add it to the favourite city list");
        return;
    }

    addFavouriteCity(favCityInput);

    favouriteCities.push(favCityInput);

    saveCities();

});

function loadCities() {

    favouriteCities.forEach((city, index) => {
        addFavouriteCity(city, index);
    });

}

loadCities();

async function getWeather(cityInput) {

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;

    const response = await fetch(apiURL);

    if(!response.ok) {
        alert("Could not find weather data");
        console.error("Could not fetch weather data");
    }

    const data = await response.json();

    displayData(data);

}

function displayData(data) {

    const { name: city, main: {temp, humidity}, weather: [{description, id}]} = data;

    celsius = Math.floor(data.main.temp - 273.15);
    farenheit = Math.floor(celsius * (9 / 5) + 32);

    const displayName = document.getElementById("city");
    const displayTempC = document.getElementById("tempC");
    const displayTempF = document.getElementById("tempF");
    const displayHumidity = document.getElementById("humidity");
    const displayDescription = document.getElementById("desc");
    const displayEmoji = document.getElementById("weatherEmoji");

    displayName.textContent = data.name;
    displayTempC.textContent = celsius + "°C";
    displayTempF.textContent = farenheit + "°F";
    displayHumidity.textContent = "Humidity: " + data.main.humidity;
    displayDescription.textContent = data.weather[0].description;

    if(data.weather[0].id >= 200 && data.weather[0].id < 300) displayEmoji.textContent = "⛈️";
    if(data.weather[0].id >= 300 && data.weather[0].id < 600) displayEmoji.textContent = "🌧️";
    if(data.weather[0].id >= 600 && data.weather[0].id < 700) displayEmoji.textContent = "❄️";
    if(data.weather[0].id >= 700 && data.weather[0].id < 800) displayEmoji.textContent = "🌫️";
    if(data.weather[0].id === 800) displayEmoji.textContent = "☀️";
    if(data.weather[0].id > 800) displayEmoji.textContent = "☁️";

}