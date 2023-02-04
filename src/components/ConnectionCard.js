import {AiOutlineClose} from "react-icons/ai"
import "../styles/navbar.css"
import "../styles/connectionCard.css"
import {useEffect, useState} from "react"
import metamaskIcon from "../assets/metamaskIcon.png"
import {FiArrowLeft} from "react-icons/fi"
import {ConnectionCardElements} from "../config/ConnectionCardElements"
import {ClipLoader} from "react-spinners";

export function ConnectionCard(props) {

    const [isConnecting, setIsConnecting] = useState(false);
    const [provider, setProvider] = useState(window.ethereum);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

    useEffect(() => {
        setProvider(detectProvider());
    }, []);

    useEffect(() => {
        if (provider) {
            if (provider !== window.ethereum) {
                console.error(
                    "Not window.ethereum provider.  Do you have multiple wallets installed ?"
                );
            }
            setIsMetaMaskInstalled(true);
        }
    }, [provider]);

    const installMetamask = () => {
        window.location.href = 'https://metamask.io/download/';
    }

    const detectProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            console.warn("No Ethereum browser detected! Check out MetaMask");
        }
        return provider;
    };

    const onLoginHandler = async () => {
        setIsConnecting(true);
        await provider.request({
            method: "eth_requestAccounts",
        });
        setIsConnecting(false);
        props.showCard()
        props.onLogin(provider);
    };
    const handleClick = () => {
        setIsConnecting(false)
    }

    return (

        <>
            {isMetaMaskInstalled && (
                <>
                    {!isConnecting ?
                        <div className={props.classnameBlur}>
                            <div className={props.className}>
                                <div className="first-row">
                                    <h1 className="first-row-h1">Connect Wallet</h1>
                                    <AiOutlineClose className="first-row-icon" onClick={props.showCard}/>
                                </div>
                                <div className="grid-elements">
                                    {ConnectionCardElements.map((item, index) => {
                                        return (
                                            <div key={index} className={item.className} style={item.position}
                                                 onClick={onLoginHandler}>
                                                <img src={item.image} style={item.style} className="grid-icon"/>
                                                <p>{item.title}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div> :
                        <div className={props.classnameBlur}>
                        <div className={`${props.className} connecting`}>
                            <div className="row-connection">
                                <div><FiArrowLeft className="first-row-icon" onClick={handleClick}/></div>
                                <div><AiOutlineClose className="first-row-icon" onClick={props.showCard}/></div>
                            </div>
                            <div className="column-connection">
                                <div className="flex-div cont">
                                    <p className="p-style">
                                        Una volta connesso il tuo portafoglio potrai avere accesso allo <span
                                        style={{color: "#001e66"}}>Swap. </span>
                                        Clicca sul badge di notifica di Metamask se il form di login non ti è apparso.
                                    </p>
                                </div>

                                <div className="second-row-connection">
                                    <ClipLoader size={25}
                                                css="margin-right:20px; border-color:#406cb0; border-bottom-color:transparent"/>
                                    <p>Loading...</p>
                                </div>

                                <div className="second-row-connection alt">
                                    <div className="flex-div">
                                        <p style={{fontSize: 20}}>Metamask</p>
                                        <p style={{fontSize: 10}}>Easy-to-use browser extension.</p>
                                    </div>
                                    <img src={metamaskIcon} alt="Metamsk Icon" className="grid-icon"/>
                                </div>
                            </div>
                        </div>
                        </div>
                    }
                </>
            )}
            {!isMetaMaskInstalled && (
                <div className="metamask-card">
                    <div className="metamask-div">
                        <h1 className="metamask-h1">Please install Metamask</h1>
                        <button onClick={installMetamask} className="metamask-btn">Install MetaMask</button>
                        <div><img src={metamaskIcon} style={{height: 32}}/></div>
                    </div>
                </div>
            )}

        </>
    )
}
