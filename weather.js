(function () {
    'use strict';

    const API_KEY = "46a5d8546cc340f69d9123207242801";

    const style = `
        <style>
            .weather-container {
                display: flex;
                align-items: center;
                gap: 10px;
                white-space: nowrap;
                font-size: 1em;
            }
            .weather-divider {
                margin: 0 5px;
                color: #999;
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
        <div class="weather-container" id="weather-display">
            <span class="current-time" id="current-time"></span>
            <span class="weather-divider">|</span>
            <span class="weather-temp" id="weather-temp"></span>
            <span class="weather-condition" id="weather-condition"></span>
        </div>
    `;

    function updateTime() {
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const formatted = now.toLocaleString('ru-RU', options).replace(',', '');
        document.getElementById('current-time').textContent = formatted;
    }

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
                document.getElementById('weather-temp').textContent = '??°';
                document.getElementById('weather-condition').textContent = 'Ошибка';
            });
    }

    function initWeather() {
        // Вставляем стили
        $('head').append(style);

        // Вставляем HTML в .head__time, заменяя его содержимое
        const container = $('.head__time');
        container.empty().append(weatherHTML);

        // Обновление времени каждую минуту
        updateTime();
        setInterval(updateTime, 60 * 1000);

        // Получаем погоду по геолокации
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => fallbackIP()
            );
        } else {
            fallbackIP();
        }
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
