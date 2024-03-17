window.addEventListener('load', function (event) {
    
    document.getElementById("location-button").addEventListener("click", getLocation);
    document.getElementById("search-button").addEventListener("click", searchCity);
    showDate();
    document.getElementById("weather-forecast").style.display = "none"; 
});

var api_key = "0693c6ccaf2014d33d4bae8008660720";

function showDate() {
    var date = new Date();
    var dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    var day = date.getDate();
    var month = date.toLocaleString('en-US', { month: 'long' });
    var year = date.getFullYear();
    document.getElementById("date").innerText = dayOfWeek + ' ' + day + '. ' + month + ' ' + year;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&lang=cz&appid=' + api_key)
        .then(response => response.json())
        .then(displayData)
        .catch(err => console.log("Error in showPosition"))
}

function displayData(resp) {
    
    console.log(resp);
    var location = resp['name'];

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + api_key + '&units=metric&lang=cz')
        .then(response_day => response_day.json())
        .then(displayForecast)
        .catch(err => console.log("Error in displayData"))
}

function searchCity() {
    
    var city = document.getElementById("city-input").value;
    if (city != "") {
        document.getElementById("city-input").value = "";
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + api_key + '&units=metric&lang=cz')
            .then(response => response.json())
            .then(displayData)
            .catch(err => console.log("Error in searchCity"))
    }
    else {
        window.alert("Enter city");
    }
}

function displayForecast(resp) {
   
    if (resp.cod === "404") {
        alert("City not found. Please enter a valid city name.");
        return;
    }

    var forecastContainer = document.getElementById("weather-forecast");
    forecastContainer.innerHTML = ""; 

    for (let i = 0; i < resp.list.length; i++) {
        var forecastItem = resp.list[i];
        var date = new Date(forecastItem.dt * 1000);
        var day = date.toLocaleDateString("en-US", { weekday: "long" });
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        var time = hours + ':' + minutes;
        var temperature = forecastItem.main.temp.toFixed(1) + "°C";
        var description = forecastItem.weather[0].description;
        var iconCode = forecastItem.weather[0].icon;

        var forecastElement = document.createElement("div");
        forecastElement.className = "forecast-item";
        forecastElement.innerHTML = `
            <div class="day">${day}</div>
            <div class="time">${time}</div>
            <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="${description}"></div>
            <div class="temperature">${temperature}</div>
            <div class="description">${description}</div>
        `;

        forecastContainer.appendChild(forecastElement);
    }

    document.getElementById("weather-forecast").style.display = "block";
}
