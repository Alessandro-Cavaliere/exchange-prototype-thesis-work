import configurationAtmosPair from "contracts/AtmosPair.json"
const ATMOSPAIR_CONTRACT_ABI = configurationAtmosPair.abi

export const SetAtmosPairContract = (web3,address) => {
    return new web3.eth.Contract(
        ATMOSPAIR_CONTRACT_ABI,
        address
    )
}