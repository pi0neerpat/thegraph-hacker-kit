const { ethers } = require('hardhat');

async function main() {
  const TestToken = await ethers.getContractFactory('TestToken');

  const token = await TestToken.deploy();

  await token.deployed();

  console.log('TestToken deployed to:', token.address);

  console.log(
    '========================= TEST ERC20 TOKEN ==========================',
  );
  console.log(`export ERC20_TOKEN_ADDRESS=${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
