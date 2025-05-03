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
            gap: 10px;
            font-size: 1em;
            white-space: nowrap;
            line-height: 1.2em;
        }

        .weather-icon {
            width: 24px;
            height: 24px;
        }

        .weather-temp {
            font-weight: bold;
        }

        .weather-info {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
        }

        .weather-city {
            font-size: 0.9em;
            color: #ccc;
        }

        .weather-error {
            color: red;
        }
    </style>
    `;

    $('head').append(style);

    function WeatherInterface() {
        var html;
        var network = new Lampa.Reguest();

        this.create = function () {
            html = $('<div class="head__split"></div><div class="weather-container weather-widget">' +
                '<span class="weather-temp" id="weather-temp">--°</span>' +
                '<div class="weather-info">' +
                '<span class="weather-condition" id="weather-condition">Загрузка...</span>' +
                '<span class="weather-city" id="weather-city"></span>' +
                '</div>' +
                '</div>');
        };

        this.getWeatherData = function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var url = 'http://api.weatherapi.com/v1/current.json?key=' + API_KEY + '&q=' + lat + ',' + lon + '&lang=ru&aqi=no';

            network.clear();
            network.timeout(5000);
            network.silent(url, processWeatherData, processError);
        };

        function processWeatherData(result) {
            var data1 = result.location;
            var data2 = result.current;

            var temp = Math.floor(data2.temp_c);
            var condition = data2.condition.text;
            var city = data1.name;

            console.log("Погода", `Температура: ${temp}, Обстановка: ${condition}, Город: ${city}`);

            $('#weather-temp').text(temp + '°');
            $('#weather-condition').text(condition).toggleClass('long-text', condition.length > 10);
            $('#weather-city').text(city);
        }

        function processError() {
            console.log('Error retrieving weather data');
            $('#weather-condition').text('Ошибка');
            $('#weather-city').text('');
        }

        this.getWeatherByIP = function () {
            $.get("http://ip-api.com/json", function (locationData) {
                console.log("IP API", `Город: ${locationData.city}`);
                var position = {
                    coords: {
                        latitude: parseFloat(locationData.lat),
                        longitude: parseFloat(locationData.lon)
                    }
                };
                this.getWeatherData(position);
            }.bind(this));
        };

        this.getWeather = function () {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    this.getWeatherData.bind(this),
                    this.getWeatherByIP.bind(this)
                );
            } else {
                this.getWeatherByIP();
            }
        };

        this.render = function () {
            return html;
        };

        this.destroy = function () {
            if (html) {
                html.remove();
                html = null;
            }
        };
    }

    var weatherInterface = new WeatherInterface();
    var isTimeVisible = true;

    $(document).ready(function () {
        setTimeout(function () {
            weatherInterface.create();
            var weatherWidget = weatherInterface.render();
            $('.head__time').after(weatherWidget);

            function toggleDisplay() {
                if (isTimeVisible) {
                    $('.head__time').show();
                    $('.weather-widget').show();
                } else {
                    $('.head__time').show();
                    $('.weather-widget').show();
                }
                isTimeVisible = !isTimeVisible;
            }

            setInterval(toggleDisplay, 10000);

            weatherInterface.getWeather();

            $('.weather-widget').hide();
            var width_element = document.querySelector('.head__time');
            $('.weather-widget').css('width', width_element.offsetWidth + 'px');
            $('.head__time').css('width', width_element.offsetWidth + 'px');
        }, 5000);
    });

})();
