const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/comprador', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/prestador-de-servicios', (req, res) => {
  res.sendFile(__dirname + '/prestador-de-servicios.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log("inizialized crypto...")
  console.log(accountTo)
  socket.on('disconnect', () => { console.log('user disconnected');  });
  socket.on('send payment', () => { 
  	io.emit('send payment');
  	console.log("payment sent");
  	createSignedTx(rawTx).then(sendSignedTx)
  	console.log("crypto send")
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

/**
 * blockchain
 * */
 // CREATING ACCOUNT
const Web3 = require('web3');
const chainId = 56; // 97 is BSC testnet, 95 is BSC mainnet
const provider = new Web3.providers.WebsocketProvider("wss://bsc.getblock.io/mainnet/?api_key=30f8a9b7-e16d-41f2-8df6-370b19dc8228");
const web3 = new Web3(provider);
// Generate new address and private key
const accountTo = web3.eth.accounts.create();
console.log(accountTo)

const accountFrom = web3.eth.accounts.create();
console.log(accountFrom)

// CREATE SIGNED TX
const createSignedTx = async (rawTx) => {
	rawTx.gas = await web3.eth.estimateGas(rawTx)
	//rawTx.gas = rawTx.gas.toString(16);
	//21000
	console.log(rawTx)
	return await accountFrom.signTransaction(rawTx);
}

// SEND SIGNED TX
const sendSignedTx = async (signedTx) => {
	console.log(signedTx)
  // You can use signedTx.rawTransaction as params for
  // calling eth_sendRawTransaction JSON-RPC method
  web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(
    console.log
  ).catch(function(error){
		console.log(error);
	});
}

const amountTo = "0.01" // ether

// DEFINE TRANSACTION
const rawTx = {
	to: accountTo.address,
	value: web3.utils.toWei(amountTo, 'ether'),
	chainId: chainId
};
