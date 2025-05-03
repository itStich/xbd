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
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&lang=ru&aqi=no`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const temp = Math.round(data.current.temp_c) + '°';
                const condition = data.current.condition.text;
                document.getElementById('weather-temp').textContent = temp;
                document.getElementById('weather-condition').textContent = condition;
            })
            .catch(() => {
                document.getElementById('weather-temp').textContent = '--°';
                document.getElementById('weather-condition').textContent = 'Ошибка';
            });
    }

    function initWeather() {
        // Добавляем стили
        $('head').append(style);

        // Вставляем блок погоды рядом с .head__time
        const timeBlock = $('.head__time');
        if (timeBlock.length) {
            timeBlock.after(weatherHTML);
        }

        // Получаем геолокацию или fallback
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => fallbackIP()
            );
        } else {
            fallbackIP();
        }

        // Обновляем погоду каждые 30 минут
        setInterval(() => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                    () => fallbackIP()
                );
            } else {
                fallbackIP();
            }
        }, 30 * 60 * 1000);
    }

    function fallbackIP() {
        $.get("https://ip-api.com/json", function (locationData) {
            fetchWeather(locationData.lat, locationData.lon);
        });
    }

    $(document).ready(function () {
        setTimeout(initWeather, 3000);
    });

})();
