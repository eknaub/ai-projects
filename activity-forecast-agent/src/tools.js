export async function getCurrentWeather(location) {
  // Mocked weather data for demonstration purposes
  const weather = {
    location: location,
    temperature: 72,
    unit: "F",
    condition: "sunny",
  };

  return JSON.stringify(weather);
}

export async function getLocation() {
  // Mocked location data for demonstration purposes
  const location = {
    city: "San Francisco",
    state: "CA",
    country: "USA",
  };

  return JSON.stringify(location);
}
