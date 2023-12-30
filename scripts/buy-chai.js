// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
//Retruns the balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}
//Logs the Ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

//Logs the memos stored on-chain from chai purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  //Get example accounts

  const[owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy  
  // const BuyMeAChai = await hre.ethers.getContractFactory("BuyMeAChai");
  // const buyMeAChai = await BuyMeAChai.deploy();
  //below is the new version....above 2 lines are the old version
  const buyMeAChai = await hre.ethers.deployContract("BuyMeAChai", [], {});
  
  //Deploy Contract
  await buyMeAChai.waitForDeployment();
  console.log("BuyMeAChai deployed to:", buyMeAChai.target);

  //Check balances before purchasing the chai
  const addresses = [owner.address, tipper.address, buyMeAChai.target];
  console.log("==start==");
  await printBalances(addresses);
    
  //Buy the owner a few chai
  const tip = {
    value: hre.ethers.parseEther("1")
  };
  await buyMeAChai.connect(tipper).buyChai("Carolina", "You are the best", tip);
  await buyMeAChai.connect(tipper2).buyChai("Vitto two", "Amazing Job!", tip);
  await buyMeAChai.connect(tipper3).buyChai("Kay", "I love my proof of knowledge", tip);

  //Check balances after purchasing the chai
  console.log("==bought chai==");
  await printBalances(addresses);

  //Withdraw the funds
  await buyMeAChai.connect(owner).withdrawTips();

  //Check balances after withdrawal
  console.log("==after withdrawing Tips==");
  await printBalances(addresses);

  //Read all the memos left for the owner
  console.log("==Reading the Memos==");
  const memos = await buyMeAChai.getMemos();
  printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
