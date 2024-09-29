#!/usr/bin/env node

const fetch = require('node-fetch');
const prompts = require('prompts');

const log = console.log;

const api = {
    key: 'f9d625307c5f45d37d71bfa6510c7061',
    base: "https://api.openweathermap.org/data/2.5/"
};

function promptEngine() {
    (async () => {
        const response = await prompts({
            type: 'text',
            name: 'location',
            message: 'Enter City or Country'
        });

        outputThrower(response.location);
    })();
}

function outputThrower(location) {
    weatherEngine(location);
}

function weatherEngine(location) {
    fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
        .then(response => response.json())
        .then(weather => {
            log('');
            log(`🗺 Country: ${weather.sys.country}`);
            log(`🧭 Location: ${weather.name}`);
            log(`💨 Wind Speed: ${weather.wind.speed} m/s`);
            log(`🚩 Wind Direction: ${weather.wind.deg} degrees`);
            log(`🌡 Current Temperature: ${weather.main.temp}°c`);
            log(`⬆ Max Temperature: ${weather.main.temp_max}°c`);
            log(`⬇ Lowest Temperature: ${weather.main.temp_min}°c`);
            log(`🌄 Feels Like: ${weather.main.feels_like}°c`);
            log(`💧 Humidity: ${weather.main.humidity} %`);
            log(`☀ Condition: ${weather.weather[0].main}`);
        })
        .catch(error => log(error));
}

promptEngine();
