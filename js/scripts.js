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

function rellenarSelectCoins(dataCoins) 
{
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
  console.log("mostrarCoin");
  console.log(dataCoins);
  console.log(coinId);

  for (const coin in dataCoins) {
    if (coin.id == coinId) {
      console.log("Coinciden");
      console.log(coin.id);
      console.log(coinId);
      
    }
  }

  nav2Coins.textContent = '';
  let divCoin = document.createElement('div');
  
  let nameCripto = document.createElement('div');
  nameCripto.textContent = coinInfo.name;
  let precioCriptoEnDolares = document.createElement('div');
  precioCriptoEnDolares.textContent = '1'+ coinInfo.symbol+' = ' + coinInfo.quotes[0].price.toFixed(2)+'$'; //1BTC = X$
  
  let precioDolaresCripto = document.createElement('div');
  precioDolaresCripto.textContent = '1$ = '+(1 / coinInfo.quotes[0].price).toFixed(10)+ coinInfo.symbol; //1$ = XBTC
  
  divCoin.append(nameCripto, precioCriptoEnDolares, precioDolaresCripto);
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