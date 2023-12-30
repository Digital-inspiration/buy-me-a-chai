// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

//Contract has been deployed to: https://sepolia.etherscan.io/address/0xBE5C509b24a64AD1c81867E7D9190016523c6827

async function main() {
  // Get the contract to deploy  
  // const BuyMeAChai = await hre.ethers.getContractFactory("BuyMeAChai");
  // const buyMeAChai = await BuyMeAChai.deploy();
  
  //below is the new version....above 2 lines are the old version
  const buyMeAChai = await hre.ethers.deployContract("BuyMeAChai", [], {});

  //Deploy Contract
  await buyMeAChai.waitForDeployment();
  console.log("BuyMeAChai deployed to:", buyMeAChai.target);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
