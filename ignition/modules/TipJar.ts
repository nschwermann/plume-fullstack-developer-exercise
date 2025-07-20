import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TipJarModule = buildModule("TipJarModule", (m) => {
  const tipJar = m.contract("TipJar");
  return { tipJar };
});

export default TipJarModule;