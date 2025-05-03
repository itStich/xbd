(function () {
    'use strict';
    
   function WeatherInterface() {
        this.create = function () {
            var weatherHTML = `
                <div class="weather-widget">
                    <div class="weather-temp" id="weather-temp"></div>
                    <div class="weather-condition" id="weather-condition"></div>
                </div>
            `;
            $('body').append('<div id="weather-interface">' + weatherHTML + '</div>');
        };

        this.render = function () {
            return $('#weather-interface .weather-widget');
        };

        this.getWeather = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    this.getWeatherData.bind(this),
                    this.getLocationByIP.bind(this),
                    { enableHighAccuracy: true }
                );
            } else {
                this.getLocationByIP();
            }
        };

        this.getLocationByIP = function () {
            fetch('http://ip-api.com/json')
                .then((response) => response.json())
                .then((data) => {
                    const position = {
                        coords: {
                            latitude: data.lat,
                            longitude: data.lon
                        }
                    };
                    this.getWeatherData(position);
                })
                .catch(this.processError);
        };

        this.getWeatherData = function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = 'e8d6a31f7f3a49d6b25115928240104';
            const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=ru`;

            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => this.processWeatherData(data))
                .catch(this.processError);
        };

        this.processWeatherData = function (result) {
            const temp = result.current.temp_c;
            const condition = result.current.condition.text;

            $('#weather-temp').text(temp + '°C');
            $('#weather-condition').text(condition);

            // Уменьшим размер текста при длинном описании
            if (condition.length > 20) {
                $('#weather-condition').addClass('long-text');
            } else {
                $('#weather-condition').removeClass('long-text');
            }
        };

        this.processError = function (error) {
            console.error('Ошибка при получении данных о погоде:', error);
        };

        this.destroy = function () {
            $('#weather-interface').remove();
        };
    }





    var weatherInterface = new WeatherInterface();

    var weatherInterface = new WeatherInterface();

    $(document).ready(function () {
        setTimeout(function () {
            weatherInterface.create();
            var weatherWidget = weatherInterface.render();

            // Вставка рядом с head__time
            $('.head__time').after('<div class="head__split"></div>');
            $('.head__split').after(weatherWidget);

            weatherInterface.getWeather();

            // Подгон ширины
            var width_element = document.querySelector('.head__time');
            console.log(width_element.offsetWidth);
            $('.weather-widget').css('width', width_element.offsetWidth + 'px');
            $('.head__time').css('width', width_element.offsetWidth + 'px');
        }, 5000);
    });
	
})();
