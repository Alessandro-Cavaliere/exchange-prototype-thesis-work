/*
       ApproveRouterSwap--> permette di fare l'approve del token che si vuole swappare.
                            Imposta l'importo massimo (uint massimo) come indennità di spesa sui token del chiamante.

       ApprovePairAmount--> permette di fare l'approve del Pair dei due token del trade per aggiungere liquidità alla Pool.
                            Imposta l'importo massimo (uint massimo) come indennità di spesa sui token del chiamante.
*/
export async function ApproveRouterSwap(web3,currentAccount,contract,router) {
    const value =web3.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935")
    await contract.methods
        .approve(router, value)
        .send({from: currentAccount})
}

export async function ApprovePairAmount(web3,currentAccount,contract,router) {
    const amount = web3.utils.toBN('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    await contract.methods
        .approve(router, amount)
        .send({from: currentAccount})
}
