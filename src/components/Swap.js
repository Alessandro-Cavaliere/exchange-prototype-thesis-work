import "../styles/swap.css";
import {useEffect, useState} from "react";
import {MenuItem, Select} from "@mui/material";
import {CurrencyState} from "../CurrencyContext";
import axios from "axios";
import {IoMdSettings} from "react-icons/io"
import {CgArrowsExchangeV} from "react-icons/cg"
import {HistoricalChart, PriceSwap, SingleCoin} from "../config/API";
import {Line} from "react-chartjs-2";
import SelectButton from "./SelectButton";
import {TokenA} from "./TokenA";
import {TokenB} from "./TokenB";
import {chartDays} from "../config/ChartDays";
import BN from "bn.js"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import {SetERC20Contract} from "./contractsCreation/SetERC20Contract";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export function Swap(props) {
    const {currency, setCurrency} = CurrencyState();
    const [historicDataTokenA, setHistoricDataTokenA] = useState();
    const [days, setDays] = useState(1)
    const [path, setPath] = useState([])
    const [loading, setLoading] = useState(false);
    const [tokenA, setTokenA] = useState()
    const [tokenB, setTokenB] = useState()
    const [tokenA_Price, setTokenA_Price] = useState(0);
    const [tokenB_Price, setTokenB_Price] = useState(0);
    const [tokenA_Quantity, setTokenA_Quantity] = useState(0)
    const [tokenB_Quantity, setTokenB_Quantity] = useState()
    const [outputQuantity, setOutputQuantity] = useState()
    const [pairToken,setPairToken] = useState()
    const ROUTER_ADDRESS = "0xde56B2fD977e96e67fF7B073c5920f42c9B256Ab"

    const fetchHistoricData = async () => {
        console.log("a" + tokenA + " \n b" + tokenB)
        const dataTokenA = (await axios.get(HistoricalChart(tokenA ? tokenA.id : "ethereum", days, currency))).data;
        console.log(tokenA)
        console.log(dataTokenA)
        if (tokenA) {
            if (tokenA.id === "atmos") {
                console.log("token A è atmos")
                setTokenA_Price(350)
            } else {
                const priceTokenA = (await axios.get(SingleCoin(tokenA ? tokenA.id : "dai"))).data;
                setTokenA_Price(priceTokenA.market_data.current_price)
            }
        } else {
            const priceTokenA = (await axios.get(SingleCoin(tokenA ? tokenA.id : "dai"))).data;
            setTokenA_Price(priceTokenA.market_data.current_price)
        }
        if (tokenB) {
            if (tokenB.id === "atmos") {
                console.log("token B è atmos")
                setTokenB_Price(350)
            } else {
                const priceTokenB = (await axios.get(SingleCoin(tokenB ? tokenB.id : "dai"))).data;
                setTokenB_Price(priceTokenB.market_data.current_price)
            }
        } else {
            const priceTokenB = (await axios.get(SingleCoin(tokenB ? tokenB.id : "dai"))).data;
            setTokenB_Price(priceTokenB.market_data.current_price)
        }
        setHistoricDataTokenA(dataTokenA.prices);
    };

    useEffect(() => {
        fetchHistoricData();
    }, [days, tokenA, tokenB, currency])

    const swapTokens = async (value) => {
        // Se i due token sono stati selezionati nello Swap
        if (tokenA && tokenB && value !== 0) {
            if (tokenA.symbol !== "ETH") {
                const path = [
                    tokenA.address,
                    tokenB.address
                ]
                const deadline = Math.floor(Date.now() / 1000 + (10 * 60))
                const valueConverted = new BN(value)
                setTokenA_Quantity(valueConverted)
                console.log("aa")
                console.log(valueConverted)
                console.log(path)
                console.log(deadline)
                console.log(props.currentAccount)
                try {
                    const PairAddress = await props.factory.methods.getPair(tokenA.address, tokenB.address).call();
                    console.log(PairAddress)

                    //Metodo del contratto AtmosRouter.sol per lo swap di token
                    await props.router.methods.swapExactTokensForTokens(
                        valueConverted,
                        new BN(0),
                        path,
                        props.currentAccount,
                        deadline
                    ).send({from: props.currentAccount, gas: 500000}).then(tx => {
                        console.log("swapExactTokensForToken tx: ", tx)
                    });
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            const WETH = await props.router.methods.WETH().call()
            console.log(WETH)
            const path = [
                WETH,
                tokenB.address
            ]
            const deadline = Math.floor(Date.now() + (10 * 60))
            const valueConverted = new BN(value)
            setTokenA_Quantity(valueConverted)
            console.log(valueConverted)
            console.log(path)
            console.log(deadline)
            try {
                const PairAddress = await props.factory.methods.getPair(tokenA.address, tokenB.address).call();
                console.log(PairAddress)
                //Metodo del contratto AtmosRouter.sol per lo swap di token
                await props.router.methods.swapExactETHForTokens(
                    valueConverted,
                    new BN(0),
                    path,
                    props.currentAccount,
                    deadline
                ).send({from: props.currentAccount, gas: 500000}).then(tx => {
                    console.log("swapExactTokensForToken tx: ", tx)
                });
            } catch (error) {
                console.log(error)
            }
        }
    }

    const setDataTokenA = (token) => {
        setTokenA(token)
    }

    const setDataTokenB = (token) => {
        setTokenB(token)
    }

    const getPriceSwap = async (value) => {
        const utilsSet = async (convertion) => {
            console.log(props.web3.utils.toWei(value, convertion))
            //const swapPriceJSON = await axios.get(PriceSwap(tokenA.symbol, tokenB.symbol, props.web3.utils.toWei(value, convertion)))
            //setOutputQuantity(swapPriceJSON.data.price)
        }
        // Se i due token sono stati selezionati nello Swap
        if (tokenA && tokenB && value !== '' && value !== 0) {
            console.log(value)
            setTokenA_Quantity(value)
            setLoading(true)
            if (tokenB.decimals === 18) {
                await utilsSet("ether")
            }
            if (tokenB.decimals === 8) {
                await utilsSet("gwei")
            }
            if (tokenB.decimals === 6) {
                await utilsSet("mwei")
            }
            setLoading(false)
        }
    }


    const renderButton = () => {
        if(props.isConnected)
            return(
                <button type="button" className="btn-swap"
                        onClick={() => swapTokens(tokenA_Quantity)}>Swap</button>
            )
        else
            return(
                <button type="button" className="btn-swap" onClick={props.showCard}>Connect Wallet</button>
            )
    }

    return (
        <>
            <Select
                variant="outlined"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currency}
                style={{width: 100, height: 40, marginLeft: 15, background: "#c6c6c6"}}
                onChange={(e) => setCurrency(e.target.value)}
            >
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
            </Select>
            <div className="container-row">
                <div className="graphic-card">

                    <Line
                        data={{
                            labels: historicDataTokenA?.map((coin) => {
                                let date = new Date(coin[0]);
                                let time =
                                    date.getHours() > 12
                                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                        : `${date.getHours()}:${date.getMinutes()} AM`;
                                return days === 1 ? time : date.toLocaleDateString();
                            }),

                            datasets: [
                                {
                                    data: historicDataTokenA?.map((coin) => coin[1] / tokenB_Price[currency.toLowerCase()]),
                                    label: `Price ${tokenA ? tokenA.symbol : "ETHEREUM"}/${tokenB ? tokenB.symbol : "DAI"}  in ${currency}`,
                                    borderColor: "#12308c",
                                },
                            ],
                        }}

                        options={{
                            elements: {
                                point: {
                                    radius: 1,
                                },
                            },
                        }}
                    />

                    <div className="graphic-buttons">
                        {chartDays.map((day) => (
                            <SelectButton
                                key={day.value}
                                onClick={() => {
                                    setDays(day.value);
                                }}
                                selected={day.value === days}
                            >
                                {day.label}
                            </SelectButton>
                        ))}
                    </div>
                </div>
                <div className="swap-card">
                    <div className="swap-card-first-row">
                        <div className="swap-card-column">
                            <h1 style={{
                                fontSize: 20,
                                color: "white"
                            }}>{`${tokenA ? tokenA.symbol : "ETHEREUM"}/${tokenB ? tokenB.symbol : "DAI"}-${currency}`}</h1>
                            <h1 style={{fontSize: 12, color: "#c6c6c6"}}>Trading has never felt so easy</h1>
                        </div>
                        <IoMdSettings size={25} style={{color: "#12308c", cursor: "pointer"}}/>
                    </div>
                    <TokenA getPriceSwap={getPriceSwap} setDataTokenA={setDataTokenA}
                            currentAccount={props.currentAccount} web3={props.web3}/>

                    <CgArrowsExchangeV size={50} style={{color: "white", margin: 5}}/>

                    <TokenB setDataTokenB={setDataTokenB} currentAccount={props.currentAccount} web3={props.web3}
                            loading={loading} outputQuantity={outputQuantity}/>
                    {renderButton()}
                </div>
            </div>
        </>
    )
}