import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "ts-node/register";
import * as dotenv from "dotenv";

dotenv.config();

function isValidPrivateKey(key: string): boolean {
  if (!key) return false;
  const hexRegex = /^(0x)?[0-9a-fA-F]{64}$/;
  return hexRegex.test(key);
}

const config: HardhatUserConfig = {
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
    dontOverrideCompile: false
  },
  mocha: {
    timeout: 40000
  },
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    plume: {
      url: "https://rpc.plume.org",
      chainId: 98866,
      accounts: process.env.TEST_KEY && isValidPrivateKey(process.env.TEST_KEY) ? [process.env.TEST_KEY] : [],
    },
    "plume-testnet": {
      url: "https://testnet-rpc.plume.org",
      chainId: 98867,
      accounts: process.env.TEST_KEY && isValidPrivateKey(process.env.TEST_KEY) ? [process.env.TEST_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      "plume": "plume",
      "plume-testnet": "plume-testnet"
    },
    customChains: [
      {
        network: "plume",
        chainId: 98866,
        urls: {
          apiURL: "https://explorer.plume.org/api",
          browserURL: "https://explorer.plume.org"
        }
      },
      {
        network: "plume-testnet",
        chainId: 98867,
        urls: {
          apiURL: "https://testnet-explorer.plume.org/api",
          browserURL: "https://testnet-explorer.plume.org"
        }
      }
    ]
  }
};

export default config;