import {useEffect, useState} from "react";
import "../styles/swap.css"
import {RiArrowDropDownLine} from "react-icons/ri"
import ERC20abi from "contracts/ERC20abi.json"
import Web3 from "web3";
import {tokenAddresses} from "../config/tokenAddresses";

export function TokenA(props) {
    const [coins, setCoins] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [maxBalance,setMaxBalance] = useState(0)
    const [isActive, setIsActive] = useState(false);
    const [selected, setIsSelected] = useState([]);
    const [balance,setBalance] = useState(0)

    const fetchCoins = async () => {
       // const { data } = await axios.get(CoinMarkets(currency));
        //console.log(data);
        //setCoins(data);
        const data= tokenAddresses
        setCoins(data);
        console.log("ss"+data)
    };

    useEffect(() => {
        fetchCoins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setTokenAContract = async (token) => {
        const web3 = new Web3(window.web3.currentProvider)
        console.log(web3)
        if(token.address != null) {
            const tokenContract = new web3.eth.Contract(ERC20abi, token.address)
            const val = await tokenContract.methods.balanceOf(props.currentAccount).call()
            console.log("VALORE"+val)
            if (token.decimals === 18) {
                const bal=web3.utils.fromWei(val, "ether")
                console.log("1--> BAL"+bal)
                setBalance(bal)
                setMaxBalance(bal)
            }
            if (token.decimals === 8) {
                console.log("3")
                const bal=web3.utils.fromWei(val, "gwei")
                setBalance(bal)
                setMaxBalance(bal)
            }
            if (token.decimals === 6) {
                console.log("2")
                const bal=web3.utils.fromWei(val, "mwei")
                setBalance(bal)
                setMaxBalance(bal)
            }
        } else{
            console.log("4")
            const val=await web3.eth.getBalance(props.currentAccount)
            const bal=web3.utils.fromWei(val, "ether")
            setBalance(bal)
            setMaxBalance(bal)
        }

    }

    const setMaximumBalance = () => {
        document.getElementById('input').value=maxBalance
    }

    return(
        <>
            <div className="dropdown">
                <div className="dropdown-btn" onClick={(e)=>setIsActive(!isActive)} >
                    <div className="dropdown-click" onClick={()=>setIsActive(!isActive)} onBlur={()=>setIsActive(false)}>
                        <img src={selected.image} style={{height:25,marginRight:5,marginLeft:25}}/>
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
                        props.setDataTokenA(coin)
                        setTokenAContract(coin)
                        setIsChanged(true)
                    }}
                         key={coin.id}>
                        <img src={coin.image} style={{height:25,marginRight:5}}/>
                        <p>{coin.symbol}</p>
                    </div>
                        ))}
                </div>)}
            </div>
            <div className="swap-card-second-row">
                <input type="number" maxLength="6" placeholder="Amount:" id="input"
                       className="input-style"
                       onBlur={props.getPriceSwap?
                           (e)=> props.getPriceSwap(e.target.value):
                           (e)=> props.getPriceLiquidity(e.target.value)}
                />
                <button className="button-style-swap" onClick={setMaximumBalance}>MAX</button>
            </div>
        </>
    )
}
