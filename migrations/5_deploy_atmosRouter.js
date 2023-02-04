const AtmosRouter= artifacts.require("AtmosRouter");
module.exports = function (deployer) {
    deployer.deploy(AtmosRouter,
        "0x84bfdcf1Ab43eb9C34dF03061a2b9B3ea092165D", //factory address
        "0xc778417E063141139Fce010982780140Aa0cD5Ab"  //Wrapped Ether address (WETH on Ropsten)
    );
};
