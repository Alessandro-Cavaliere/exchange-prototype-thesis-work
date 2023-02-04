import { BrowserRouter as Router,Switch, Route } from 'react-router-dom';
import './App.css';
import {useEffect, useState} from "react";
import Web3 from "web3";
import {Home} from "./components/Home";
import {Navbar} from "./components/Navbar";
import {Footer} from "./components/Footer";
import {Swap} from "./components/Swap";
import {SetAtmosFactoryContract} from "./components/contractsCreation/SetAtmosFactory";
import {SetAtmosRouterContract} from "./components/contractsCreation/SetAtmosRouter";
import {Liquidity} from "./components/Liquidity";
import {ConnectionCard} from "./components/ConnectionCard";

function App() {

    /*
    Use State Hooks
    */
    const [currentAccount,setCurrentAccount] =useState(null)
    const [web3,setWeb3] =useState(null)
    const [provider,setProvider] =useState(window.ethereum)
    const [isConnected,setIsConnected] =useState(false)
    const [routerContract, setRouterContract] = useState(null)
    const [factoryContract, setFactoryContract] = useState(null)
    const [active, setActive] = useState(-1)
    const [currentNetwork,setCurrentNetwork]=useState()


    //List of chainId of Mainent and Testnet
    const NETWORKS = {
        1: "Ethereum Main Network",
        3: "Ropsten Test Network",
        4: "Rinkeby Test Network",
        5: "Goerli Test Network",
        42: "Kovan Test Network",
    };

    /*
    Funzione che mostra il card per la scelta del tipo di
    wallet e alla relativa connesione ad esso riferito
    */
    const showCard = () => {
        if(active===-1) setActive(0)
        if(active===0) setActive(1)
        if(active===1) setActive(0)
    }

    /*
    Funzione asincrona onLogin per il setting degli state utili e dell'oggetto web3 con
    l'ausilio del provider ottenuto dalla componente ConnectionCard.js connettendosi a Metamask.
    */

    const onLogin = async (provider) => {
        const web3= new Web3(provider)
        const accounts = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (accounts.length === 0) {
            console.log("Please connect to MetaMask!");
        } else if (accounts[0] !== currentAccount) {
            setProvider(provider);
            setWeb3(web3);
            setCurrentNetwork(chainId);
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
            window.localStorage.setItem('IS_CONNECTED',accounts[0]);

            /*Create local contracts copy */
            const factory=SetAtmosFactoryContract(web3)
            setFactoryContract(factory)

            const router=SetAtmosRouterContract(web3)
            setRouterContract(router)

            console.log(router)
            console.log(factory)
        }
    };

    /*
    Al refresh della pagina si salva lo stato precedente dell'utente loggato a Metamask per preservare la sua sessione.
     */

    useEffect(() => {
        const reset=async ()=>{
            await onLogin(window.web3.currentProvider)
        }
        if (String(window.performance.getEntriesByType("navigation")[0].type) === "reload") {
            if(localStorage.getItem('IS_CONNECTED')!==null){
                reset().then(()=>{
                    console.log("Page Refreshed")
                })
            }
        }
        },[window.performance.getEntriesByType("navigation")[0].type])

    /*
        Ogni render della pagina , si controlla se è
        stato cambiato l'account Metamask oppure è stato cambiato network
    */

    useEffect(() => {
        const handleAccountsChanged = async (accounts) => {
            if (accounts.length === 0) {
                onLogout();
            } else if (accounts[0] !== currentAccount) {
                setCurrentAccount(accounts[0]);
                window.localStorage.setItem('IS_CONNECTED',accounts[0]);
            }
        };

        const handleChainChanged = async () => {
            const web3ChainId = await web3.eth.getChainId();
            setCurrentNetwork(web3ChainId);
        };

        if (isConnected) {
            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
        }


        return () => {
            if (isConnected) {
                provider.removeListener("accountsChanged", handleAccountsChanged);
                provider.removeListener("chainChanged", handleChainChanged);
            }
        };
    }, [isConnected]);

    /*
    Disconessione da Metamask
    */

    const onLogout = () => {
        setIsConnected(false);
        setCurrentAccount(null);
        window.localStorage.clear();
    };

    /*
    Questa coppia di UseEffect permette di salvare lo state (l'address dell'account : currentAccount)
    nel LocalStorage e di persistere anche dopo il refresh della pagina in React.js
    */

    useEffect(async () => {
        const data = localStorage.getItem('IS_CONNECTED');
        if (data !== null) setCurrentAccount(data);
    }, []);

    useEffect(() => {
        if(localStorage.getItem('IS_CONNECTED')===null)
            window.localStorage.setItem('IS_CONNECTED', JSON.stringify(currentAccount));
    }, [isConnected]);

    return (
      <>
          <Router>
              {
                  (active === 0) ? <ConnectionCard className="connection-card" classnameBlur="container-card" onLogin={onLogin} showCard={showCard}/> :
                      (active === 1) ? <ConnectionCard className="connection-card fadeOut" classnameBlur="container-card blurOut"/> : null
              }
              {/*Navbar component*/}
              <Navbar isConnected={isConnected} currentAccount={currentAccount}
                      web3={web3} showCard={showCard} active={active}/>

              {/*ROTTE DELLA PIATTAFORMA*/}
              <Switch>

                  <Route exact path='/'
                         render={() => <Home
                              currentAccount={currentAccount}/>}
                  />

                  <Route path='/swap'
                         render={()=> <Swap web3={web3} router={routerContract}
                                            factory={factoryContract}  isConnected={isConnected} showCard={showCard}
                                            currentAccount={currentAccount}/>}/>

                  <Route path='/liquidity'
                         render={()=> <Liquidity web3={web3} router={routerContract}
                                      factory={factoryContract}  isConnected={isConnected} showCard={showCard}
                                      currentAccount={currentAccount}/>}/>
              </Switch>

              {/*Footer component*/}
              <Footer/>

          </Router>
      </>
  );
}

export default App;
