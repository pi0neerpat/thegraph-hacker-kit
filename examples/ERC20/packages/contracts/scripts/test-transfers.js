const { ethers } = require('hardhat');
const { utils } = ethers;

async function main() {
  const TestToken = await ethers.getContractFactory('TestToken');
  const token = await TestToken.deploy();

  await token.deployed();

  console.log('TestToken deployed to:', token.address);

  const accounts = await ethers.getSigners();

  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  console.log('minting 1000 to alice');
  await token.mint(alice.address, utils.parseEther('1000'));
  console.log('minting 2000 to bob');
  await token.mint(bob.address, utils.parseEther('2000'));
  console.log('minting 3000 to carol');
  await token.mint(carol.address, utils.parseEther('3000'));

  // balances:
  // alice: 1000
  // bob:   2000
  // carol: 3000

  console.log('alice transferring 10 to bob');
  await token.connect(alice).transfer(bob.address, utils.parseEther('10'));
  console.log('bob transferring 20 to carol');
  await token.connect(bob).transfer(carol.address, utils.parseEther('20'));
  console.log('carol transferring 30 to alice');
  await token.connect(carol).transfer(alice.address, utils.parseEther('30'));

  // balances:
  // alice: 1000 - 10 + 30 = 1020
  // bob:   2000 + 10 - 20 = 1990
  // carol: 3000 + 20 - 30 = 2990
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
