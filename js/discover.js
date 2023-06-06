//LLAMADAS
let botonDonacion = document.querySelector('#bDonacion');






//ACCION
document.addEventListener('DOMContentLoaded', function () {
    comprobarConexionWallet();
  });


botonDonacion.addEventListener('click', enviarDonacion);








//FUNCIONES

//----------------------------------COMPROBAR CONEXION WALLET ----------------------------------
async function comprobarConexionWallet() {
  if (typeof window.ethereum !== 'undefined') {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      console.log('La wallet de Metamask está conectada correctamente.');  
    } else {
      console.log('La wallet de Metamask está instalada, pero no está conectada.');
    }
  } else {
    console.log('Por favor, instale Metamask para utilizar esta función.');
  }
}

//----------------------------------ENVIAR DONACION A WALLET ----------------------------------
async function enviarDonacion() {
    const address = '0x834999AC875E16EB769E3726F4c8884aDDCc4f63'; // dirección de billetera a la que se enviará la donación
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

//----------------------------------DETECTAR PROVEEDOR WALLET ----------------------------------
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