//Declaraciones y llamadas
let nav2Coins = document.querySelector('#nav2Coins'); //mostrar coins API
let selectCoins = document.querySelector('#selectCoins'); //select top 100 coins
//------opcion conectar wallet
let menuConnectWallet = document.querySelector('#menuConnectWallet'); //menu opcion
let isActive = document.querySelector('#isActive');
isActive.style.color="red";
let iconWallet = document.createElement('iconWallet');
let redirectButton = document.createElement('button');
//---datos API
const api_key_nomics = config.apikey;
const url = "https://api.nomics.com/v1/currencies/ticker?key=" + fb5b5c9e8fcfcff6f3f853406e6d5d0006e3f10a;
//--- div de las monedas
let divCoin = document.createElement('div');
divCoin.classList.add("divCoin");
var coinId;
let divBalance = document.createElement('div');
//--- opciones AFTER WALLET CONNECTED
let menuOpcionExtra = document.querySelector('#menuOpcionExtra'); //menu opcion
let botonDonacion = document.querySelector('#bDonacion');
botonDonacion.addEventListener('click', enviarDonacion);


// -------------------------------------API + COINS--------------------------------------------------

//rellenamos el select con las coins
fetch(url)
    .then(response => response.json())
    .then(data => rellenarSelect(data));

//Funcion rellenar Select donde se crea el evento de onchange
function rellenarSelect(data) {
    //rellenamos el select con una coin en cada option
    for (const coin of data) 
    {
        let opcionCoin = document.createElement('option');
        opcionCoin.textContent = coin.id;
        selectCoins.append(opcionCoin);
    }
    //Settimeout para cargar la primera coin
    setTimeout(() => 
    {
        [{ id: coinId }] = data; //deestructuring para sacar la id de la primera coin
        llamarCoin(coinId);
    }, 1000);
    //añadimos el evento para que llame a la coin
    selectCoins.addEventListener('change', (e) => 
    {
        coinId = e.target.value;
        llamarCoin(coinId)
    })
    setInterval(getCoinById, 2000);
}

function getCoinById() 
{
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
function mostrarCoin(data) 
{
    nav2Coins.textContent = "";
    for (const criptocoin of data) 
    {
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
menuConnectWallet.addEventListener('click', event => 
{
    let account;
    let button = event.target;
    ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            account = accounts[0];
            isActive.style.color = "green";
            button.textContent = "CONNECTED WALLET";
            menuOpcionExtra.classList.remove("esOculto");
            menuOpcionExtra.classList.add("esVisible");
        });
})

//------------Mostrar opciones afterWalletConnected

// Agrega mensaje de conexión exitosa
let successMsg = document.createElement('p');
successMsg.textContent = "¡Ha conectado su billetera de Metamask correctamente!";
successMsg.style.color = "green";
divCoin.after(successMsg);

// La billetera está conectada, habilita el botón de redireccionamiento
successMsg.after(redirectButton);
redirectButton.textContent = "Continuar"
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
  } catch (error) 
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