const express =require('express');
const app = express();
const CaverExtKAS = require('caver-js-ext-kas')
const port = 3000;

const chainId = 1001;   // Baobob;
const accessKeyId = "{accessKeyId}"
const secretAccessKey = "{secretAccessKey}"

const caver = new CaverExtKAS(chainId, accessKeyId, secretAccessKey);

app.get('/', (req, res) => {
	res.send('Hello Node.js!');
});

// 최근 블록
app.get('/lastBlockNumber', async (req, res) => {
  try {
    const blockNumber = await caver.rpc.klay.getBlockNumber()
    res.send(parseInt(blockNumber,16));
  } catch(err) {
    throw err;
  }
});

// 지갑 주소 생성
app.get('/newAccount', async (req, res) => {
  try {
    const result = await caver.kas.wallet.createAccount();
    res.send(result);
  } catch(err) {
    throw err;
  }
});

// 지갑 정보 확인
app.get('/account', async (req, res) => {
  if(req.query.target) {
    const targetAccount = req.query.target;
    try {
      const result = await caver.rpc.klay.getAccount(targetAccount);
      res.send(result);
    } catch(err) {
      throw err;
    }
  } else {
    res.send(`지갑 주소 정보가 올바르지 않습니다`);
  }
});

// 잔액 확인
app.get('/getBalance', async (req, res) => {
  if(req.query.target) {
    const targetAccount = req.query.target;
    try {
      const result = await caver.rpc.klay.getAccount(targetAccount);
      const balance = parseInt(result.account.balance,16)*(0.1e-17);
      res.send(balance + ' KLAY');
    } catch(err) {
      throw err;
    }
  } else {
    res.send(`지갑 주소 정보가 올바르지 않습니다`);
  }
});

// NFT (KIP-17 스마트 컨트랙트 배포)
app.get('/newContractNFT', async (req, res) => {
  if(req.query) {
    const name = req.query.name;
    const symbol = req.query.symbol;
    console.log(`${name}  ${symbol}`)
    try {
      const result = await caver.kas.kip17.deploy(name, symbol, 'my-first-kip17asd');
      res.send(result);
    } catch(err) {
      console.log(err);
      throw err;
    }
  } else {
    res.send(`지갑 주소 정보가 올바르지 않습니다`);
  }
});

app.listen(port, () => {
	console.log('Listening...');
});