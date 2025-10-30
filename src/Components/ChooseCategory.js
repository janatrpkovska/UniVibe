import { Link } from "react-router-dom";

export default function ChooseCategory(){

    return(
        <>
            <div>izberi kategorija:</div>
            <Link to="/events/tehnologija">Технологија</Link><br/>
            <Link to="/events/kariera">Кариера</Link><br/>
            <Link to="/events/istrazuvanje">Истражување</Link><br/>
            <Link to="/events/kultura">Култура</Link><br/>
            <Link to="/events/zdravje">Здравје</Link><br/>
            <Link to="/events/edukacija">Едукација</Link><br/>
            <Link to="/events/zabava">Забава</Link>
        </>
    )
}