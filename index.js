const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const err= document.querySelector(".error");

let currentTab = userTab;

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");

getfromSessionStorage();
//event listner


function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener("click", function
    () {
    //clicked tab
    switchTab(userTab);
})
searchTab.addEventListener("click", function () {
    //clicked tab
   switchTab(searchTab);
})
//check co-ordinates if there
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        //if local coordinates not present
         grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadScreen.classList.add("active");

    //API call

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        //add here bad mein
        const data = await res.json();
        loadScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (e) {
        loadScreen.classList.remove("active");
        // add here
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch value from weather info object and put it into ui elements

    cityName.innerHTML = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("no geo location support available");
    }
}
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

//do next
const grantAccessButton = document.querySelector("[data-grantAcess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);
        searchInput.value = "";
});
async function fetchSearchWeatherInfo(city) {
    loadScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await res.json();
        loadScreen.classList.remove("active");        
        renderWeatherInfo(data);
        userInfoContainer.classList.add("active");

    }

    catch (e) {
            loadScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            err.classList.add("active");
            setTimeout(()=>err.classList.remove("active"),5000);


    }

} 