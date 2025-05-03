(function () {
    const css = `
    .weather-widget {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 14px;
        color: white;
        text-shadow: 0 0 2px black;
    }
    .weather-temp {
        font-weight: bold;
    }
    .weather-condition {
        font-size: 14px;
        opacity: 0.8;
    }
    .weather-condition.long-text {
        font-size: 12px;
    }
    .head__split {
        width: 1px;
        height: 30px;
        background: rgba(255, 255, 255, 0.2);
        margin: 0 10px;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    class WeatherInterface {
        constructor() {
            this.apiKey = 'e8d6a31f7f3a49d6b25115928240104';
        }

        create() {
            const html = `
                <div id="weather-interface">
                    <div class="weather-widget">
                        <div class="weather-temp" id="weather-temp"></div>
                        <div class="weather-condition" id="weather-condition"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        render() {
            return document.querySelector('#weather-interface .weather-widget');
        }

        getWeather() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    pos => this.getWeatherData(pos),
                    () => this.getLocationByIP()
                );
            } else {
                this.getLocationByIP();
            }
        }

        getLocationByIP() {
            fetch('https://ip-api.com/json')
                .then(res => res.json())
                .then(data => {
                    const position = {
                        coords: {
                            latitude: data.lat,
                            longitude: data.lon
                        }
                    };
                    this.getWeatherData(position);
                })
                .catch(err => console.error('Ошибка при получении геолокации по IP:', err));
        }

        getWeatherData(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}&lang=ru`;

            fetch(url)
                .then(res => res.json())
                .then(data => this.processWeatherData(data))
                .catch(err => this.processError(err));
        }

        processWeatherData(data) {
            const temp = data.current.temp_c;
            const condition = data.current.condition.text;

            document.getElementById('weather-temp').textContent = temp + '°C';
            const cond = document.getElementById('weather-condition');
            cond.textContent = condition;
            cond.classList.toggle('long-text', condition.length > 20);
        }

        processError(err) {
            console.error('Ошибка при получении данных о погоде:', err);
        }

        destroy() {
            const el = document.getElementById('weather-interface');
            if (el) el.remove();
        }
    }

    const weatherInterface = new WeatherInterface();

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            weatherInterface.create();
            const weatherWidget = weatherInterface.render();

            const timeEl = document.querySelector('.head__time');
            if (timeEl && weatherWidget) {
                // Создаём и вставляем разделитель
                const split = document.createElement('div');
                split.className = 'head__split';
                timeEl.insertAdjacentElement('afterend', split);
                split.insertAdjacentElement('afterend', weatherWidget);

                // Подгоняем ширину
                const w = timeEl.offsetWidth;
                weatherWidget.style.width = w + 'px';
                timeEl.style.width = w + 'px';

                // Загружаем погоду
                weatherInterface.getWeather();
            }
        }, 5000);
    });
})();
