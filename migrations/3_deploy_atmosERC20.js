const AtmosERC20 = artifacts.require("AtmosERC20");

module.exports = function (deployer) {
    deployer.deploy(AtmosERC20);
};
