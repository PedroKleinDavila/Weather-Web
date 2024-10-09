const apiKey = "a510d6f748149777617549e156ce784f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const apiTimeUrl = `https://timeapi.io/api/time/current/coordinate?latitude=`;
function search() {
    var city = document.getElementById("input").value;
    verifyWeather(city);
}

const input = document.querySelector("input");
input.addEventListener('focus', () => {
    input.classList.remove('red');
});

defaultApp();

async function verifyWeather(city) {
    try {
        clearInterval(interval);
        const input = document.querySelector("input");
        input.classList.remove('red');
        const result = await fetch(apiUrl + "&appid=" + apiKey + "&q=" + city);
        const data = await result.json();
        if (data.cod != 200) {
            throw data.cod;
        }
        var celcius = parseInt(data.main.temp) + "°C";
        var city = data.name;
        var humidity = data.main.humidity + "%";
        var wind = data.wind.speed + "km/h";
        var sky = data.weather[0].main;
        var lon = data.coord.lon;
        var lat = data.coord.lat;
        const resultWeather = await fetch(apiTimeUrl + lat + "&longitude=" + lon);
        const weatherData = await resultWeather.json();
        clock(weatherData);
        const horario = document.querySelector('.clock');
        horario.classList.remove('hide');
        var hour = parseInt(weatherData.hour);
        if (hour > 5 && hour < 18) {
            dayImg(sky);
        } else {
            nightImg(sky);
        }
        document.getElementById("temp").innerHTML = celcius;
        document.getElementById("city").innerHTML = city;
        document.getElementById("humidity").innerHTML = humidity;
        document.getElementById("wind").innerHTML = wind;
        console.log(sky);
        console.log(data);
    } catch (error) {
        console.log("Error " + error);
        input.classList.add('red');
        input.value = "";
        input.placeholder = "Inexistent city";
    }
}


function dayImg(sky) {
    if (sky == "Haze" || sky == "Mist") {
        sky = "HazeMist";
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("weather").classList.remove("image-display");
    switch (sky) {
        case "Clear":
            document.getElementById("weather").src = "../assets/Sunday-Clear.svg";
            document.getElementById("in").style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
            document.getElementById("out").style = "background:linear-gradient(#5CC2FD,#FFFFFF);";
            break;
        case "Rain":
            document.getElementById("weather").src = "../assets/RainDay.svg";
            document.getElementById("in").style = "background:linear-gradient(#86B1CA,#005C91);";
            document.getElementById("out").style = "background:linear-gradient(#075980,#B2D0DD);";
            break;
        case "Storm":
            document.getElementById("weather").src = "../assets/Storm.svg";
            document.getElementById("in").style = "background:linear-gradient(#9C90F0,#142C98);";
            document.getElementById("out").style = "background:linear-gradient(#02167A,#7E6ECF);";

        case "Clouds":
            document.getElementById("weather").src = "../assets/CloudyDay.svg";
            document.getElementById("in").style = "background:linear-gradient(#BEE6EF,#303F4E);";
            document.getElementById("out").style = "background:linear-gradient(#435356,#9BB5C5);";

            break;

        case "HazeMist":
            mistHaze();
            break;

        case "Snow":
            snow();
            break;
        default:
            break;
    }
}
function defaultApp() {
    document.querySelector(".wind").classList.add("image-display");
    document.querySelector(".humidity").classList.add("image-display");
    document.querySelector("#weather").classList.add("image-display");
    document.getElementById("in").style = "background:linear-gradient(#2B3C45,#024360);";
    document.getElementById("out").style = "background:linear-gradient(#3A4D68,#04283E);";
}

function nightImg(night) {
    if (night == "Haze" || night == "Mist") {
        night = "HazeMist"
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("weather").classList.remove("image-display");
    switch (night) {
        case "Clear":
            document.getElementById("weather").src = "../assets/MoonNight-Clear.svg";
            document.getElementById("in").style = "background:linear-gradient(#06527E,#1D1B1B);";
            document.getElementById("out").style = "background:linear-gradient(#000304,#0C6AA0);";
            break;
        case "Rain":
            document.getElementById("weather").src = "../assets/RainNight.svg";
            document.getElementById("in").style = "background:linear-gradient(#000000,#000681);";
            document.getElementById("out").style = "background:linear-gradient(#015382,#08113F);";
            break;
        case "Storm":
            document.getElementById("weather").src = "../assets/Storm.svg";
            document.getElementById("in").style = "background:linear-gradient(#33394C,#000000);";
            document.getElementById("out").style = "background:linear-gradient(#000000,#2F3352);";

        case "Clouds":
            document.getElementById("weather").src = "../assets/CloudyNight.svg";
            document.getElementById("in").style = "background:linear-gradient(#8D95A8,#161621);";
            document.getElementById("out").style = "background:linear-gradient(#000000,#49555C);";

            break;
        case "HazeMist":
            mistHaze();
            break;
        case "Snow":
            snow();
            break;
        default:
            break;
    }

}


function mistHaze() {
    document.getElementById("weather").src = "../assets/HazeMist.svg";
    document.getElementById("in").style = "background:linear-gradient(#ADD3D5, #65AFB5);";
    document.getElementById("out").style = "background:linear-gradient(#6F99A3,#DDE8EB);";
}
function snow() {
    document.getElementById("cliami").src = "../assets/Snowing.svg";
    document.getElementById("in").style = "background:linear-gradient(#D6F0FF,#00AEFF);";
    document.getElementById("out").style = "background:linear-gradient(#00A2FF,#FFFFFF);";
}

document.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        search();
    }
});

let interval;

function clock(weatherData) {
    console.log(weatherData)
    const hours = document.querySelector('.hours');
    const minutes = document.querySelector('.minutes');
    const seconds = document.querySelector('.seconds');
    let num;
    if (parseInt(weatherData.hour) < 10) {
        num = parseInt(weatherData.hour);
        hours.innerText = `0${num}`;
    } else {
        hours.innerText = parseInt(weatherData.hour);
    }

    if (parseInt(weatherData.minute) < 10) {
        num = parseInt(weatherData.minute);
        minutes.innerText = `0${num}`;
    } else {
        minutes.innerText = parseInt(weatherData.minute);
    }

    if (parseInt(weatherData.seconds) < 10) {
        num = parseInt(weatherData.seconds);
        seconds.innerText = `0${num}`;
    } else {
        seconds.innerText = parseInt(weatherData.seconds);
    }

    interval = setInterval(addSeg, 1000);
    function addSeg() {
        if (parseInt(seconds.innerText) != 59) {
            if (parseInt(seconds.innerText) + 1 < 10) {
                let seg = parseInt(seconds.innerText) + 1;
                seconds.innerText = `0${seg}`;
            } else {
                seconds.innerText = parseInt(seconds.innerText) + 1;
            }
        } else {
            seconds.innerText = '00';
            if (parseInt(minutes.innerText) != 59) {
                if (parseInt(minutes.innerText) + 1 < 10) {
                    let min = parseInt(minutes.innerText) + 1;
                    minutes.innerText = `0${min}`;
                } else {
                    minutes.innerText = parseInt(minutes.innerText) + 1;
                }
            } else {
                minutes.innerText = '00';
                if (parseInt(hours.innerText) != 23) {
                    if (parseInt(hours.innerText) + 1 < 10) {
                        let hora = parseInt(hours.innerText) + 1;
                        hours.innerText = `0${hora}`;
                    } else {
                        hours.innerText = parseInt(hours.innerText) + 1;
                    }
                } else {
                    hours.innerText = '00';
                }
            }
        }
    }
}
