import "../styles/footer.css"
import * as socialIcons from "react-icons/ai"
export function Footer(){
    return(
        <>
            <footer className="footer">
                <div className="box">
                    <div className="row">
                        <div className="footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="/">about us</a></li>
                                <li><a href="/">our services</a></li>
                                <li><a href="/">privacy policy</a></li>
                                <li><a href="/">affiliate program</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Get help</h4>
                            <ul>
                                <li><a href="/">FAQ</a></li>
                                <li><a href="/">How to log-in?</a></li>
                                <li><a href="/">How to stake?</a></li>
                                <li><a href="/">How to lock?</a></li>
                                <li><a href="/">How to invest?</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Supporto</h4>
                            <ul>
                                <li><a href="/">ATMOS help center</a></li>
                                <li><a href="/">Support</a></li>
                                <li><a href="/">Chat bot</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Social</h4>
                            <div className="social-icons">
                                <a href="/"><socialIcons.AiFillFacebook className="social-icons"/></a>
                                <a href="/"><socialIcons.AiFillInstagram className="social-icons"/></a>
                                <a href="/" className="icon"><socialIcons.AiFillTwitterCircle className="social-icons"/></a>
                                <a href="/" className="icon"><socialIcons.AiFillLinkedin className="social-icons"/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}