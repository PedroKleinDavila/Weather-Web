const apiKey ="a510d6f748149777617549e156ce784f";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric";
const apiTimeUrl=`https://timeapi.io/api/time/current/coordinate?latitude=`;
function pesquisa(){
    var city=document.getElementById("input").value;
    verificaTempo(city);
}

const input = document.querySelector("input");
input.addEventListener('focus',()=>{
    input.classList.remove('vermelho');
});

defaultApp();

async function verificaTempo(city) {
    try{
        clearInterval(intervalo);
        const input = document.querySelector("input");
        input.classList.remove('vermelho');
        const resultado = await fetch(apiUrl+"&appid="+apiKey+"&q="+city);
        const dados= await resultado.json();
        if(dados.cod!=200){
            throw dados.cod;
        }
        var celcius=parseInt(dados.main.temp)+"°C";
        var cidade=dados.name;
        var humidade=dados.main.humidity+"%";
        var vento=dados.wind.speed+"km/h";
        var ceu=dados.weather[0].main;
        var lon=dados.coord.lon;
        var lat=dados.coord.lat;
        const resultadoTempo = await fetch(apiTimeUrl+lat+"&longitude="+lon);
        const dadosTempo= await resultadoTempo.json();
        relogio(dadosTempo);
        const horario = document.querySelector('.relogio');
        horario.classList.remove('some');
        var hour=parseInt(dadosTempo.hour);
        if(hour>5&&hour<18){
            ceuImg(ceu);
        }else{
            nightImg(ceu);
        }
        document.getElementById("temp").innerHTML=celcius;
        document.getElementById("city").innerHTML=cidade;
        document.getElementById("humidity").innerHTML=humidade;
        document.getElementById("wind").innerHTML=vento;
        console.log(ceu);   
        console.log(dados);
    }catch(error){
        console.log("Erro " +error);
        input.classList.add('vermelho');
        input.value = "";
        input.placeholder = "Inexistent city";
    }
}


