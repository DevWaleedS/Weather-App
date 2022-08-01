const wrapper = document.querySelector('.wrapper'),
	inputContainer = document.querySelector('.input-container'),
	warringMsg = document.querySelector('.warring-msg'),
	input = document.querySelector('input'),
	locationBtn = document.querySelector('button'),
	weatherIcon = document.querySelector('.weather-part img'),
	arrowBtn = document.querySelector('header i');

let api;

input.addEventListener('keyup', (event) => {
	// IF USER PRESSED ENTER BTN AND INPUT VALUE IS NOT EMPTY.
	if (event.key === 'Enter' && input.value != '') {
		// SEND INPUT.VALUE AS A PARAMETER TO REQUEST.API FUNCTION.
		requestApi(input.value);
	}
});

// GET LOCATION FROM geolocation api
locationBtn.addEventListener('click', () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	} else {
		alert('Sorry Your browser not support geolocation api');
	}
});

function onSuccess(position) {
	// Getting Lat and Lon Of The User Device From Coders Obj
	const { latitude, longitude } = position.coords;
	// Getting api location using
	api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=f60aeabce857710af0f5814f47b34a40`;
	fetchData();
}
function onError(error) {
	warringMsg.innerText = error.message;
	warringMsg.classList.add('error');
}

function requestApi(cityName) {
	api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=f60aeabce857710af0f5814f47b34a40`;
	fetchData();
}

async function fetchData() {
	// add class pending to warringMsg
	warringMsg.innerText = 'Getting weather details...';
	warringMsg.classList.add('pending');
	const response = await fetch(api);
	const data = await response.json();
	weatherDetails(data);
}

function weatherDetails(data) {
	if (data.cod === '404') {
		warringMsg.classList.replace('pending', 'error');
		warringMsg.innerHTML = `<b>(${input.value})</b> isn't a valid city name`;
	} else {
		// Get Required Properties value from the data Object.
		const city = data.name;
		const country = data.sys.country;
		const { description, id } = data.weather[0];
		const { feels_like, humidity, temp } = data.main;

		// Change Weather icon
		if (id === 800) {
			weatherIcon.src = 'image/icons/clear.svg';
		} else if (id >= 200 && id <= 232) {
			weatherIcon.src = 'image/icons/storm.svg';
		} else if (id >= 600 && id <= 622) {
			weatherIcon.src = 'image/icons/snow.svg';
		} else if (id >= 701 && id <= 781) {
			weatherIcon.src = 'image/icons/haze.svg';
		} else if (id >= 801 && id <= 804) {
			weatherIcon.src = 'image/icons/cloud.svg';
		} else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
			weatherIcon.src = 'image/icons/rain.svg';
		}

		//Pass These Values Into Html Elements
		document.querySelector('.temp .number').innerText = Math.floor(temp);
		document.querySelector('.weather').innerText = description;
		document.querySelector('.location span').innerText = `${city}, ${country}`;
		document.querySelector('.temp .number-2').innerText = Math.floor(feels_like);
		document.querySelector('.humidity span').innerText = `${humidity}%`;

		//
		warringMsg.classList.remove('pending', 'error');
		wrapper.classList.add('active');
	}
}

//back to input part
arrowBtn.addEventListener('click', () => {
	wrapper.classList.remove('active');
});
