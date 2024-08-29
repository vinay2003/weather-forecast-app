
const weatherIcons = {
    'clear': './PNG/256/day_clear.png',
    'partly_cloudy': './PNG/256/day_partial_cloud.png',
    'cloudy': './PNG/256/day_cloudy.png',
    'rain': './PNG/256/day_rain.png',
    'snow': './PNG/256/day_snow.png',
    'thunderstorm': './PNG/256/day_thunderstorm.png',
    'night_clear': './PNG/256/night_clear.png',
    'night_cloudy': './PNG/256/night_cloudy.png',
    'night_rain': './PNG/256/night_rain.png'
};

const apiKey = '41472641b8d3e30ed307faabd19a695a';

async function fetchWeatherData(location) {
    let apiUrl;
    if (typeof location === 'string') {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    } else {
        const { lat, lon } = location;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to fetch weather data. Please try again later.');
    }
}

function updateWeatherUI(data) {
    const temperatureElement = document.querySelector('.city-card .font-bold');
    const weatherIconElement = document.querySelector('.city-card img');
    const cityElement = document.querySelector('.city-card p:nth-of-type(2)');

    if (temperatureElement && weatherIconElement && cityElement) {
        const weatherCondition = data.weather[0].main.toLowerCase();
        temperatureElement.textContent = `${data.main.temp}°C`;
        weatherIconElement.src = getWeatherIcon(weatherCondition);
        cityElement.textContent = `${data.name}, ${data.sys.country}`;
    } else {
        console.error('City Card UI elements not found.');
    }

    const temperatureStat = document.querySelector('#right .flex:nth-child(1) .font-bold');
    const humidityStat = document.querySelector('#right .flex:nth-child(2) .font-bold');
    const windSpeedStat = document.querySelector('#right .flex:nth-child(3) .font-bold');

    if (temperatureStat && humidityStat && windSpeedStat) {
        temperatureStat.textContent = `${data.main.temp}°C`;
        humidityStat.textContent = `${data.main.humidity}%`;
        windSpeedStat.textContent = `${data.wind.speed} km/h`;
    } else {
        console.error('Weather Statistics UI elements not found.');
    }
}

function getWeatherIcon(condition) {
    switch (condition) {
        case 'clear': return weatherIcons.clear;
        case 'clouds': return weatherIcons.partly_cloudy;
        case 'rain': return weatherIcons.rain;
        case 'snow': return weatherIcons.snow;
        case 'thunderstorm': return weatherIcons.thunderstorm;
        default: return weatherIcons.clear;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const searchInput = document.querySelector('input[type="text"]');
            const location = searchInput.value.trim();
            if (location) {
                fetchWeatherData(location);
            }
        });
    } else {
        console.error('Search form not found.');
    }
});

document.getElementById('current-location-btn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData({ lat, lon });
            },
            error => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
