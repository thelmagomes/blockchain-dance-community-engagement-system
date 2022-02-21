var DNCE_Application = artifacts.require("DNCE_Application");

module.exports = function(deployer) {
  deployer.deploy(DNCE_Application, 10000000000);
};
