//----------------------------------LLAMADAS------------------------------------------------------------------------------------------------------
let isActive = document.querySelector('#isActive');
isActive.style.color = "red";
let bloqueSaludo = document.getElementById('bloqueSaludo');
let bloqueTransaccion = document.getElementById('bloqueTransaccion');

let api_key_eth_scan = 'VVRG818I2PP9FTPU3XSQJ6WBWZT3HYBTP5';

const botonDetectar = document.getElementById('bDetectar');
const walletAddressInput = document.getElementById('wallet-address');
const transactionHistoryDiv = document.getElementById('transaction-history');

//----------------------------------ACCION------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    comprobarConexionWallet();
});

botonDetectar.addEventListener('click', async () => {
    const walletAddress = document.querySelector('input[name="wallet-option"]:checked').id === 'option1'
        ? await getMetamaskAddress()
        : walletAddressInput.value.trim();

    if (!walletAddress) {
        console.log('Dirección de wallet inválida');
        return;
    }
    getTransactionHistory(walletAddress)
    .then(transactions => {
      renderTransactionHistory(transactions);
    })
    .catch(error => {
      console.log('Error al obtener el historial de transacciones', error);
    });
});




//----------------------------------FUNCIONES------------------------------------------------------------------------------------------------------
function redireccionWallet() {
    bloqueSaludo.textContent = '';
    bloqueTransaccion.textContent = '';
    window.location.href = 'index.html';
}


//----------------------------------COMPROBAR CONEXION WALLET ----------------------------------
async function comprobarConexionWallet() {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            console.log('La wallet de Metamask está conectada correctamente.');
            isActive.style.color = "green";
            menuConnectWallet.textContent = "CONNECTED WALLET";
        } else {
            console.log('La wallet de Metamask está instalada, pero no está conectada.');
            redireccionWallet()
        }
    } else {
        console.log('Por favor, instale Metamask para utilizar esta función.');
        redireccionWallet()
    }
}

//----------------------------------ENVIAR DONACION A WALLET ----------------------------------
let accounts = [];
let botonDonacion = document.getElementById('bDonacion');
// dirección de billetera que enviará la donación --- 0x834999AC875E16EB769E3726F4c8884aDDCc4f63
// dirección de billetera a la que se enviará la donación --- 0x933Dcf0923B6F1bED3ae35dD7523D058b9325417
let montoEnviar = '0.0001';
// Crear una instancia de Web3
const web3 = new Web3("http://localhost:7545");

botonDonacion.addEventListener('click', () => {
    const recipientAddress = document.getElementById('recipientAddress').value;
     // Asegurarse de que la dirección tiene el formato correcto
     const checksumAddress = web3.utils.toChecksumAddress(recipientAddress);
     console.log(recipientAddress);
    sendEth(recipientAddress);
  });

// Send Ethereum to an address
function sendEth(recipientAddress) {
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0], // The user's active address.
            to: recipientAddress, //  dirección de billetera a la que se enviará la donación
            value: '0x2386f26fc10000', //  representación en Wei de 0.0001 ETH
            gasPrice: '0x38d7ea4c68000', // 15 Gwei 
            gas: '0x2710', // Customizable by the user during MetaMask confirmation.
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error(error));
  }

// ---------------------------------- MOSTRAR SALDO DE LA WALLET  ----------------------------------
// function getBalanceETH() {
//     ethereum
//         .request({ method: 'eth_getBalance', params: [account, 'latest'] })
//         .then(result => {
//             let wei = parseInt(result, 16);
//             let balance = wei / (10 ** 18);
//             divBalance.textContent = "Usted tiene " + balance + " ETH en su billetera de Metamask";
//             button.after(divBalance);
//         });
// }


//------------------------------ RECIBIR DIRECCION DE WALLET --------------------------------------

async function getMetamaskAddress() {
    if (typeof window.ethereum !== 'undefined') {
        accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            console.log(accounts[0]);
            return accounts[0];
        }
    }
    return null;
}

// ---------------------------------- RECUPERAR TRANSACCION -----------------------------------------

function getTransactionHistory(walletAddress) {
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=desc&&apikey=${api_key_eth_scan}&offset=0&limit=10`;
    
    return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === '0') {
          console.log("No se encontraron transacciones");
          return []; // No se encontraron transacciones
        } else if (data.status === '1') {
          return data.result; // Se encontraron transacciones
        } else {
          console.log('Error al obtener el historial de transacciones');
          return []; // Error al obtener el historial de transacciones
        }
      })
      .catch(error => {
        console.log('Error al realizar la solicitud', error);
        return []; // Error al realizar la solicitud
      });
  }


//DIRECCION EJEMPLO : 0x12bffb97f37606f2...73fea9f8892EE7E7964209b0

// ----------------------------------------MOSTRAR HISTORIAL DE TRANSACCIONES ----------------------------------------------
function convertUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Multiplica por 1000 para convertir el timestamp a milisegundos
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatea la fecha y hora
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
}

function renderTransactionHistory(transactions) {
    transactionHistoryDiv.innerHTML = '';
    console.log("renderTransactionHistory");
    console.log(transactions);

    for (let i = 0; i < 10; i++) {
        if (i >= transactions.length) {
          break; // Detener el bucle si se alcanza el final del arreglo de transacciones
        }
        const transaction = transactions[i]
        console.log(transaction);
        const timestamp = transaction.timeStamp;
        console.log(timestamp);
        const transactionDiv = document.createElement('div');
        transactionDiv.textContent = `Fecha: ${convertUnixTimestamp(transaction.timeStamp)}, Hash: ${transaction.hash}`;
        console.log(transactionDiv.textContent);
        transactionHistoryDiv.appendChild(transactionDiv);
    }
}
