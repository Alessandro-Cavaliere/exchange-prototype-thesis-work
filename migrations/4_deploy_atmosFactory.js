const AtmosFactory = artifacts.require("AtmosFactory");

module.exports = async function (deployer) {
    const owner = await web3.eth.getAccounts();
    return deployer.deploy(AtmosFactory,
        owner[0] // _feeToSetter parameter of AtmosFactory.sol (the address of the sender)
        )
};

