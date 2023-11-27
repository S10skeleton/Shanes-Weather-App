document.getElementById('searchButton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value; 
    fetchWeatherData(city);
})