function ceuImg(ceu){
    if(ceu == "Haze" || ceu == "Mist"){
        ceu = "HazeMist";
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("climai").classList.remove("image-display");
    switch(ceu){
        case "Clear":
            document.getElementById("climai").src="./assets/Sunday-Clear.svg";
            document.getElementById("dentro").style="background:linear-gradient(#D5E5EE,#5EB8ED);";
            document.getElementById("fora").style="background:linear-gradient(#5CC2FD,#FFFFFF);";
            break;
        case "Rain":    
            document.getElementById("climai").src="./assets/RainDay.svg"; 
            document.getElementById("dentro").style="background:linear-gradient(#86B1CA,#005C91);";
            document.getElementById("fora").style="background:linear-gradient(#075980,#B2D0DD);";
            break;
        case "Storm":
            document.getElementById("climai").src="./assets/Storm.svg";
            document.getElementById("dentro").style="background:linear-gradient(#9C90F0,#142C98);";
            document.getElementById("fora").style="background:linear-gradient(#02167A,#7E6ECF);";
        
        case "Clouds":
            document.getElementById("climai").src="./assets/CloudyDay.svg";
            document.getElementById("dentro").style="background:linear-gradient(#BEE6EF,#303F4E);";
            document.getElementById("fora").style="background:linear-gradient(#435356,#9BB5C5);";

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
function defaultApp(){
        document.querySelector(".wind").classList.add("image-display");
        document.querySelector(".humidity").classList.add("image-display");
        document.querySelector("#climai").classList.add("image-display");
        document.getElementById("dentro").style="background:linear-gradient(#2B3C45,#024360);";
        document.getElementById("fora").style="background:linear-gradient(#3A4D68,#04283E);";
}

function nightImg(night){
    if(night == "Haze" || night == "Mist"){
        night = "HazeMist"
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("climai").classList.remove("image-display");
    switch(night){
        case "Clear":
            document.getElementById("climai").src="./assets/MoonNight-Clear.svg";
            document.getElementById("dentro").style="background:linear-gradient(#06527E,#1D1B1B);";
            document.getElementById("fora").style="background:linear-gradient(#000304,#0C6AA0);";
            break;
        case "Rain":
            document.getElementById("climai").src="./assets/RainNight.svg";
            document.getElementById("dentro").style="background:linear-gradient(#000000,#000681);";
            document.getElementById("fora").style="background:linear-gradient(#015382,#08113F);";
            break;
        case "Storm":
            document.getElementById("climai").src="./assets/Storm.svg";
            document.getElementById("dentro").style="background:linear-gradient(#33394C,#000000);";
            document.getElementById("fora").style="background:linear-gradient(#000000,#2F3352);";
            
        case "Clouds":
            document.getElementById("climai").src="./assets/CloudyNight.svg";
            document.getElementById("dentro").style="background:linear-gradient(#8D95A8,#161621);";
            document.getElementById("fora").style="background:linear-gradient(#000000,#49555C);";
            
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


function mistHaze(){
    document.getElementById("climai").src="./assets/HazeMist.svg";
    document.getElementById("dentro").style="background:linear-gradient(#ADD3D5, #65AFB5);";
    document.getElementById("fora").style="background:linear-gradient(#6F99A3,#DDE8EB);";
}
function snow(){
    document.getElementById("cliami").src="./assets/Snowing.svg";
    document.getElementById("dentro").style="background:linear-gradient(#D6F0FF,#00AEFF);";
    document.getElementById("fora").style="background:linear-gradient(#00A2FF,#FFFFFF);";
}

document.addEventListener('keydown',(e)=>{  
    if(e.key == "Enter"){
        pesquisa();
    }
});

let intervalo;

function relogio(dadosTempo){
    console.log(dadosTempo)
    const horas = document.querySelector('.horas');
    const minutos = document.querySelector('.minutos');
    const segundos = document.querySelector('.segundos');
    let num;
    if(parseInt(dadosTempo.hour) < 10){
        num = parseInt(dadosTempo.hour);
        horas.innerText = `0${num}`;
    }else{
        horas.innerText = parseInt(dadosTempo.hour);
    }
    
    if(parseInt(dadosTempo.minute) < 10){
        num = parseInt(dadosTempo.minute);
        minutos.innerText = `0${num}`;
    }else{
        minutos.innerText = parseInt(dadosTempo.minute);
    }

    if(parseInt(dadosTempo.seconds) < 10){
        num = parseInt(dadosTempo.seconds);
        segundos.innerText = `0${num}`;
    }else{
        segundos.innerText = parseInt(dadosTempo.seconds);
    }

    intervalo = setInterval(addSeg,1000);
    function addSeg(){
        if(parseInt(segundos.innerText) != 59){
            if(parseInt(segundos.innerText) + 1 < 10){
                let seg = parseInt(segundos.innerText) + 1;
                segundos.innerText = `0${seg}`;
            }else{
                segundos.innerText = parseInt(segundos.innerText) + 1;  
            }
        }else{
            segundos.innerText = '00';
            if(parseInt(minutos.innerText) != 59){
                if(parseInt(minutos.innerText) + 1 < 10){
                    let min = parseInt(minutos.innerText) + 1;
                    minutos.innerText = `0${min}`;
                }else{
                    minutos.innerText = parseInt(minutos.innerText) + 1;
                }   
            }else{
                minutos.innerText = '00';
                if(parseInt(horas.innerText) != 23){
                    if(parseInt(horas.innerText) + 1 < 10){
                        let hora = parseInt(horas.innerText) + 1;
                        horas.innerText = `0${hora}`;
                    }else{
                        horas.innerText = parseInt(horas.innerText) + 1;
                    }
                }else{
                    horas.innerText = '00';
                }
            }
        }
    }
}
