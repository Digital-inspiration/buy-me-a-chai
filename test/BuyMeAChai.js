const { expect } = require("chai");

describe("BuyMeAChai contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("BuyMeAChai");

    const ownerBalance = await hardhatToken.connect(owner).withdrawTips();
    expect(ownerBalance === 0);
  });
});