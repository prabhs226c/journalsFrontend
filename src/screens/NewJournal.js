import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function NewJournal()
{

    const params = useParams();
    const navigate = useNavigate();

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [journalData,setJournalData] = useState([])
    const [titleError,setTitleError] = useState("");
    const [descriptionError,setDescriptionError] = useState("");
    const [quote,setQuote] = useState("Inspirational Quote placeholder")
    const [author,setAuthor] = useState("Author")

    useEffect(()=>{
        fetch("https://zenquotes.io/api/quotes",{
            method:"get",
            mode:"cors",
            headers:{
                "Content-Type":"application/json",
                accept: "application/json"
            }
        })
            .then(res=>res.json())
            .then(js=>{
                    setQuote(js[0].q!==undefined?js[0].q:"Inspirational Quote placeholder")
                    setAuthor(js[0].a!==undefined?js[0].a:"Author")
            })


    },[])
    const handleJournalForm = (e)=>{
        e.preventDefault();
        const TOKEN = localStorage.getItem("token");

        const TITLE = titleRef.current.value;
        const DESCRIPTION = descriptionRef.current.value;

        const body = {title:TITLE,description:DESCRIPTION,quote:quote,author:author};

        fetch(`${process.env.REACT_APP_API_HOST}/journal`,{
            method:"post",
            mode:"cors",
            headers:{
                Authorization:`Bearer ${TOKEN}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify(body)

        }).then(res=>res.json())
            .then(js=>{
                manageUpdateResponse(js)
            })

    }

    const manageUpdateResponse = data=>{
        if(data.hasErrors && data.errorType=== "auth") {
            localStorage.removeItem("token")
            return navigate("/")
        }
        if(data.hasErrors && data.errorType === "formError")
        {
            setTitleError(data.errors.title);
            setDescriptionError(data.errors.description)
        }
        else{
            alert("Journal Saved")
            setTimeout(()=>{
                return navigate("/home")
            },2000)
        }
    }

    return ( <div className={"login-form-container"}>
        <form className={"login-form"} onSubmit={handleJournalForm}>
            <label className={"input-label"}>Title</label>
            <input placeholder={"Title"} ref={titleRef} required className={"input-box"} type={"text"} name={"title"}/>
            <label className={"err-label"}>{titleError}</label>

            <label className={"input-label"}>Description</label>
            <input placeholder={"Description"} ref={descriptionRef} required className={"input-box"} type={"text"} name={"description"}/>
            <label className={"err-label"}>{descriptionError}</label>

            <label className={"input-label"}>Inspirational Quote</label>
            <input  className={"input-box readonly"} type={"text"} readOnly={true} value={`${quote}  __${author}`}/>

            <input className={"login-btn"} type={"submit"} value={"Save Journal"}/>

        </form>
    </div>)
}