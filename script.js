import { getGeocode } from './getGeocode.js';

const weatherApp = (() => {
  let key = '14924e1bfbc96cdfc9467c223bc62cbf';
  let units = 'metric';
  let search = document.querySelector('.search');
  let weatherObj;
  let currentDate = Date().slice(0, 15);
  let currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',});
  let lat;
  let lon;
  let loading = document.querySelector('.loading');

  let getCurrentWeather = async (location) => {
    try {
      loading.style.display = 'block'
      let geodata = await getGeocode(location, key);
      lat = geodata.lat;
      lon = geodata.lon;
      let getWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`)
      let response = await getWeather.json();
      weatherObj = {
        name: response.name,
        country: response.sys.country,
        temp: Math.round(response.main.temp * 10) / 10,
        feelsLike: Math.round(response.main.feels_like * 10) / 10,
        tempMax: Math.round(response.main.temp_max),
        tempMin: Math.round(response.main.temp_min),
        humidity: Math.round(response.main.humidity),
        pressure: Math.round(response.main.pressure),
        weather: response.weather[0].main,
        weatherDesc: () => {
          // converts first letter of each word to capital
          return response.weather[0].description
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        },
        weatherIcon: response.weather[0].icon,
        wind: () => {
          let speed = response.wind.speed * 3.6; // convert to km/h
          speed = (Math.round(speed * 10) / 10); // round to 1 decimal place
          return speed;
        },
        windDir: response.wind.deg
      }
      loading.style.display = 'none'
      return weatherObj; 
    }catch (err) {
      console.error(err);
    }
  }

  let populateWeather = async () => {
    let location = document.querySelector('#location').value;
    location = location.replace(/ /g,"_");
    await getCurrentWeather(location);
    console.log(weatherObj)
    document.querySelector('.cityName').textContent = weatherObj.name;
    document.querySelector('.date').textContent = `${currentDate}, ${currentTime}`
    document.querySelector('.weatherDesc').textContent = weatherObj.weatherDesc();
    document.querySelector('.temp').textContent = `${weatherObj.temp}°C`;
    document.querySelector('.feelsLike').textContent = `Feels like ${weatherObj.feelsLike}°C`;
    document.querySelector('#weatherIcon').src = `https://openweathermap.org/img/w/${weatherObj.weatherIcon}.png`;

    document.querySelector('.minTemp').textContent = `Min - ${weatherObj.tempMin}°C`; 
    document.querySelector('.maxTemp').textContent = `Max - ${weatherObj.tempMax}°C`;
    document.querySelector('.humidity').textContent = `Humidity - ${weatherObj.humidity}%`;
    document.querySelector('.wind').textContent = `Wind - ${weatherObj.wind()}km/h`;
  }

  document.querySelector('#location').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      populateWeather();
    }
  })
  
  search.addEventListener('click', populateWeather);
})();