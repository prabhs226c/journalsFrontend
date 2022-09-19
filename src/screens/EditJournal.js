import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function EditJournal()
{
    const params = useParams();
    const navigate = useNavigate();

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [journalData,setJournalData] = useState([])
    const [titleError,setTitleError] = useState("");
    const [descriptionError,setDescriptionError] = useState("");
    const [userId,setUserId] = useState(0)

    useEffect(()=>{
        const JOURNAL_ID = params.id
        const TOKEN = localStorage.getItem("token");
        const USER = jwtDecode(TOKEN)
        const USER_ID = USER.id;
        setUserId(USER_ID);

        getJournal(JOURNAL_ID)
    },[])

    const getJournal= (id)=>{
        const TOKEN = localStorage.getItem("token");
        fetch(`${process.env.REACT_APP_API_HOST}/journal/${id}`,{
            method:"GET",
            mode:"cors",
            headers:{
                Authorization:`Bearer ${TOKEN}`
            }
        }).then(res=>res.json())
            .then(js=>{
                manageJournal(js);
            })
    }

    const manageJournal = (data)=>{
        if(data.hasErrors)
        {
            if(data.errorType === "journalNotFound") return navigate("/home")
            if(data.errorType === "auth") {
                localStorage.removeItem("token");
                return navigate("/")
            }
        }else{
            titleRef.current.value = data.data[3]
            descriptionRef.current.value = data.data[4]
            setJournalData(data.data)
        }
    }

    const handleJournalForm = (e)=>{
        e.preventDefault();
        const TOKEN = localStorage.getItem("token");

        if(userId !== journalData[1])
        {
            alert("Not Allowed")
        }else{
            const TITLE = titleRef.current.value;
            const DESCRIPTION = descriptionRef.current.value;

            const body = {title:TITLE,description:DESCRIPTION};

            fetch(`${process.env.REACT_APP_API_HOST}/journal/${params.id}`,{
                method:"put",
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
    }

    const manageUpdateResponse = data=>{
        if(data.hasErrors && data.errorType=== "auth") {
            localStorage.removeItem("token")
            return navigate("/")
        }
        if(data.hasErrors && data.errorType === "notAllowed") alert("Not Allowed")
        if(data.hasErrors && data.errorType === "formError")
        {
            setTitleError(data.errors.title);
            setDescriptionError(data.errors.description)
        }
        else{
            alert("Journal Updated")
            setTimeout(()=>{
                return navigate("/home")
            },2000)
        }
    }

    return ( <div className={"login-form-container"}>
        <form className={"login-form"} onSubmit={handleJournalForm}>
            <label className={"input-label"} >Title</label>
            <input readOnly={ userId !== journalData[1]} placeholder={"title"} ref={titleRef} required className={`input-box ${ userId !== journalData[1]?"readonly":""}`} type={"text"} name={"title"}/>
            <label className={"err-label"}>{titleError}</label>

            <label className={"input-label"}>Description</label>
            <input readOnly={ userId !== journalData[1]} placeholder={"description"} ref={descriptionRef} required className={`input-box ${ userId !== journalData[1]?"readonly":""}`} type={"text"} name={"description"}/>
            <label className={"err-label"}>{descriptionError}</label>

            <label className={"input-label"}>Inspirational Quote</label>
            <input   className={"input-box readonly"} type={"text"} readOnly={true} value={`${journalData[5]}  __${journalData[6]}`}/>

            {
                userId === journalData[1] && <input className={"login-btn"} type={"submit"} value={"Update"}/>
            }

        </form>
    </div>)
}