import configurationAtmosFactory from "contracts/AtmosFactory.json"
const ATMOSFACTORY_CONTRACT_ABI = configurationAtmosFactory.abi

export const SetAtmosFactoryContract = (web3) => {
    return new web3.eth.Contract(
        ATMOSFACTORY_CONTRACT_ABI,
        "0x84bfdcf1Ab43eb9C34dF03061a2b9B3ea092165D"
    )
}