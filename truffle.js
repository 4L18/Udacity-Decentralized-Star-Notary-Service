// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'physical gold amount aware drop slice grocery nothing meadow produce menu clerk';
var infura = 'https://rinkeby.infura.io/v3/4497ec5165664a19bcdc0a7ff9ee9fd4';
// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(mnemonic, infura),
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
}
