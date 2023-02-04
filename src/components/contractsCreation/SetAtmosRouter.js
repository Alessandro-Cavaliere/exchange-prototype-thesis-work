import configurationAtmosRouter from "contracts/AtmosRouter.json"
const ATMOSROUTER_CONTRACT_ABI = configurationAtmosRouter.abi

export const SetAtmosRouterContract = (web3) => {
    return new web3.eth.Contract(
        ATMOSROUTER_CONTRACT_ABI,
        "0xde56B2fD977e96e67fF7B073c5920f42c9B256Ab"
    )
}