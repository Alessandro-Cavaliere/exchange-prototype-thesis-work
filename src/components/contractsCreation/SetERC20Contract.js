import ERC20_ABI from "contracts/ERC20abi.json"

export const SetERC20Contract = (web3,address) => {
    return new web3.eth.Contract(
        ERC20_ABI,
        address
    )
}