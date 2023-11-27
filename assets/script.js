document.getElementById('searchButton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value; 
    fetchWeatherData(city);
});

function fetchWeatherData(city) {
    const apiKey = 'f745361e666816ba6da18fd36de8ab4b';

    // API source for getting city data from city name 
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        // Check if the city is found and data is returned
        if (data && data.length > 0) {
            // Get the latitude and longitude of the first result
            const { lat, lon } = data[0]; 
            fetchForecast(lat, lon, apiKey);
        } else {
            console.log('City not found');
            // notification if city is not found in database
        }
    })
    
}

function fetchForecast(lat, lon, apiKey) {
    // API source using LAT and LON coordinates to fetch forcast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        displayWeatherData(data);
    })
 
}

// Function for displaying fetched weather forcast 
function displayWeatherData(data) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const forecastDiv = document.getElementById('forcast');

    weatherInfoDiv.innerHTML = '';
    forecastDiv.innerHTML = '';

    // if statement confirming there is actual data to return 
    if (!data || !data.list || data.list.length === 0) {
        weatherInfoDiv.innerHTML = 'No weather data available';
        return;
    }

    // Display the first entry, current days weather
    // Temp is now displayed correctly in Fahrenheit 
    const currentWeather = data.list[0];
    weatherInfoDiv.innerHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${currentWeather.main.temp}°F</p>
        <p>Condition: ${currentWeather.weather[0].main}</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
    `;

    // Display a simplified 5-day forecast
    // Temp is now displayed correctly in Fahrenheit 


    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    // API provides 3-hourly forecast, I added 8 creating 5 day forcast instead
    for (let i = 0; i < data.list.length; i += 8) { 
        const forecast = data.list[i];
        forecastDiv.innerHTML += `
            <div>
                <p><strong>${new Date(forecast.dt_txt).toDateString()}</strong></p>
                <p>Temp: ${forecast.main.temp}°F</p>
                <p>Condition: ${forecast.weather[0].main}</p>
            </div>
        `;
    }
}
