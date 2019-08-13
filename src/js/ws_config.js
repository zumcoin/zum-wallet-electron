var config = {};

// self explanatory, your application name, descriptions, etc
config.appName = 'ZumElectron';
config.appDescription = 'ZumCoin Electron Wallet';
config.appSlogan = 'Simplified Private Digital Currency';
config.appId = 'org.zumcoin.zumelectron';
config.appGitRepo = 'https://github.com/zumcoin-org/zum-wallet-electron';

// default port number for your daemon (e.g. ZumCoind)
config.daemonDefaultRpcPort = 17935;

// wallet file created by this app will have this extension
config.walletFileDefaultExt = 'zum';

// change this to match your wallet service executable filename
config.walletServiceBinaryFilename = 'zum-service';

// version on the bundled service (zum-service)
config.walletServiceBinaryVersion = "v1.5.1";

// config file format supported by wallet service, possible values:
// ini -->  for zum service (or its forks) version <= v0.8.3
// json --> for zum service (or its forks) version >= v1.2.0
config.walletServiceConfigFormat = "json";

// default port number for your wallet service (e.g. zum-service)
config.walletServiceRpcPort = 17070;

// block explorer url, the [[TX_HASH]] will be substituted w/ actual transaction hash
config.blockExplorerUrl = 'https://explorer.zumcoin.org/transaction.html?hash=[[TX_HASH]]';

// default remote node to connect to, set this to a known reliable node for 'just works' user experience
config.remoteNodeDefaultHost = 'localhost';

// remote node list update url, set to null if you don't have one
config.remoteNodeListUpdateUrl = 'https://raw.githubusercontent.com/zumcoin-org/zumcoin-nodes-json/master/zumcoin-nodes.json';

// fallback remote node list, in case fetching update failed, fill this with known to works remote nodes
config.remoteNodeListFallback = [
  'sn1.zumcoin.org:17935',
];

// your currency name
config.assetName = 'ZumCoin';
// your currency ticker
config.assetTicker = 'ZUM';
// your currency address prefix, for address validation
config.addressPrefix = 'Zum1';
// standard wallet address length, for address validation
config.addressLength = 99;
// intergrated wallet address length, for address validation
config.integratedAddressLength = 187;

// minimum fee for sending transaction
config.minimumFee = 0.1;
// minimum amount for sending transaction
config.mininumSend = 0.1;
// default mixin/anonimity for transaction
config.defaultMixin = 0;
// to convert from atomic unit
config.decimalDivisor = 100000000;
// to represent human readable value
config.decimalPlaces = 8;

// obfuscate address book entries, set to false if you want to save it in plain json file.
// not for security because the encryption key is attached here
config.addressBookObfuscateEntries = true;
// key use to obfuscate address book contents
config.addressBookObfuscationKey = '79009fb00ca1b7130832a42de45142cf6c4b7f333fe6fba5';
// initial/sample entries to fill new address book
config.addressBookSampleEntries = [
  {
    name: 'ZumElectron Donation',
    address: 'Zum1yiwrhSZJZxepXARr3XhoaoxRmMASwcbJ2jYjdjKjPcc7Wwr9zgAX6sqoq417xUQsgf8GbSoPs9gehN9ma6JBeqvMf5XMvR5',
    paymentId: '',
  }
];
// cipher config for private address book
config.addressBookCipherConfig = {
  algorithm: 'aes-256-gcm',
  saltLenght: 128,
  pbkdf2Rounds: 10000,
  pbkdf2Digest: 'sha512'
};

module.exports = config;
