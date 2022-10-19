import { getGeocode } from './getGeocode.js';

const weatherApp = (() => {
  let key = '14924e1bfbc96cdfc9467c223bc62cbf';
  let search = document.querySelector('.search');
  let weatherObj;
  let currentDate = Date().slice(0, 15);
  let currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',});
  let loading = document.querySelector('.loading');
  let units = 'metric'
  let celc = document.querySelector('.celcius');
  let fahren = document.querySelector('.fahrenheit');
  let location = document.querySelector('#location');

  let getCurrentWeather = async (location) => {
    try {
      loading.style.display = 'block'
      let geodata = await getGeocode(location, key);
      let getWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geodata.lat}&lon=${geodata.lon}&appid=${key}&units=${units}`)
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
        windKmph: () => {
          let speed = response.wind.speed * 3.6; // convert to km/h
          speed = (Math.round(speed * 10) / 10); // round to 1 decimal place
          return speed;
        },
        windMph: response.wind.speed,
        windDir: response.wind.deg
      }
      loading.style.display = 'none'
      return weatherObj; 
    }catch (err) {
      console.error(err);
    }
  }

  let populateWeather = async (location) => {
      try {
        let unitOfMeasure;
        units === 'metric' ? unitOfMeasure = 'C' : unitOfMeasure = 'F';
        location = location.replace(/ /g,"_"); // convert all spaces to underscore
        await getCurrentWeather(location);
        console.log(weatherObj)
        document.querySelector('.cityName').textContent = weatherObj.name;
        document.querySelector('.date').textContent = `${currentDate}, ${currentTime}`
        document.querySelector('.weatherDesc').textContent = weatherObj.weatherDesc();
        document.querySelector('.temp').textContent = `${weatherObj.temp}°${unitOfMeasure}`;
        document.querySelector('.feelsLike').textContent = `Feels like ${weatherObj.feelsLike}°${unitOfMeasure}`;
        document.querySelector('#weatherIcon').src = `https://openweathermap.org/img/w/${weatherObj.weatherIcon}.png`;
        document.querySelector('.minTemp').textContent = `Min - ${weatherObj.tempMin}°${unitOfMeasure}`; 
        document.querySelector('.maxTemp').textContent = `Max - ${weatherObj.tempMax}°${unitOfMeasure}`;
        document.querySelector('.humidity').textContent = `Humidity - ${weatherObj.humidity}%`;
        document.querySelector('.wind').textContent = units === 'metric' ? `Wind - ${weatherObj.windKmph()} km/h` : `Wind - ${weatherObj.windMph} mph`
      } catch (err) {
        console.error(err);
      }
  }

  document.querySelector('#location').addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && location.value !== '') {
      populateWeather(location.value);
    }
  });
  
  search.addEventListener('click', () => {
    if (location.value !== '') {
      populateWeather(location.value);
    }
  });

  celc.addEventListener('click', () => {
    if (location.value !== '') {
      celc.style.color = 'var(--mainTextColour)';
      fahren.style.color = 'lightgrey';
      units = 'metric';
      populateWeather(location.value);
    }
  });

  fahren.addEventListener('click', () => {
    if (location.value !== '') {
      celc.style.color = 'lightgrey';
      fahren.style.color = 'var(--mainTextColour)';
      units = 'imperial';
      populateWeather(location.value);
    }
  });
})();