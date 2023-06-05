//Declaraciones y llamadas
let nav2Coins = document.querySelector('#nav2Coins'); //mostrar coins API
let selectCoins = document.querySelector('#selectCoins'); //select top 100 coins
//------opcion conectar wallet
let menuConnectWallet = document.querySelector('#menuConnectWallet'); //menu opcion
let isConnectedWallet = false;
let isActive = document.querySelector('#isActive');
isActive.style.color="red";
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
const url = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/';

fetch(url + 'listing?start=1&limit=100&sortBy=market_cap&sortType=desc')
  .then(response => response.json())
  .then(data => {
    console.log(data.data.cryptoCurrencyList);
    rellenarSelectCoins(data.data.cryptoCurrencyList);
  })
  .catch(error => {
    console.log('Error:', error);
  });

function rellenarSelectCoins(data) {
  for (const coin of data) {
    let opcionCoin = document.createElement('option');
    opcionCoin.textContent = coin.name;
    selectCoins.append(opcionCoin);
  }
  
  setTimeout(() => {
    const firstCoinId = data[0].id;
    llamarCoin(firstCoinId);
  }, 1000);
  
  selectCoins.addEventListener('change', (e) => {
    coinId = e.target.value;
    llamarCoin(coinId);
  });
  
  setInterval(getCoinById, 10000);
}

function getCoinById() {
  if (!coinId) {
    return;
  }
  llamarCoin(coinId);
}

function llamarCoin(coinId) {
  fetch(`https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?id=${coinId}`)
  .then(response => response.json())
  .then(data => {
    console.log("Funcion llamarCoin" + coinId);
    mostrarCoin(data);
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

function mostrarCoin(data) {
  console.log("Mostrarcoin: "+data);
  nav2Coins.textContent = "";
  
  let divCoin = document.createElement('div');
  
  let nameCripto = document.createElement('div');
  nameCripto.textContent = data.name;
  data.cryptoCurrencyList[0].quotes[0].price
  let precioCriptoEnDolares = document.createElement('div');
  precioCriptoEnDolares.textContent = data.quotes.USD.price.substring(0, 8) + " $/" + data.symbol;
  
  let precioDolaresCripto = document.createElement('div');
  precioDolaresCripto.textContent = (1 / data.quotes.USD.price).toFixed(10) + " " + data.symbol + "/$";
  
  let divImgCripto = document.createElement('div');
  divImgCripto.classList.add("divImgCripto");
  let imgCripto = document.createElement('img');
  imgCripto.src = data.logo;
  divImgCripto.append(imgCripto);
  
  divCoin.append(nameCripto, precioCriptoEnDolares, precioDolaresCripto, divImgCripto);
  nav2Coins.append(divCoin);
}


//--------------------------------------------CONECTAR WALLET---------------
menuConnectWallet.addEventListener("click", function(event) { //CONECTAR WALLET
  conectarWallet(event);
});

function conectarWallet(event)
{
    let account;
    let button = event.target;
    ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            account = accounts[0];
            isActive.style.color = "green";
            button.textContent = "CONNECTED WALLET";
            isConnectedWallet = true;
            console.log("Esta conectada la wallet? : "+ isConnectedWallet);
        });
}

//------------Mostrar opciones afterWalletConnected
async function comprobarConexionMetamask() 
{
  if (typeof window.ethereum !== 'undefined') 
  {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Metamask conectado correctamente.');
    return true;
  } 
  else 
  {
    console.log('Por favor, instale y conecte Metamask para utilizar esta función.');
    const linkDescargaMetamask = 'https://metamask.io/download.html';
    window.open(linkDescargaMetamask, '_blank');
    return false;
  }
}


// Agrega mensaje de conexión exitosa
let successMsg = document.createElement('p');
successMsg.textContent = "¡Ha conectado su billetera de Metamask correctamente!";
successMsg.style.color = "green";
divCoin.after(successMsg);

//--- opciones AFTER WALLET CONNECTED
// if(cuentaConectada){
//   let menuOpcionExtra = document.querySelector('#menuOpcionExtra'); //menu opcion
//   let botonDonacion = document.querySelector('#bDonacion');
//   botonDonacion.addEventListener('click', enviarDonacion);
  //divQueSeOfrece //divOculto
  // La billetera está conectada, habilita el botón de redireccionamiento
  // Redirige a la página "second.html"
  //window.location.href = 'second.html';
// }


//escribir balance de ETHs de la cartera 
function getBalanceETH() {
  ethereum
    .request({ method: 'eth_getBalance', params: [account, 'latest'] })
    .then(result => 
      {
        let wei = parseInt(result, 16);
        let balance = wei / (10 ** 18);
        divBalance.textContent = "Usted tiene " + balance + " ETH en su billetera de Metamask";
        button.after(divBalance);
      });
}


async function enviarDonacion() 
{
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
  try 
  {
    const txHash = await cuenta.sendTransaction(transaction); // enviar transacción
    console.log('Transacción enviada:', txHash);
    const blockNumber = await provider.getBlockNumber(); // obtener número de bloque actual
    const block = await provider.getBlock(blockNumber); // obtener información del bloque actual
    console.log('Bloque de transacción:', block);
    // mostrar información del bloque en la página HTML (por ejemplo, usando DOM)
    document.getElementById('bloqueTransaccion').innerHTML = JSON.stringify(block);
  } 
  catch (error) 
  {
    console.error('Error al enviar transacción:', error);
  }
}

async function detectarProveedor() 
{
  if (window.ethereum) 
  {
    return window.ethereum;
  } 
  else if (window.web3) 
  {
    return window.web3.currentProvider;
  } 
  else 
  {
    throw new Error('No se pudo detectar proveedor de Ethereum');
  }
}

async function obtenerCuenta(provider) {

  const cuentas = await provider.request({ method: 'eth_requestAccounts' });
  if (cuentas.length === 0) 
  {
    throw new Error('No se encontró cuenta de MetaMask');
  }
  return provider.getSigner(cuentas[0]);
}

async function obtenerPrecioGas(provider) 
{
  const response = await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=:myapp');
  const data = await response.json();
  return provider.utils.parseUnits(String(data.data.rapid), 'gwei');
}