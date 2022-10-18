export async function getGeocode (location, key) {
  let geodata = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${key}`);
  let response = await geodata.json();
  return response[0];
}

// Same as above but written using promises

// export function getGeocode (location, key) {
//   const weather = fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${key}`)
//   //const weather = fetch("https://jsonplaceholder.typicode.com/users/1")
//   .then((response) => response.json())
//   .then((data) => {
//     return data[0];
//   }).catch((err) => console.error(err));