//----------------------------------LLAMADAS
let botonDonacion = document.querySelector('#bDonacion');
const direccionDestino = '0x834999AC875E16EB769E3726F4c8884aDDCc4f63'; // dirección de billetera a la que se enviará la donación
let isActive = document.querySelector('#isActive');
isActive.style.color = "red";

let bloqueSaludo = document.getElementById('bloqueSaludo');
let bloqueTransaccion = document.getElementById('bloqueTransaccion');
let montoEnviar = '0.0001';

let api_key_eth_scan = 'VVRG818I2PP9FTPU3XSQJ6WBWZT3HYBTP5';

const sendButton = document.getElementById('bDetectar');
const walletAddressInput = document.getElementById('wallet-address');
const transactionHistoryDiv = document.getElementById('transaction-history');



async function getMetamaskAddress() {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            return accounts[0];
        }
    }
    return null;
}

async function getTransactionHistory(walletAddress) {
    // Aquí puedes usar la API de Etherscan para obtener el historial de transacciones de la dirección de la wallet
    // Puedes realizar una solicitud HTTP a la API de Etherscan utilizando fetch u otra biblioteca de tu elección
    // y obtener los datos necesarios para mostrar en el historial de transacciones
    // Aquí tienes un ejemplo simple de cómo podrías obtener las transacciones más recientes utilizando la API de Etherscan
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&apikey=${api_key_eth_scan}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status === '1') {
            return data.result;
        } else {
            console.log('Error al obtener el historial de transacciones');
        }
    } catch (error) {
        console.log('Error al realizar la solicitud');
    }

    return [];
}

function renderTransactionHistory(transactions) {
    transactionHistoryDiv.innerHTML = '';

    transactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.textContent = `Fecha: ${new Date(transaction.timeStamp * 1000).toLocaleString()}, Hash: ${transaction.hash}`;
        transactionHistoryDiv.appendChild(transactionDiv);
    });
}


//----------------------------------ACCION
botonDonacion.addEventListener('click', enviarDonacion(direccionDestino));

document.addEventListener('DOMContentLoaded', function () {
    comprobarConexionWallet();
});

sendButton.addEventListener('click', async () => {
    const walletAddress = document.querySelector('input[name="wallet-option"]:checked').id === 'option1'
        ? await getMetamaskAddress()
        : walletAddressInput.value.trim();

    if (!walletAddress) {
        console.log('Dirección de wallet inválida');
        return;
    }

    const transactions = await getTransactionHistory(walletAddress);
    renderTransactionHistory(transactions);
});




//----------------------------------FUNCIONES
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


async function enviarDonacion(direccionDestino) {
    // Validar si Metamask está instalado y conectado
    if (typeof window.ethereum === 'undefined') {
        console.log('Metamask no está instalado.');
        return;
    }

    // Crear objeto de transacción
    const transaccion = {
        to: direccionDestino,
        value: ethers.utils.parseEther(montoEnviar),
    };

    try {
        // Solicitar al usuario que apruebe y envíe la transacción usando Metamask
        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transaccion],
        });

        console.log('Transacción enviada correctamente.');
    } catch (error) {
        console.log('Error al enviar la transacción:', error);
    }
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