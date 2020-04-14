// Table and Form Functionality

var countrySelection = '';

reload();

$(document).ready(function() {
	$('select').formSelect();

	var queryCountry = 'http://api.airvisual.com/v2/countries?key=428d055e-12ec-4114-a299-ccbc373d0057';

	$.ajax({
		url    : queryCountry,
		method : 'GET'
	}).then(function(respond) {
		var countryOptions = respond.data;
		for (var i = 0; i < respond.data.length; i++) {
			$('select').formSelect();
			var option = $(`<option value="${countryOptions[i].country}">`).html(countryOptions[i].country);
			$('#country').append(option);
		}
	});
});

$('#country').on('change', function() {
	countrySelection = $('#country').val();

	$('#state').empty();
	var queryState =
		'https://api.airvisual.com/v2/states?country=' + countrySelection + '&key=428d055e-12ec-4114-a299-ccbc373d0057';

	$.ajax({
		url    : queryState,
		method : 'GET'
	}).then(function(responss) {
		var stateOptions = responss.data;
		for (var j = 0; j < responss.data.length; j++) {
			$('select').formSelect();
			var newOption = $(`<option value="${stateOptions[j].state}">`).html(stateOptions[j].state);
			$('#state').append(newOption);
		}
	});
});

$('#state').on('change', function() {
	var stateSelection = $('#state').val();
	console.log(stateSelection);
	$('#city').empty();
	var queryCity =
		'http://api.airvisual.com/v2/cities?state=' +
		stateSelection +
		'&country=' +
		countrySelection +
		'&key=428d055e-12ec-4114-a299-ccbc373d0057';

	$.ajax({
		url    : queryCity,
		method : 'GET'
	}).then(function(re) {
		var cityOptions = re.data;
		for (var k = 0; k < re.data.length; k++) {
			$('select').formSelect();
			var newOptions = $(`<option value="${cityOptions[k].city}">`).html(cityOptions[k].city);
			$('#city').append(newOptions);
		}
	});
});

$('button').on('click', function(event) {
	event.preventDefault();
	var city = $('#city').val();
	var state = $('#state').val();
	var country = $('#country').val().toUpperCase();

	localStorage.setItem('city', city);
	localStorage.setItem('country', country);

	var queryURL =
		'https://api.airvisual.com/v2/city?city=' +
		city +
		'&state=' +
		state +
		'&country=' +
		country +
		'&key=428d055e-12ec-4114-a299-ccbc373d0057';
	var query2URL =
		'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8d0f0eb81eaa0bc62985265eed8c324c';

	$.ajax({
		url    : queryURL,
		method : 'GET'
	}).then(function(response) {
		var aqi = response.data.current.pollution.aqius;
		var tempC = response.data.current.weather.tp;
		var tempF = Math.round(tempC * 1.8 + 32);
		var condition = '';
		if (aqi > 150) {
			condition = 'Run for your life!';
			$('tr').css('background-color', 'red');
		} else if (aqi <= 150 && aqi > 100) {
			condition = 'Bad';
			$('tr').css('background-color', 'orange');
		} else if (aqi <= 100 && aqi > 50) {
			condition = 'Fair';
			$('tr').css('background-color', 'yellow');
		} else {
			condition = 'Good!';
			$('tr').css('background-color', 'green');
		}

		localStorage.setItem('pollution', aqi);
		localStorage.setItem('temperature', tempF);
		localStorage.setItem('condition', condition);
	});

	$.ajax({
		url    : query2URL,
		method : 'GET'
	}).then(function(resp) {
		var weatherDesc = resp.weather[0].description;
		var weather = resp.weather[0].icon;

		localStorage.setItem('weather', weatherDesc);
		localStorage.setItem('icon', weather);
	});
	setTimeout(reload, 1000);
});

function reload() {
	var weatherIcon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${localStorage.getItem('icon')}@2x.png`);

	var newRow = $('<tr>').append(
		$('<td>').css('textTransform', 'capitalize').text(localStorage.getItem('city')),
		$('<td>').text(localStorage.getItem('country')),
		$('<td>').text(localStorage.getItem('temperature')),
		$('<td>').text(localStorage.getItem('weather')),
		$('<td>').append(weatherIcon),
		$('<td>').text(localStorage.getItem('pollution')),
		$('<td>').text(localStorage.getItem('condition'))
	);

	$('#display').append(newRow);
}