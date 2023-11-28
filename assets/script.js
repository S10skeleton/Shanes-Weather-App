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
            fetchForecast(lat, lon, apiKey, city);
            saveSearchHistory(city)

        } else {
            console.log('City not found');
            // notification if city is not found in database
        }
    })
}
// function to save search history to local storage 

function saveSearchHistory(city) {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searches.includes(city)) {
        searches.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searches))
    }
    updateSearchHistoryDisplay()
}
// funciton to recall search history and create buttons for each one 

function updateSearchHistoryDisplay() {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryDiv = document.getElementById('searchHistory');
    searchHistoryDiv.innerHTML = '<h3>Search History</h3>';
    searches.forEach(city => {
        searchHistoryDiv.innerHTML += `<button class='History' onclick="fetchWeatherData('${city}')">${city}</button>`;
    })
}

document.getElementById('clearHistory').addEventListener('click', function() {
    clearSearchHistory()
})

function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    updateSearchHistoryDisplay();
}

function fetchForecast(lat, lon, apiKey, city) {
    // API source using LAT and LON coordinates to fetch forcast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        displayWeatherData(data, city);
    })
 
}

// Function for displaying fetched weather forcast and also check current condition
function displayWeatherData(data, city) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const forecastDiv = document.getElementById('forcast');

    weatherInfoDiv.innerHTML = '';
    forecastDiv.innerHTML = '';

    weatherInfoDiv.style.display = 'flex'
    forecastDiv.style.display = 'flex'

    // if statement confirming there is actual data to return 
    if (!data || !data.list || data.list.length === 0) {
        weatherInfoDiv.innerHTML = 'No weather data available';
        return;
    }


    // Display the first entry, current days weather
    // Temp is now displayed correctly in Fahrenheit 
   
    const currentWeather = data.list[0];
    const currentCondition = currentWeather.weather[0].main;
    updateBackgroundImage(currentCondition);
    weatherInfoDiv.innerHTML = `
        <h2>Current Weather in ${city}</h2>
        <p>Temperature: ${currentWeather.main.temp}°F</p>
        <p>Feels Like: ${currentWeather.main.feels_like}°F</p>
        <p>Condition: ${currentWeather.weather[0].main}</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind.speed}Mph</p>
    `;

    // Display a simplified 5-day forecast
    // Temp is now displayed correctly in Fahrenheit 


    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    // API provides 3-hourly forecast, I added 8 creating 5 day forcast instead
    for (let i = 0; i < data.list.length; i += 8) { 
        const forecast = data.list[i];
        forecastDiv.innerHTML += `
            <div class='forecast-day'>
                <p><strong>${new Date(forecast.dt_txt).toDateString()}</strong></p>
                <p>Temp: ${forecast.main.temp}°F</p>
                <p>Condition: ${forecast.weather[0].main}</p>
                <p>Wind Speed: ${forecast.wind.speed}Mph</p>
                <p>Humidity: ${forecast.main.humidity}%</p>


            </div>
        `;
    }
    


    // Added function to change background image based on current conditions 
}
function updateBackgroundImage(condition) {
    let backgroundImageUrl;

    switch (condition) {
        case 'Clear':
            backgroundImageUrl = "url('assets/images/Sunny.jpg')"
            break;
        case 'Clouds':
            backgroundImageUrl = "url('assets/images/Cloudy.jpg')"
            break;
        case 'Rain':
            backgroundImageUrl = "url('assets/images/Rainy.webp')"
            break;
        case 'Snow':
            backgroundImageUrl = "url('assets/images/Snowy.jpg')"
            break;    
        default: 
        backgroundImageUrl = "url('assets/images/SkyCover.jpg')";
      
    }
    document.body.style.backgroundImage = backgroundImageUrl;
}

document.addEventListener('DOMContentLoaded', updateSearchHistoryDisplay);

