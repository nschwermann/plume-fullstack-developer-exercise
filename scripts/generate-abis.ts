#!/usr/bin/env npx ts-node

import * as fs from 'fs';
import * as path from 'path';
import { TipJar__factory } from '../typechain-types/factories/contracts/TipJar__factory';

const ABI_OUTPUT_DIR = './abi';

if (!fs.existsSync(ABI_OUTPUT_DIR)) {
  fs.mkdirSync(ABI_OUTPUT_DIR, { recursive: true });
}

const contracts = {
  TipJar: TipJar__factory.abi,
};

for (const [contractName, abi] of Object.entries(contracts)) {
  const outputPath = path.join(ABI_OUTPUT_DIR, `${contractName}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
  console.log(`Generated ABI for ${contractName} -> ${outputPath}`);
}

console.log('ABI generation complete!');