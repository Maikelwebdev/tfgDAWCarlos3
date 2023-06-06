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

// --- opciones AFTER WALLET CONNECTED

//   let botonDonacion = document.querySelector('#bDonacion');
//   botonDonacion.addEventListener('click', enviarDonacion);
// divQueSeOfrece //divOculto
// La billetera está conectada, habilita el botón de redireccionamiento
// }


//escribir balance de ETHs de la cartera 
function getBalanceETH() {
  ethereum
    .request({ method: 'eth_getBalance', params: [account, 'latest'] })
    .then(result => {
      let wei = parseInt(result, 16);
      let balance = wei / (10 ** 18);
      divBalance.textContent = "Usted tiene " + balance + " ETH en su billetera de Metamask";
      button.after(divBalance);
    });
}


async function enviarDonacion() {
  const address = 'aquí va la dirección de tu billetera'; // dirección de billetera a la que se enviará la donación
  const value = '10000000000000'; // cantidad en wei que se enviará (0.00001 ETH en wei)
  const provider = await detectarProveedor(); // detectar proveedor de Ethereum (por ejemplo, MetaMask)
  const cuenta = await obtenerCuenta(provider); // obtener cuenta de MetaMask
  const gasPrice = await obtenerPrecioGas(provider); // obtener precio actual del gas
  const transaction =
  {
    to: address,
    value: value,
    gasPrice: gasPrice
  };
  try {
    const txHash = await cuenta.sendTransaction(transaction); // enviar transacción
    console.log('Transacción enviada:', txHash);
    const blockNumber = await provider.getBlockNumber(); // obtener número de bloque actual
    const block = await provider.getBlock(blockNumber); // obtener información del bloque actual
    console.log('Bloque de transacción:', block);
    // mostrar información del bloque en la página HTML (por ejemplo, usando DOM)
    document.getElementById('bloqueTransaccion').innerHTML = JSON.stringify(block);
  }
  catch (error) {
    console.error('Error al enviar transacción:', error);
  }
}

async function detectarProveedor() {
  if (window.ethereum) {
    return window.ethereum;
  }
  else if (window.web3) {
    return window.web3.currentProvider;
  }
  else {
    throw new Error('No se pudo detectar proveedor de Ethereum');
  }
}

async function obtenerCuenta(provider) {

  const cuentas = await provider.request({ method: 'eth_requestAccounts' });
  if (cuentas.length === 0) {
    throw new Error('No se encontró cuenta de MetaMask');
  }
  return provider.getSigner(cuentas[0]);
}

async function obtenerPrecioGas(provider) {
  const response = await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=:myapp');
  const data = await response.json();
  return provider.utils.parseUnits(String(data.data.rapid), 'gwei');
}