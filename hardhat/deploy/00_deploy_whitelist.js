const { verify } = require('../utils/verify');
const {
  developmentChains,
  fontendContractAddress,
  fontendContractabi,
} = require('../helper-hardhat-config');
const fs = require('fs');
const { ethers } = require('hardhat');

const hre = require('hardhat');

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  args = [8];
  const whitelist = await deploy('WhiteList', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  fs.writeFileSync(fontendContractAddress, JSON.stringify(whitelist.address));

  const whitelistabi = await ethers.getContract('WhiteList');
  fs.writeFileSync(
    fontendContractabi,
    whitelistabi.interface.format(ethers.utils.FormatTypes.json)
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(whitelist.address, args);
  }
};

module.exports.tags = ['whitelist'];
