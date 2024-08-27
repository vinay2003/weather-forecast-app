const apiKey = '41472641b8d3e30ed307faabd19a695a';

document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('searchInput').value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name');
  }
});

document.getElementById('currentLocationButton').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetchWeatherByUrl(url);
    }, () => {
      alert('Unable to retrieve your location');
    });
  } else {
    alert('Geolocation is not supported by this browser');
  }
});

document.getElementById('recentCities').addEventListener('change', (e) => {
  const city = e.target.value;
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeatherByUrl(url);
}

async function fetchWeatherByUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayWeather(data);
    fetchExtendedForecast(data.name);
    updateRecentCities(data.name);
  } catch (error) {
    alert(error.message);
  }
}

async function fetchExtendedForecast(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('Error fetching extended forecast');
    const data = await response.json();
    displayExtendedForecast(data);
  } catch (error) {
    console.error('Error fetching extended forecast:', error);
  }
}


function displayWeather(data) {
  const weatherDisplay = document.getElementById('weatherDisplay');
  weatherDisplay.innerHTML = `
    <h2 class="text-2xl font-bold">${data.name}</h2>
    <p class="text-xl">${data.weather[0].description}</p>
    <p class="text-lg">Temperature: ${data.main.temp}°C</p>
    <p class="text-lg">Humidity: ${data.main.humidity}%</p>
    <p class="text-lg">Wind Speed: ${data.wind.speed} m/s</p>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" class="mt-2">
  `;
}

function displayExtendedForecast(data) {
  const forecastDisplay = document.getElementById('forecastDisplay');
  forecastDisplay.innerHTML = data.list.slice(0, 5).map(item => `
    <div class="border flex-1 p-2 mb-2 rounded">
      <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
      <p>Temperature: ${item.main.temp}°C</p>
      <p>Humidity: ${item.main.humidity}%</p>
      <p>Wind Speed: ${item.wind.speed} m/s</p>
      <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
    </div>
  `).join('');
}

function updateRecentCities(city) {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    populateDropdown(recentCities);
  }
}

function populateDropdown(cities) {
  const dropdown = document.getElementById('recentCities');
  dropdown.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join('');
  dropdown.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (recentCities.length > 0) {
    populateDropdown(recentCities);
  }
});
