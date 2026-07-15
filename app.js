const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");

const forecastItemContainer = document.querySelector(".forecast-item-container");

const apiKey = "8858bc20137a04b4c95239de4728cb30";

// Search Button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        updateWeatherInfo(city);
        cityInput.value = "";
        cityInput.blur();
    }
});

// Enter Key
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();

        if (city !== "") {
            updateWeatherInfo(city);
            cityInput.value = "";
            cityInput.blur();
        }
    }
});

// Fetch API
async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
}

// Weather Icon
function getWeatherIcon(id) {

    if (id >= 200 && id <= 232) return "thunderstorm.svg";

    if (id >= 300 && id <= 321) return "drizzle.svg";

    if (id >= 500 && id <= 531) return "rain.svg";

    if (id >= 600 && id <= 622) return "snow.svg";

    if (id >= 701 && id <= 781) return "atmosphere.svg";

    if (id === 800) return "clear.svg";

    if (id >= 801 && id <= 804) return "clouds.svg";

    return "clear.svg";
}

// Current Weather
async function updateWeatherInfo(city) {

    try {

        const weatherData = await getFetchData("weather", city);
        const forecastData = await getFetchData("forecast", city);

        if (weatherData.cod != 200 || forecastData.cod != "200") {
            showDisplaySection(notFoundSection);
            return;
        }

        const {
            name,
            sys: { country },
            main: { temp, humidity },
            weather: [{ id, main }],
            wind: { speed }
        } = weatherData;

        countryTxt.textContent = `${name}, ${country}`;
        tempTxt.textContent = `${Math.round(temp)}°C`;
        conditionTxt.textContent = main;
        humidityValueTxt.textContent = `${humidity}%`;
        windValueTxt.textContent = `${speed} m/s`;

        weatherSummaryImg.src = getWeatherIcon(id);

        currentDateTxt.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        updateForecastInfo(forecastData);

        showDisplaySection(weatherInfoSection);

    } catch (error) {

        console.error(error);
        showDisplaySection(notFoundSection);
    }
}

// Forecast
function updateForecastInfo(forecastData) {

    forecastItemContainer.innerHTML = "";

    const dailyForecast = forecastData.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach(item => {

        const date = new Date(item.dt_txt);

        const day = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
        });

        forecastItemContainer.innerHTML += `
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${day}</h5>

                <img src="${getWeatherIcon(item.weather[0].id)}"
                     class="forecast-item-img">

                <h5 class="forecast-item-temp">
                    ${Math.round(item.main.temp)}°C
                </h5>
            </div>
        `;
    });

}

// Show Sections
function showDisplaySection(section) {

    weatherInfoSection.style.display = "none";
    searchCitySection.style.display = "none";
    notFoundSection.style.display = "none";

    section.style.display = "flex";
}

