import {Link} from "react-router-dom";
import atmIcon from "../../../atmosphere-arc-exchange-frontend/src/assets/atmIcon.png";
import {IoWallet} from "react-icons/io5"
import "../styles/navbar.css"
import {NavbarElements} from "../config/NavbarElements";
export function Navbar(props) {
        return (
            <>
                {/*Primary navbar with different section reference*/}
                <nav className="nav">
                    <div className="nav-row">
                        <Link to="/">
                        <img src={atmIcon} alt="atmosphere arc icon" className="atm-icon"/>
                        </Link>
                        {NavbarElements.map((item, index) => {
                            return (
                                <div key={index} >
                                    <Link to={item.path}>
                                        <button className="btn">
                                            {item.title}
                                        </button>
                                    </Link>
                                </div>
                            );
                        })}
                        {props.currentAccount === null?
                            <button className="btn-connection" onClick={props.showCard}>Connect Wallet</button> :
                            <div className="wallet-style fadeIn">
                                <div className="wallet-icon-div">
                                    <IoWallet className="wallet-icon"/>
                                </div>
                                <h1 className="container-right-h1 fadeIn">{props.currentAccount.substring(0, 2) + "..." + props.currentAccount.substring(props.currentAccount.length - 3, props.currentAccount.length).toUpperCase()}</h1>
                            </div>
                        }
                    </div>
                </nav>
            </>
        )
    }