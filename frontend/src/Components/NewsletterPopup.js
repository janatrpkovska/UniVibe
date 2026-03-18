import { useState, useEffect } from "react";
import axios from "axios";

function NewsletterPopup() {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const subscribed = localStorage.getItem("newsletterSubscribed");

        if (!subscribed) {
            setShow(true);
        }
    }, []);

    const handleSubscribe = () => {
        if (!email) {
            alert("Внесете email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Невалидна email адреса");
            return;
        }

        axios.post("http://localhost:9091/api/newsletter/subscribe", { email })
            .then((response) => {
                const message = response.data?.message;

                if (!message) {
                    alert("Грешка при претплата");
                    return;
                }
                if (message.includes("веќе си на листата")) {
                    alert("Овој email веќе е претплатен!");
                } else if (message.includes("Невалидна email адреса")) {
                    alert("Невалидна email адреса");
                } else {
                    alert(message);
                    localStorage.setItem("newsletterSubscribed", "true");
                    setShow(false);
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Грешка при претплата");
            });
    };

    const closePopup = () => {
        setShow(false);
    };
    if (!show) return null;

    return (
        <div style={overlayStyle}>
            <div style={popupStyle}>
                <button onClick={closePopup} style={closeButton}>
                    ✕
                </button>
                <h2 style={{marginBottom:"10px"}}>Претплати се на Newsletter</h2>
                <p style={{marginBottom:"20px"}}>
                    Добиј ги најновите студентски настани директно на твојот email!
                </p>
                <input
                    type="email"
                    placeholder="Внеси email..."
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    style={inputStyle}
                />

                <button onClick={handleSubscribe} style={buttonStyle}>
                    Претплати се
                </button>
            </div>
        </div>
    );
}

export default NewsletterPopup;

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(4px)"
};

const popupStyle = {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "16px",
    width: "400px",
    maxWidth: "90%",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    transform: "scale(1)",
    transition: "transform 0.3s ease-in-out",
};

const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)"
};

const buttonStyle = {
    width: "100%",
    padding: "12px 0",
    background: "linear-gradient(90deg, #ffcc33 0%, #ffb347 100%)",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(255,204,51,0.3)"
};

const closeButton = {
    position: "absolute",
    top: "12px",
    right: "12px",
    border: "none",
    background: "transparent",
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#888",
    transition: "color 0.2s ease"
};

buttonStyle[':hover'] = {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(255,204,51,0.4)"
};

closeButton[':hover'] = {
    color: "#333"
};

inputStyle[':focus'] = {
    borderColor: "#ffcc33",
    boxShadow: "0 0 0 3px rgba(255,204,51,0.2)"
};

