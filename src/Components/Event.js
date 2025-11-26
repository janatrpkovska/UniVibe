import { useParams } from "react-router-dom"

export default function Event () {
    const { id } = useParams()

    return(
        <>
            <div>Event: {id}</div>
        </>
    )
}