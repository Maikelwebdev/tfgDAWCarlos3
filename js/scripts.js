//Declaraciones y llamadas
let nav2Coins = document.querySelector('#nav2Coins');
let selectCoins = document.querySelector('#selectCoins');
const url = "https://api.nomics.com/v1/currencies/ticker?key=fb5b5c9e8fcfcff6f3f853406e6d5d0006e3f10a";
var coinId;
// &ids=BTC,ETH,IOT

//rellenamos el select con las coins
fetch(url)
    .then(response => response.json())
    .then(data => rellenarSelect(data));


//Funcion rellenar Select donde se crea el evento de onchange
function rellenarSelect(data) {
    //rellenamos el select con una coin en cada option
    for (const coin of data) {
        let opcionCoin = document.createElement('option');
        opcionCoin.textContent = coin.id;
        selectCoins.append(opcionCoin);
    }

    //Settimeout para cargar la primera coin
    setTimeout(() => {
        [{ id: coinId }] = data; //deestructuring para sacar la id de la primera coin
        llamarCoin(coinId);
    }, 1000);

    //añadimos el evento para que llame a la coin
    selectCoins.addEventListener('change', (e) => {
        coinId = e.target.value;
        llamarCoin(coinId)
    })
    setInterval(getCoinById, 2000);
}

function getCoinById() {
    if (!coinId) {
        return;
    }
    llamarCoin(coinId);
}

//Fetch a la coin seleccionada y luego llamada a la funcion de muestra de la coin
function llamarCoin(coinId) {
    let filtro = "&ids=" + coinId;
    fetch(url + filtro)
        .then(response => response.json())
        .then(data => mostrarCoin(data));
    console.log("Se esta haciendo fetch de:" + coinId);
}


//Funcion llamada desde el fetch donde se muestra la coin elegida
function mostrarCoin(data) {
    nav2Coins.textContent = "";
    for (const criptocoin of data) {
        //Crear div de la moneda
        let divCoin = document.createElement('div');
        divCoin.classList.add("divCoin");
        //name,precioEnDolares, numeroCoinsConUnDolar, logoCoin
        let nameCripto = document.createElement('div');
        nameCripto.textContent = criptocoin.name;
        //
        let precioCriptoEnDolares = document.createElement('div');
        precioCriptoEnDolares.textContent = criptocoin.price.substring(0, 8) + " $/" + criptocoin.id;
        //
        let precioDolaresCripto = document.createElement('div');
        precioDolaresCripto.textContent = (1 / criptocoin.price);
        precioDolaresCripto.textContent = precioDolaresCripto.textContent.substring(0, 10) + " " + criptocoin.id + "/$";
        //
        let divImgCripto = document.createElement('div');
        divImgCripto.classList.add("divImgCripto");
        let imgCripto = document.createElement('img');
        imgCripto.src = criptocoin.logo_url;
        divImgCripto.append(imgCripto);
        //append de la moneda al nav2Coins
        divCoin.append(nameCripto, precioCriptoEnDolares, precioDolaresCripto, divImgCripto);
        nav2Coins.append(divCoin);
    }
}