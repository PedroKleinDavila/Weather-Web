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
    const favImg = document.querySelector('button img');
    favImg.src = "../assets/fav-vazio.svg";
    document.getElementById("search-button").disabled=true;
});

let verifySearch=false;
async function verifyWeather(city) {
    try {
        clearInterval(intervalo);
        const input = document.querySelector("input");
        input.classList.remove('red');
        const result = await fetch(apiUrl + "&appid=" + apiKey + "&q=" + city);
        const data = await result.json();
        if (data.cod != 200) {
            throw data.cod;
        }
        verifySearch=true;
        document.getElementById("search-button").disabled=false;
        var celcius = parseInt(data.main.temp) + "°C";
        var city = data.name;
        localStorage.setItem('city',city);
        var humidity = data.main.humidity + "%";
        var wind = data.wind.speed + "km/h";
        var sky = data.weather[0].main;
        localStorage.setItem('sky',sky);
        var lon = data.coord.lon;
        var lat = data.coord.lat;
        const resultWeather = await fetch(apiTimeUrl + lat + "&longitude=" + lon);
        const dataWeather = await resultWeather.json();
        clock(dataWeather);
        const hourrio = document.querySelector('.clock');
        hourrio.classList.remove('hide');
        var hour = parseInt(dataWeather.hour);
        localStorage.setItem('hour',hour);
        document.getElementById("temp").innerHTML = celcius;
        document.getElementById("city").innerHTML = city;
        document.getElementById("humidity").innerHTML = humidity;
        document.getElementById("wind").innerHTML = wind;
        var day=dataWeather.day;
        var month=dataWeather.month;
        var year=dataWeather.year;
        var dayMonthYear=day+"/"+month+"/"+year;
        await history(city,dayMonthYear,parseInt(data.main.temp),parseInt(data.main.humidity),sky,parseFloat(wind),parseInt(hour));
        await takeHistory();
        if (hour > 5 && hour < 18) {
            skyImg(sky);
        } else {
            nightImg(sky);
        }
    } catch (error) {
        console.log("Erro " + error);
        input.classList.add('red');
        input.value = "";
        input.placeholder = "Inexistent city";
    }
}


async function skyImg(sky) {
    await takeFavorites();
    const historyItems = document.querySelectorAll('.item-geral');
    if (sky == "Haze" || sky == "Mist") {
        sky = "HazeMist";
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("weather1").classList.remove("image-display");
    switch (sky) {
        case "Clear":
            document.getElementById("weather1").src = "../assets/Sunday-Clear.svg";
            document.getElementById("in").style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
            document.getElementById("out").style = "background:linear-gradient(#5CC2FD,#FFFFFF);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
            });
            break;
        case "Rain":
            document.getElementById("weather1").src = "../assets/RainDay.svg";
            document.getElementById("in").style = "background:linear-gradient(#86B1CA,#005C91);";
            document.getElementById("out").style = "background:linear-gradient(#075980,#B2D0DD);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#86B1CA,#005C91);";
            });
            break;
        case "Storm":
            document.getElementById("weather1").src = "../assets/storm.svg";
            document.getElementById("in").style = "background:linear-gradient(#9C90F0,#142C98);";
            document.getElementById("out").style = "background:linear-gradient(#02167A,#7E6ECF);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#9C90F0,#142C98);";
            });
            break;
        case "Clouds":
            document.getElementById("weather1").src = "../assets/CloudyDay.svg";
            document.getElementById("in").style = "background:linear-gradient(#BEE6EF,#303F4E);";
            document.getElementById("out").style = "background:linear-gradient(#435356,#9BB5C5);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#BEE6EF,#303F4E);";
            });
            break;
        case "HazeMist":
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
            });
            mistHaze();
            break;

        case "Snow":
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
            });
            snow();
            break;
        default:
            break;
    }
}


async function defaultApp() {
    await takeFavorites();
    await takeHistory();
    const historyItems = document.querySelectorAll('.item-geral');
    document.querySelector(".wind").classList.add("image-display");
    document.querySelector(".humidity").classList.add("image-display");
    document.querySelector("#weather1").classList.add("image-display");
    document.getElementById("in").style = "background:linear-gradient(#2B3C45,#024360);";
    document.getElementById("out").style = "background:linear-gradient(#3A4D68,#04283E);";
    historyItems.forEach((item) => {
        item.style = "background:linear-gradient(#2B3C45,#024360);";
    });
}

