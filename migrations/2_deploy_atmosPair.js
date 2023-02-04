const AtmosPair = artifacts.require("AtmosPair");

module.exports = function (deployer) {
    deployer.deploy(AtmosPair);
};
