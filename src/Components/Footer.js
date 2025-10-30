import Container from 'react-bootstrap/Container'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer(){
    return(
        <Container
            fluid
            style={{
                boxShadow: "0 -4px 6px -4px rgba(0, 0, 0, 0.2)", // subtle top shadow
            }}
            className="text-center py-3 bg-light"
            >
            <div className="d-flex justify-content-center gap-5 mb-3">
                <FaInstagram size={30} color="#E1306C" />
                <FaFacebook size={30} color="#547fffff" />
                <FaTwitter size={30} color="#69cdffff" />
            </div>
            <div>Претплатете се на нашиот билтен <input placeholder='example@example.com'/><input type='button' value='submit'/></div>
        </Container>

    )
}