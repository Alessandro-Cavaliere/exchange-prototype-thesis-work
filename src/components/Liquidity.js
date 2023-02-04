import {IoMdSettings} from "react-icons/io";
import {TokenA} from "./TokenA";
import {FaPlus} from "react-icons/fa";
import {TokenB} from "./TokenB";
import {useState} from "react";
import "../styles/liquidity.css"
import {SetERC20Contract} from "./contractsCreation/SetERC20Contract";
import "bn.js"
import BN from "bn.js";
import {ApproveRouterSwap} from "../config/Approve";

export function Liquidity(props) {
    const [loading, setLoading] = useState(false);
    const [tokenA, setTokenA] = useState()
    const [tokenB, setTokenB] = useState()
    const [tokenA_Quantity, setTokenA_Quantity] = useState(0)
    const [outputQuantity,setOutputQuantity] = useState()
    const [pairAddress,setPairAddress] = useState()
    const ROUTER_ADDRESS="0xde56B2fD977e96e67fF7B073c5920f42c9B256Ab"
    const WETH_ADDRESS="0xc778417E063141139Fce010982780140Aa0cD5Ab"
    const NULL_ADDRESS="0x0000000000000000000000000000000000000000"


    const setDataTokenA = (token) => {
        setTokenA(token)
    }

    const setDataTokenB = (token) => {
        setTokenB(token)
    }

    const addLiquidity = async (value) => {
        console.log(value)
        if(tokenA && tokenB && value!==0) {
          //  console.log(await props.factory.methods.INIT_CODE_PAIR_HASH().call())
          //  const z=await props.factory.methods.createPair(tokenA.address, tokenB.address).send({from: props.currentAccount});
           // const PairAddress=await props.factory.methods.getPair(tokenA.address, tokenB.address).call();
          //  console.log(PairAddress)


            const tokenAContract = SetERC20Contract(props.web3,tokenA.address)
            const tokenBContract = SetERC20Contract(props.web3,tokenB.address)
           // console.log(await tokenAContract.methods.allowance(tokenA.address,PairAddress).call())

            await ApproveRouterSwap(props.web3,props.currentAccount,tokenAContract,ROUTER_ADDRESS)
            await ApproveRouterSwap(props.web3,props.currentAccount,tokenBContract,ROUTER_ADDRESS)
            console.log(tokenA.address)
            console.log(tokenB.address)
            console.log("tokenA-Quantity"+tokenA_Quantity)
            console.log("outputQuantity"+outputQuantity)
            console.log(Math.floor(Date.now() / 1000 + (10 * 60)))

            await props.router.methods.addLiquidity(
                tokenA.address,
                tokenB.address,
                tokenA_Quantity,
                outputQuantity,
                0,
                0,
                props.currentAccount,
                Math.floor(Date.now() / 1000) + 60000 * 10
            ).send({from:props.currentAccount,gas:500000}).then(tx => console.log("addLiquidity tx: "+tx))
        }
    }

    const convertToWei = (convertion,value) => {
        if (tokenA.decimals === 18) {
            return props.web3.utils.toWei(value, "ether")
        }
        if (tokenA.decimals === 8) {
            return props.web3.utils.toWei(value, "gwei")
        }
        if (tokenA.decimals === 6) {
            return props.web3.utils.toWei(value, "mwei")
        }
    }


    const getPriceLiquidity = async (value) => {
        const utilsSet = async (convertion) => {
            if (PairAddress === NULL_ADDRESS) {
                const valueConverted=convertToWei(convertion,value)
                setTokenA_Quantity(valueConverted)
            }
            else {

                setLoading(true)
                const valueConverted=convertToWei(convertion,value)
                setTokenA_Quantity(valueConverted)
                console.log("valueConverted " + tokenA_Quantity)
                const path = [
                    tokenA.address,
                    tokenB.address
                ]
                const price = await props.router.methods.getAmountsOut(tokenA_Quantity, path).call()
                const output = props.web3.utils.fromWei(price[1], "ether")
                setLoading(false)
                setOutputQuantity(output)
                console.log(output)
            }
        }
        const PairAddress=await props.factory.methods.getPair(tokenA.address, tokenB.address).call();
        setPairAddress(PairAddress)
        console.log(PairAddress)
        // Se i due token sono stati selezionati
        if (tokenA && tokenB && value !== 0) {
            if (tokenB.decimals === 18) {
                await utilsSet("ether")
            }
            if (tokenB.decimals === 8) {
                await utilsSet("gwei")
            }
            if (tokenB.decimals === 6) {
                await utilsSet("mwei")
            }
        }
    }

    const setTokenB_Quantity = (value,decimals) => {
        const utilsSet = (convertion) => {
            const valueConverted = props.web3.utils.toWei(value, convertion)
            setOutputQuantity(valueConverted)
        }
        if (decimals === 18) {
            utilsSet("ether")
        }
        if (decimals === 8) {
            utilsSet("gwei")
        }
        if (decimals === 6) {
            utilsSet("mwei")
        }
    }

    const renderButton = () => {
        if(props.isConnected)
            return(
                <button type="button" className="btn-liquidity" onClick={()=>addLiquidity(tokenA_Quantity)}>Add
                    Liquidity</button>
            )
        else
            return(
                <button type="button" className="btn-liquidity" onClick={props.showCard}>Connect
                    Wallet</button>
            )
    }

        return (
            <>
                <div className="liquidity-card-container">
                    <div className="liquidity-card">
                        <div className="liquidity-card-first-row">
                            <div className="liquidity-card-column">
                                <h1 style={{
                                    fontSize: 20,
                                    color: "white"
                                }}>Liquidity</h1>
                                <h1 style={{fontSize: 12, color: "#c6c6c6"}}>Remove Liquidity to receive token back</h1>
                            </div>
                            <IoMdSettings size={25} style={{color: "#12308c", cursor: "pointer"}}/>
                        </div>
                        <TokenA getPriceLiquidity={getPriceLiquidity} setDataTokenA={setDataTokenA}
                                currentAccount={props.currentAccount} web3={props.web3} />

                        <FaPlus size={30} style={{color: "white", margin: 10}}/>

                        <TokenB setDataTokenB={setDataTokenB} currentAccount={props.currentAccount} web3={props.web3}
                                loading={loading} outputQuantity={outputQuantity} pairAddress={pairAddress} setTokenB_Quantity={setTokenB_Quantity}/>
                        {renderButton()}
                    </div>
                </div>
            </>
        )
    }