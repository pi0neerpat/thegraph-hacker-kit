const { ethers } = require('hardhat');
const { utils } = ethers;

const { ERC20_TOKEN_ADDRESS } = process.env;

async function main() {
  const accounts = await ethers.getSigners();

  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  const TestToken = await ethers.getContractFactory('TestToken');

  let token;
  if (utils.isAddress(ERC20_TOKEN_ADDRESS)) {
    token = TestToken.attach(ERC20_TOKEN_ADDRESS);
    console.log('Connected to TestToken deployed at:', token.address);
  } else {
    token = await TestToken.deploy();

    await token.deployed();

    console.log('TestToken deployed to:', token.address);
  }

  console.log('minting 1000 to alice');
  await token.mint(alice.address, utils.parseEther('1000'));
  console.log('minting 2000 to bob');
  await token.mint(bob.address, utils.parseEther('2000'));
  console.log('minting 3000 to carol');
  await token.mint(carol.address, utils.parseEther('3000'));

  // balances:
  // alice: 1000 * 10^18 = 1000000000000000000000
  // bob:   2000 * 10^18 = 2000000000000000000000
  // carol: 3000 * 10^18 = 3000000000000000000000

  console.log('alice transferring 10 to bob');
  await token.connect(alice).transfer(bob.address, utils.parseEther('10'));
  console.log('bob transferring 20 to carol');
  await token.connect(bob).transfer(carol.address, utils.parseEther('20'));
  console.log('carol transferring 30 to alice');
  await token.connect(carol).transfer(alice.address, utils.parseEther('30'));

  // balances:
  // alice: 1000 - 10 + 30 = 1020 * 10^18 = 1020000000000000000000
  // bob:   2000 + 10 - 20 = 1990 * 10^18 = 1990000000000000000000
  // carol: 3000 + 20 - 30 = 2990 * 10^18 = 2990000000000000000000

  console.log('alice approving bob to spend 200');
  await token.connect(alice).approve(bob.address, utils.parseEther('200'));
  console.log('alice approving carol to spend 300');
  await token.connect(alice).approve(carol.address, utils.parseEther('300'));
  console.log('carol approving bob to spend 400');
  await token.connect(carol).approve(bob.address, utils.parseEther('400'));

  // allowances:
  // owner | spender | amount
  // alice | bob     | 200 * 10^18 = 200000000000000000000
  // alice | carol   | 300 * 10^18 = 300000000000000000000
  // carol | bob     | 400 * 10^18 = 400000000000000000000

  console.log('bob transferring 200 from alice to carol');
  await token
    .connect(bob)
    .transferFrom(alice.address, carol.address, utils.parseEther('200'));
  console.log('carol transferring 200 from alice to carol');
  await token
    .connect(carol)
    .transferFrom(alice.address, carol.address, utils.parseEther('200'));
  console.log('bob transferring 200 from carol to bob');
  await token
    .connect(bob)
    .transferFrom(carol.address, bob.address, utils.parseEther('200'));

  // balances:
  // alice: 1020 - 400             =  620 * 10^18 =  620000000000000000000
  // bob:   1990 + 200             = 2190 * 10^18 = 2190000000000000000000
  // carol: 2990 + 200 + 200 - 200 = 3190 * 10^18 = 3190000000000000000000
  //
  // allowances:
  // owner | spender | amount
  // alice | bob     | 200 - 200 = 0
  // alice | carol   | 300 - 200 = 100 * 10^18 = 100000000000000000000
  // carol | bob     | 400 - 200 = 200 * 10^18 = 200000000000000000000
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
