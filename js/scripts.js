//Declaraciones y llamadas
let nav2Coins = document.querySelector('#nav2Coins');
let selectCoins = document.querySelector('#selectCoins');
const api_key_nomics = config.apikey;
const url = "https://api.nomics.com/v1/currencies/ticker?key=" + api_key_nomics;
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


//--------------------------------------------CONECTAR WALLET---------------
document.getElementById('connect-button').addEventListener('click', event => {
    let account;
    let divBalance = document.createElement('div');
    let redirectButton = document.createElement('button');
    let button = event.target;
    ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            account = accounts[0];
            button.textContent = "Billetera conectada: " + account;
            // Agrega mensaje de conexión exitosa
            let successMsg = document.createElement('p');
            successMsg.textContent = "¡Ha conectado su billetera de Metamask correctamente!";
            successMsg.style.color = "green";
            button.after(successMsg);
            // La billetera está conectada, habilita el botón de redireccionamiento
            successMsg.after(redirectButton);
            redirectButton.style.display = 'block';
            redirectButton.addEventListener('click', () => {
                // Redirige a la página "second.html"
                window.location.href = 'second.html';
            });
            //escribir balance de ETHs de la cartera 
            ethereum
                .request({ method: 'eth_getBalance', params: [account, 'latest'] })
                .then(result => {
                    let wei = parseInt(result, 16);
                    let balance = wei / (10 ** 18);
                    divBalance.textContent = "Usted tiene " + balance + " ETH en su billetera de Metamask";
                    button.after(divBalance);
                });
        });
})


