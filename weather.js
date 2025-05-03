(function () {
    'use strict';

    const API_KEY = "46a5d8546cc340f69d9123207242801";

    const style = `
        <style>
            .head__split {
                display: inline-block;
                margin: 0 10px;
                color: #999;
                font-weight: normal;
                font-size: 1em;
            }

            .weather-container {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 1em;
                white-space: nowrap;
            }

            .weather-temp {
                font-weight: bold;
            }

            .weather-condition {
                font-style: italic;
            }

            .weather-error {
                color: red;
            }
        </style>
    `;

    const weatherHTML = `
        <div class="head__split">|</div>
        <div class="weather-container">
            <span class="weather-temp" id="weather-temp">--°</span>
            <span class="weather-condition" id="weather-condition">Загрузка...</span>
        </div>
    `;

    function fetchWeather(lat, lon) {
        const url = 'https://api.weatherapi.com/v1/current.json?key=' + API_KEY +
                    '&q=' + lat + ',' + lon + '&lang=ru&aqi=no';

        $.ajax({
            url: url,
            method: 'GET',
            timeout: 5000,
            success: function (data) {
                const temp = Math.floor(data.current.temp_c);
                const condition = data.current.condition.text;

                $('#weather-temp').text(temp + '°');
                $('#weather-condition')
                    .text(condition)
                    .toggleClass('long-text', condition.length > 10);
            },
            error: function () {
                $('#weather-temp').text('--°');
                $('#weather-condition').text('Ошибка').addClass('weather-error');
            }
        });
    }

    function fetchWeatherByIP() {
        $.get("https://ip-api.com/json", function (locationData) {
            fetchWeather(locationData.lat, locationData.lon);
        }).fail(function () {
            $('#weather-condition').text('Ошибка локации').addClass('weather-error');
        });
    }

    function getWeather() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                fetchWeatherByIP
            );
        } else {
            fetchWeatherByIP();
        }
    }

    function init() {
        $('head').append(style);

        const timeBlock = $('.head__time');
        if (timeBlock.length) {
            timeBlock.after(weatherHTML);
        }

        getWeather();

        // Обновляем каждые 30 минут
        setInterval(getWeather, 30 * 60 * 1000);
    }

    $(document).ready(function () {
        setTimeout(init, 3000);
    });

})();
