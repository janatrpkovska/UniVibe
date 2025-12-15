import { Container, Button } from 'react-bootstrap'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer(){
    return(
        <Container
            fluid
            style={{
                boxShadow: "0 -4px 6px -4px rgba(0, 0, 0, 0.2)", 
            }}
            className="text-center py-3 bg-light"
            >
            <div className="d-flex justify-content-center gap-5 mb-3">
                <FaInstagram size={30} color="#E1306C" />
                <FaFacebook size={30} color="#547fffff" />
                <FaTwitter size={30} color="#69cdffff" />
            </div>
            <div>Претплатете се на нашиот билтен <input
                placeholder="example@example.com"
                style={{
                    width: "50%",
                    maxWidth: "15em",
                    height: "50%",
                    maxHeight: "3em",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    outline: "none",
                    fontSize: "15px",
                    background: "#fafafa",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                }}
                onFocus={(e) => {
                    e.target.style.border = "2px solid #EBC042";
                    e.target.style.boxShadow = "0 0 8px rgba(235,192,66,0.4)";
                    e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                    e.target.style.border = "2px solid #e0e0e0";
                    e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
                    e.target.style.background = "#fafafa";
                }}
                />

                <Button
                    type="button"
                    style={{
                        backgroundColor: '#ffcc33',
                        color: 'black',
                        border: '0px solid',
                        boxShadow: 'none',
                        borderRadius: '10px',
                        maxHeight: '5vh',
                        height: '5vh',
                    }}
                    className="focus-outline my-4 mx-2"
                >
                    Subscribe
                </Button>
            </div>
        </Container>

    )
}