import { Container, Button } from 'react-bootstrap'
import {FaFacebook, FaInstagram, FaTwitter, FaYahoo} from "react-icons/fa";
import { useState } from "react";


export default function Footer(){
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubscribe = async () => {
        if (!email) {
            setMessage("Внеси email адреса");
            return;
        }

        try {
            const res = await fetch("http://localhost:9091/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const text = await res.text(); // ⬅️ ВАЖНО

            if (!res.ok) {
                throw new Error(text);
            }

            setMessage(text);
            setEmail("");
        } catch (err) {
            console.error("FETCH ERROR:", err);
            setMessage("Настана грешка, пробај повторно");
        }
    };



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
                <a href="mailto:univibe2025@yahoo.com" >
                    <FaYahoo size={30} color="#6B2FB9" />
                </a>
            </div>
            <div>Не пропуштајте универзитетски настани <input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}

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
                    onClick={() => {
                        handleSubscribe();
                    }}
                    disabled={!email}
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
                {message && (
                    <div
                        style={{
                            marginTop: "10px",
                            color: message.includes("Успешно") ? "#16a34a" : "#dc2626",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}
                    >
                        {message}
                    </div>
                )}

            </div>
        </Container>

    )
}