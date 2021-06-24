const { ethers } = require('hardhat');
const { utils } = ethers;

async function main() {
  const TestToken = await ethers.getContractFactory('TestToken');
  const token = await TestToken.deploy();

  await token.deployed();

  console.log('TestToken deployed to:', token.address);

  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    await token.mint(account.address, utils.parseEther('10000'));
  }

  console.log('Approving 1 to spend 25000 of 0');
  await token
    .connect(accounts[0])
    .approve(accounts[1].address, utils.parseEther('25000'));
  console.log('Approving 2 to spend 5000 of 1');
  await token
    .connect(accounts[1])
    .approve(accounts[2].address, utils.parseEther('5000'));
  console.log('Approving 1 to spend 50000 of 4');
  await token
    .connect(accounts[4])
    .approve(accounts[1].address, utils.parseEther('50000'));

  console.log('0 Transferring 10 to 1');
  await token
    .connect(accounts[0])
    .transfer(accounts[1].address, utils.parseEther('10'));
  console.log('1 Transferring 20 to 2');
  await token
    .connect(accounts[1])
    .transfer(accounts[2].address, utils.parseEther('20'));
  console.log('2 Transferring 30 to 3');
  await token
    .connect(accounts[2])
    .transfer(accounts[3].address, utils.parseEther('30'));

  console.log('1 Transferring 200 from 0 to 5');
  await token
    .connect(accounts[1])
    .transferFrom(
      accounts[0].address,
      accounts[5].address,
      utils.parseEther('200'),
    );
  console.log('2 Transferring 350 from 1 to 7');
  await token
    .connect(accounts[2])
    .transferFrom(
      accounts[1].address,
      accounts[7].address,
      utils.parseEther('350'),
    );
  console.log('1 Transferring 500 from 4 to 6');
  await token
    .connect(accounts[1])
    .transferFrom(
      accounts[4].address,
      accounts[6].address,
      utils.parseEther('500'),
    );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
