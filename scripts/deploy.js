const hre = require("hardhat");


async function main() {
  // Get the contract factory
  const Buffalo = await ethers.getContractFactory('Buffalo');

  // Deploy the contract
  console.log('Deploying Buffalo...');
  const buffalo = await Buffalo.deploy();
  await buffalo.deployed();
  console.log('Buffalo deployed to:', buffalo.address);

  
  process.exit(0);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });