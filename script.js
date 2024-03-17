window.addEventListener('load', function () {
  document.getElementById("location-button").addEventListener("click", getLocation);
  document.getElementById("search-button").addEventListener("click", searchCity);
  showDate(); 
  document.getElementById("current-weather").style.display = "none"; 
});

var tempChart; 
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
    .then(displayCurrentWeather)
    .catch(err => console.log("Error in showPosition"));
  displayForecast(position.coords.latitude, position.coords.longitude);
}

function displayCurrentWeather(resp) {
  // Funkce pro zobrazení aktuálního počasí
  if (resp.cod === "404") {
    alert("City not found. Please enter a valid city name.");
    return;
  }

  var date = new Date(resp.dt * 1000);
  var dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
  var day = date.getDate();
  var month = date.toLocaleString('en-US', { month: 'long' });
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var time = hours + ':' + minutes;

  
  document.getElementById("current_temp").innerText = resp.main.temp.toFixed() + '℃';
  document.getElementById("location").innerText = resp.name + ', ' + resp.sys.country;
  document.getElementById("weather").innerText = resp.weather[0].description.charAt(0).toUpperCase() + resp.weather[0].description.slice(1);
  document.getElementById("current-weather-icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${resp.weather[0].icon}.png" alt="${resp.weather[0].description}">`;
  document.getElementById("date").innerText = `${dayOfWeek}, ${day} ${month}, ${time}`;
  document.getElementById("current-weather").style.display = "block"; // Zobrazení aktuálního bloku počasí na stránce

  displayForecast(resp.coord.lat, resp.coord.lon);
}

function searchCity() {
  
  var city = document.getElementById("city-input").value;
  if (city != "") {
    document.getElementById("city-input").value = "";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric&lang=cz`)
      .then(response => response.json())
      .then(displayCurrentWeather)
      .catch(err => console.log("Error in searchCity"));
  } else {
    window.alert("Enter city");
  }
}

function displayForecast(lat, lon) {
  
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
    .then(response => response.json())
    .then(data => {
      // Získání údajů o teplotě a čase z odpovědi rozhraní API
      var temps = data.list.slice(0, 8).map(item => item.main.temp);
      var labels = data.list.slice(0, 8).map(item => {
        var date = new Date(item.dt * 1000);
        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
      });
      updateChart(temps, labels);
    })
    .catch(err => console.log("Error in displayForecast"));
}

function updateChart(temps, labels) {
  
  var ctx = document.getElementById('tempChart').getContext('2d');

  if (tempChart) {
    tempChart.destroy(); 
  }

 
  tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temps,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      }
    }
  });
}
