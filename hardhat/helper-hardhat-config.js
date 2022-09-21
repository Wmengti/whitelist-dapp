const developmentChains = ['hardhat', 'localhost'];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const fontendContractAddress =
  '../nextjs-whitelist-dapp/constants/WLaddress.json';
const fontendContractabi = '../nextjs-whitelist-dapp/constants/WLabi.json';

module.exports = {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  fontendContractabi,
  fontendContractAddress,
};
