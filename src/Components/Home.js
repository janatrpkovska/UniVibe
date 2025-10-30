import { Link } from "react-router-dom";

export default function Home(){
    return(
        <>
            <div>Homepage</div>
            <Link to="/search">Search</Link>
        </>
    )
}