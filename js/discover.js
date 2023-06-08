//LLAMADAS
let botonDonacion = document.querySelector('#bDonacion');
const direccionDestino = '0x834999AC875E16EB769E3726F4c8884aDDCc4f63'; // dirección de billetera a la que se enviará la donación
let isActive = document.querySelector('#isActive');
isActive.style.color = "red";

let bloqueSaludo = document.getElementById('bloqueSaludo');
let bloqueTransaccion = document.getElementById('bloqueTransaccion');



//ACCION
botonDonacion.addEventListener('click', enviarDonacion(direccionDestino));

document.addEventListener('DOMContentLoaded', function () {
    comprobarConexionWallet();
  });

botonDonacion.addEventListener('click', enviarDonacion);








//FUNCIONES
function redireccionWallet(){
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
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const cuentaOrigen = accounts[0];
      const cantidadDonacion = '0.0001'; // Cantidad de ETH a donar
  
      const transaction = {
        from: cuentaOrigen,
        to: direccionDestino,
        value: ethers.utils.parseEther(cantidadDonacion),
      };
  
      const txHash = await ethereum.request({ method: 'eth_sendTransaction', params: [transaction] });
  
      console.log('Donación enviada con éxito. Hash de transacción:', txHash);
    } catch (error) {
      console.error('Error al enviar la donación:', error);
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