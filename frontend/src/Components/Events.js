import { useParams } from "react-router-dom"

export default function Events(){
    const { category } = useParams()

    return(
        <div>
            kategorija: {category}
        </div>
    )
}