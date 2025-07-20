import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import hre from "hardhat";
import { TipJar } from "../typechain-types/contracts/TipJar";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TipJar", function () {
  let tipJar: TipJar;
  let owner: HardhatEthersSigner;
  let tipper: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, tipper] = await hre.ethers.getSigners();

    const deployed = await hre.ethers.deployContract("TipJar");
    tipJar = deployed as any as TipJar;
    await tipJar.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tipJar.owner()).to.equal(owner.address);
    });
  });

  describe("Tipping", function () {
    it("Should receive tips and emit TipReceived event", async function () {
      const tipAmount = hre.ethers.parseEther("1.0");
      
      await expect(tipJar.connect(tipper).tip({ value: tipAmount }))
        .to.emit(tipJar, "TipReceived")
        .withArgs(tipper.address, tipAmount);
    });

    it("Should reject tips with 0 value", async function () {
      await expect(tipJar.connect(tipper).tip({ value: 0 }))
        .to.be.revertedWith("TipJar: No ether sent");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw", async function () {
      const tipAmount = hre.ethers.parseEther("1.0");
      await tipJar.connect(tipper).tip({ value: tipAmount });

      const initialBalance : bigint = await hre.ethers.provider.getBalance(owner.address);
      const tx = await tipJar.connect(owner).withdraw();
      const receipt = await tx.wait();

      const gasUsed : bigint = receipt?.gasUsed || 0n;
      const gasPrice : bigint = receipt?.gasPrice || tx.gasPrice || 0n;
      const gasCost :bigint = gasUsed * gasPrice;
      expect(gasCost).to.be.gt(0);
      const finalBalance : bigint = await hre.ethers.provider.getBalance(owner.address);
      const expectedBalance : bigint = initialBalance + tipAmount - BigInt(gasCost);
      expect(finalBalance).to.equal(expectedBalance);
    });

    it("Should reject withdrawal from non-owner", async function () {
      await expect(tipJar.connect(tipper).withdraw())
        .to.be.revertedWithCustomError(tipJar, "Unauthorized");
    });
  });
});

