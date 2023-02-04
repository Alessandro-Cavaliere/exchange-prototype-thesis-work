import {RiArrowDropDownLine} from "react-icons/ri";
import "../styles/swap.css"
import {useEffect, useState} from "react";
import Web3 from "web3";
import ERC20abi from "contracts/ERC20abi.json"
import {tokenAddresses} from "../config/tokenAddresses";
import {ClipLoader, PulseLoader} from "react-spinners"

export function TokenB(props) {
    const [isActive, setIsActive] = useState(false);
    const [selected, setIsSelected] = useState('');
    const [balance,setBalance] = useState(0)
    const [coins, setCoins] = useState([]);
    const [quantity,setQuantity] =useState('')
    const [tokenB,setTokenB]= useState()
    const NULL_ADDRESS="0x0000000000000000000000000000000000000000"

    const setTokenQuantity = (e) => {
      setQuantity(e.target.value)
    }

    const fetchCoins = async () => {
        const data= tokenAddresses
        setCoins(data);
        console.log("ss"+data)
    };

    useEffect(() => {
        fetchCoins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const setTokenBContract = async (token) => {
        const web3 = new Web3(window.web3.currentProvider)
        setTokenB(token)
        console.log(web3)
        if(token.address != null) {
            const tokenContract = new web3.eth.Contract(ERC20abi, token.address)
            const val = await tokenContract.methods.balanceOf(props.currentAccount).call()
            if (token.decimals === 18) {
                console.log("1")
                const bal=web3.utils.fromWei(val, "ether")
                setBalance(bal)
            }
            if (token.decimals === 8) {
                console.log("3")
                const bal=web3.utils.fromWei(val, "gwei")
                setBalance(bal)
            }
            if (token.decimals === 6) {
                console.log("2")
                const bal=web3.utils.fromWei(val, "mwei")
                setBalance(bal)
            }
        } else{
            console.log("4")
            const val=await web3.eth.getBalance(props.currentAccount)
            setBalance(web3.utils.fromWei(val, "ether"))
        }

    }

    return(
        <>
            <div className="dropdown">
                <div className="dropdown-btn">
                    <div className="dropdown-click" onClick={()=>setIsActive(!isActive)} onBlur={()=>setIsActive(false)}>
                    <img src={selected.image} style={{height:25,marginRight:5,marginLeft:25}} />
                    <p>{selected.symbol? selected.symbol.toUpperCase():"Seleziona Token"}</p>
                    <RiArrowDropDownLine size={25} style={{color:"white"}}/>
                    </div>
                    <p style={{marginLeft:75,color:"#c6c6c6",fontSize:15}}>{balance?"Balance: "+Number(balance).toFixed(2):"Balance: 0"}</p>
                </div>
                {isActive && (
                    <div className="dropdown-content">
                        {coins.map((coin)=>(
                            <div className="dropdown-item" onClick={(e)=>{
                                setIsSelected(coin)
                                setIsActive(false)
                                setTokenBContract(coin)
                                props.setDataTokenB(coin)
                                console.log(coin)
                            }}
                                 key={coin.symbol}>
                                <img src={coin.image} style={{height:25,marginRight:5}}/>
                                <p>{coin.symbol}</p>
                            </div>
                        ))}
                    </div>)}
            </div>
            {props.loading? (
                <>
                    <div className="swap-card-second-row">
                        <PulseLoader size={20} color="#c6c6c6" css="border-color:#ffff;margin-top: 10px;margin-right: 10px;"/>
                        <strong><p className="p-style-swap">MAX</p></strong>
                    </div>
                    <div className="div-loader">
                    <ClipLoader size={20} css="margin-right:8px; border-color:#12308c; border-bottom-color:transparent; margin-left: 10px;"/>
                    <p className="p-style-loading">Recupero del miglior prezzo...</p>
                    </div>
                </>
            ):
            <div className="swap-card-second-row">
                {props.pairAddress!==NULL_ADDRESS?
                <input type="number" maxLength="6" placeholder="Amount:"
                       className="input-style"
                       onChange={setTokenQuantity}
                       value={props.outputQuantity?Number(props.outputQuantity).toFixed(10):''}
                />:
                    <input type="number" maxLength="6" placeholder="Amount:"
                           className="input-style"
                           onChange={setTokenQuantity}
                           onBlur={()=>props.setTokenB_Quantity(quantity,tokenB.decimals)}
                           value={quantity}
                    />
                    }
                <strong><p className="p-style-swap">MAX</p></strong>
            </div>}
        </>
    )
}
