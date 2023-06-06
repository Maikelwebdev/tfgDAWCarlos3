//Declaraciones y llamadas
let nav2Coins = document.querySelector('#nav2Coins'); //mostrar coins API
let selectCoins = document.querySelector('#selectCoins'); //select top 100 coins
//------opcion conectar wallet
let menuConnectWallet = document.querySelector('#menuConnectWallet'); //menu opcion
let isConnectedWallet = false;
let isActive = document.querySelector('#isActive');
isActive.style.color = "red";
let iconWallet = document.createElement('iconWallet');
let redirectButton = document.createElement('button');
//---datos API
const api_key_cmc = config.apikey;
//--- div de las monedas
let divCoin = document.createElement('div');
divCoin.classList.add("divCoin");
var coinId;
let divBalance = document.createElement('div');

// -------------------------------------API + COINS--------------------------------------------------
let dataCoins = [];

const url = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=100&sortBy=market_cap&sortType=desc';

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    dataCoins = data.data.cryptoCurrencyList;
    rellenarSelectCoins(dataCoins);
  })
  .catch(error => {
    console.log('Error:', error);
  });

function rellenarSelectCoins(dataCoins) {
  const selectCoins = document.getElementById('selectCoins');

  dataCoins.forEach(coin => {
    let opcionCoin = document.createElement('option');
    opcionCoin.textContent = coin.name;
    opcionCoin.value = coin.id;
    selectCoins.appendChild(opcionCoin);
  });

  const firstCoinId = dataCoins[0].id;
  mostrarCoin(firstCoinId);

  selectCoins.addEventListener('change', (e) => {
    const coinId = e.target.value;
    mostrarCoin(coinId);
  });

  setInterval(() => {
    const coinId = selectCoins.value;
    mostrarCoin(coinId);
  }, 10000);
}

function mostrarCoin(coinId) {
  for (const coin of dataCoins) {
    if (coin.id == coinId) {
      nav2Coins.textContent = '';
      let divCoin = document.createElement('div');
      divCoin.style.backgroundColor = 'white';
      divCoin.style.borderRadius = '8px';
      divCoin.style.color = '#1abc9c';
      divCoin.style.padding = '20px';
      divCoin.style.textAlign = 'center';


      let nameCripto = document.createElement('div');
      nameCripto.textContent = coin.name;

      let precioCriptoEnDolares = document.createElement('div');
      precioCriptoEnDolares.textContent = '1' + coin.symbol + ' = ' + coin.quotes[0].price.toFixed(2) + '$'; //1BTC = X$

      let precioDolaresCripto = document.createElement('div');
      precioDolaresCripto.textContent = '1$ = ' + (1 / coin.quotes[0].price).toFixed(10) + coin.symbol; //1$ = XBTC

      divCoin.append(nameCripto, precioCriptoEnDolares, precioDolaresCripto);
      nav2Coins.append(divCoin);
    }
  }
}


//--------------------------------------------CONECTAR WALLET---------------
document.addEventListener('DOMContentLoaded', function () {
  comprobarConexionWallet();
});

menuConnectWallet.addEventListener("click", function (event) { //CONECTAR WALLET
  comprobarInstalacionMetamask()
  conectarMetamask(event);
});

function comprobarInstalacionMetamask() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('Metamask está instalado correctamente.');
  } else {
    console.log('Por favor, instale Metamask para utilizar esta función.');
    const linkDescargaMetamask = 'https://metamask.io/download.html';
    window.open(linkDescargaMetamask, '_blank');
  }
}

async function comprobarConexionWallet() {
  if (typeof window.ethereum !== 'undefined') {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      console.log('La wallet de Metamask está conectada correctamente.');
      isActive.style.color = "green";
      menuConnectWallet.textContent = "CONNECTED WALLET";
      descubrirOpcion()   
    } else {
      console.log('La wallet de Metamask está instalada, pero no está conectada.');
    }
  } else {
    console.log('Por favor, instale Metamask para utilizar esta función.');
  }
}

async function conectarMetamask() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    comprobarConexionWallet()
  } else {
    console.log('Por favor, instale Metamask para utilizar esta función.');
  }
}

function descubrirOpcion() {
  let menuOpcionExtra = document.querySelector('#menuOpcionExtra'); //menu opcion
  menuOpcionExtra.classList.remove('esOculto');
  menuOpcionExtra.classList.add('esVisible');
  menuOpcionExtra.style.cursor = 'pointer';
  menuOpcionExtra.addEventListener('click', function() {
    window.location.href = 'second.html'; 
  });
}
