
export const Connection =async (provider) => {
    const account=await provider.request({
        method: "eth_requestAccounts",
    });
    return account
}