async function nightImg(night) {
    await takeFavorites();
    const historyItems = document.querySelectorAll('.item-geral');
    if (night == "Haze" || night == "Mist") {
        night = "HazeMist"
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("weather1").classList.remove("image-display");
    switch (night) {
        case "Clear":
            document.getElementById("weather1").src = "../assets/MoonNight-Clear.svg";
            document.getElementById("in").style = "background:linear-gradient(#06527E,#1D1B1B);";
            document.getElementById("out").style = "background:linear-gradient(#000304,#0C6AA0);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#06527E,#1D1B1B);";
            });
            break;
        case "Rain":
            document.getElementById("weather1").src = "../assets/RainNight.svg";
            document.getElementById("in").style = "background:linear-gradient(#000000,#000681);";
            document.getElementById("out").style = "background:linear-gradient(#015382,#08113F);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#000000,#000681);";
            });
            break;
        case "Storm":
            document.getElementById("weather1").src = "../assets/storm.svg";
            document.getElementById("in").style = "background:linear-gradient(#33394C,#000000);";
            document.getElementById("out").style = "background:linear-gradient(#000000,#2F3352);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#33394C,#000000);";
            });
            break;
        case "Clouds":
            document.getElementById("weather1").src = "../assets/CloudyNight.svg";
            document.getElementById("in").style = "background:linear-gradient(#8D95A8,#161621);";
            document.getElementById("out").style = "background:linear-gradient(#000000,#49555C);";
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#8D95A8,#161621);";
            });
            break;
        case "HazeMist":
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
            });
            mistHaze();
            break;
        case "Snow":
            historyItems.forEach((item) => {
                item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
            });
            snow();
            break;
        default:
            break;
    }

}


function mistHaze() {
    document.getElementById("weather1").src = "../assets/HazeMist.svg";
    document.getElementById("in").style = "background:linear-gradient(#ADD3D5, #65AFB5);";
    document.getElementById("out").style = "background:linear-gradient(#6F99A3,#DDE8EB);";
}
function snow() {
    document.getElementById("weather1").src = "../assets/Snowing.svg";
    document.getElementById("in").style = "background:linear-gradient(#D6F0FF,#00AEFF);";
    document.getElementById("out").style = "background:linear-gradient(#00A2FF,#FFFFFF);";
}

document.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        search();
    }
});

let intervalo;

function clock(dataWeather) {
    const hours = document.querySelector('.hours');
    const minutes = document.querySelector('.minutes');
    const seconds = document.querySelector('.seconds');
    let num;
    if (parseInt(dataWeather.hour) < 10) {
        num = parseInt(dataWeather.hour);
        hours.innerText = `0${num}`;
    } else {
        hours.innerText = parseInt(dataWeather.hour);
    }

    if (parseInt(dataWeather.minute) < 10) {
        num = parseInt(dataWeather.minute);
        minutes.innerText = `0${num}`;
    } else {
        minutes.innerText = parseInt(dataWeather.minute);
    }

    if (parseInt(dataWeather.seconds) < 10) {
        num = parseInt(dataWeather.seconds);
        seconds.innerText = `0${num}`;
    } else {
        seconds.innerText = parseInt(dataWeather.seconds);
    }

    intervalo = setInterval(addSeg, 1000);
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
                        let hour = parseInt(hours.innerText) + 1;
                        hours.innerText = `0${hour}`;
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
let posicao = localStorage.getItem('data');
let id = data();
async function data() {
    let data;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => data = data)
        .catch(error => console.error('Error:', error));
    console.log(data);
    id = data[posicao].id;
    return id;
}
async function favorites() {
    const favImg = document.querySelector('button img');
    if (favImg.getAttribute("src") == "../assets/fav-cheio.svg") {
        favImg.src = "../assets/fav-vazio.svg";
    } else {
        favImg.src = "../assets/fav-cheio.svg";
    }
    let city = localStorage.getItem('city');
    localStorage.removeItem('city');
    let bol = await verificacityFavorita(city);
    if ((city != '') && bol) {
        novacityFav(city);
    }
}
async function novacityFav(city) {
    let data;
    await fetch("http://localhost:8080/favorite", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "city": city,
            "id": id
        })
    }).then(response => response.json())
        .then(data => data = data)
        .catch(error => console.error('Error:', error));
    await takeFavorites();
    var sky=localStorage.getItem('sky');
    var hour=localStorage.getItem('hour');
    atualizaFav(hour,sky);
    localStorage.removeItem('sky');
    localStorage.removeItem('hour');
}
async function verificacityFavorita(city) {
    let data;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => data = data)
        .catch(error => console.error('Error:', error));
    let bol = true;
    if (data[posicao].favorites.length != 0) {
        for (i = 0; i < data[posicao].favorites.length; i++) {
            if (city.toLowerCase() == String(data[posicao].favorites[i].city).toLowerCase()) {
                bol = false;
            }
        }
    }
    return bol;
}
async function takeFavorites() {
    let data;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => data = data)
        .catch(error => console.error('Error:', error));
    if (data[posicao].favorites.length != 0) {
        document.getElementById("favorites").innerHTML = "";
        data[posicao].favorites.map(favorite => {
            var div = document.createElement("div");
            div.classList.add("favorite-item");
            div.classList.add("item-geral");
            div.innerHTML = favorite.city;
            div.onclick = function(){
                const city = div.innerHTML;
                document.getElementById("input").value=city;
                search();
            }
            document.getElementById("favorites").appendChild(div);
        })
    }
}
async function takeHistory() {
    let data;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => data = data)
        .catch(error => console.error('Error:', error));
    if (data[posicao].histories!=null&&data[posicao].histories.length != 0) {
        document.getElementById("historic").innerHTML = "";
        data[posicao].histories.map(hist => {
            var div = document.createElement("div");
            div.classList.add("historic-item");
            div.classList.add("item-geral");
            div.innerHTML = "<span class='text'>"+hist.city+"</span><span class='text'>"+hist.day
            +"</span><span class='text'>"+hist.temperature+
            "°C</span><div class='info'><img src='../assets/iconegota.svg' class='icon'><span class='icon-txt' id='humidity'>"+
            hist.humidity+"%</span></div>"+"<img src="+getImg(hist.hour,hist.weather)+" alt='' class='weather'>"+
            "<div class='info'><img src='../assets/Wind.svg'class='icon'><span class='icon-txt' id='wind'>"+hist.wind+
            "km/h</span></div>";
            document.getElementById("historic").appendChild(div);
        })
    }
}

