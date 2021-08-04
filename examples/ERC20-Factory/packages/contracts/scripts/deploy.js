const { ethers } = require('hardhat');

async function main() {
  const TestTokenUpgradeable = await ethers.getContractFactory(
    'TestTokenUpgradeable',
  );

  const tokenImpl = await TestTokenUpgradeable.deploy();

  await tokenImpl.deployed();

  const TestTokenFactory = await ethers.getContractFactory('TestTokenFactory');

  const tokenFactory = await TestTokenFactory.deploy(tokenImpl.address);

  await tokenFactory.deployed();

  console.log(
    '===================== TEST ERC20 TOKEN FACTORY ======================',
  );
  console.log(`export ERC20_TOKEN_FACTORY_ADDRESS=${tokenFactory.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