async function history(city,day,temperature,humidity,weather,wind,hour){
    let data;
    await fetch("http://localhost:8080/history", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "city": city,
            "day":day,
            "humidity":humidity,
            "temperature":temperature,
            "weather":weather,
            "wind":wind,
            "hour":hour,
            "id": id
        })
    }).then(response => response.json())
        .then(data => data = data)
        .catch(error => console.error('Error:', error));
}
function getImg(hour,weather){
    if (weather == "Haze" || weather == "Mist") {
        weather = "HazeMist";
    }
    if(hour > 5 && hour < 18){
        switch(weather){
            case "Clear":
                return "../assets/Sunday-Clear.svg";
            case "Rain":
                return "../assets/RainDay.svg";
            case "Storm":
                return "../assets/storm.svg";
            case "Clouds":
                return "../assets/CloudyDay.svg";
            case "HazeMist":
                return "../assets/HazeMist.svg";
            case "Snow":
                return "../assets/Snowing.svg";
            default:
                break;
        }
    }else{
        switch(weather){
            case "Clear":
                return "../assets/MoonNight-Clear.svg";
            case "Rain":
                return "../assets/RainNight.svg";
            case "Storm":
                return "../assets/storm.svg";
            case "Clouds":
                return "../assets/CloudyNight.svg";
            case "HazeMist":
                return "../assets/HazeMist.svg";
            case "Snow":
                return "../assets/Snowing.svg";
            default:
                break;
        }
    }
}
function atualizaFav(hour,weather){
    const historyItems = document.querySelectorAll('.item-geral');
    if (weather == "Haze" || weather == "Mist") {
        weather = "HazeMist";
    }
    if(hour > 5 && hour < 18){
        switch(weather){
            case "Clear":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
                });
                break;
            case "Rain":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#86B1CA,#005C91);";
                });
                break;
            case "Storm":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#9C90F0,#142C98);";
                });
                break;
            case "Clouds":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#BEE6EF,#303F4E);";
                });
                break;
            case "HazeMist":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
                });
                break;
            case "Snow":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
                });
                break;
            default:
                break;
        }
    }else{
        switch(weather){
            case "Clear":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#06527E,#1D1B1B);";
                });
                break;
            case "Rain":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#000000,#000681);";
                });
                break;
            case "Storm":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#33394C,#000000);";
                });
                break;
            case "Clouds":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#8D95A8,#161621);";
                });
            case "HazeMist":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
                });
                break;
            case "Snow":
                historyItems.forEach((item) => {
                    item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
                });
                break;
            default:
                break;
        }
    }
}
defaultApp();
