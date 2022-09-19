import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function Home(){
    const navigate = useNavigate();
    const [journals,setJournals] = useState([])
    const [userid,setUserid] = useState(0)

    useEffect(()=>{
        getJournals();
        const TOKEN = localStorage.getItem("token");
        const user = jwtDecode(TOKEN)
        setUserid(user.id)

    },[])

    const getJournals = ()=>{
        const TOKEN = localStorage.getItem("token");
        fetch(`${process.env.REACT_APP_API_HOST}/journals`,{
            method:"get",
            mode:"cors",
            headers:{
                Authorization: `Bearer ${TOKEN}`
            }
        }).then(response=>response.json())
            .then(response=>{
                if(response.hasErrors)
                {
                    if(response.errors.user && response.errors.user === "Invalid User")
                    {
                        localStorage.removeItem("token");
                        return navigate("/");
                    }
                }else{
                    setJournals(response.data);
                }
            })
    }

    const deleteJournal = (e,id)=>{
        e.preventDefault();
        const TOKEN = localStorage.getItem("token")
        const user_id = jwtDecode(TOKEN).id
        const JOURNAL = journals.filter(journal=>journal[0] === id)[0]

        if(JOURNAL[2]!== user_id) alert("Not Allowed");
        else{
            fetch(`${process.env.REACT_APP_API_HOST}/journal/${id}`,{
                method:"delete",
                mode:'cors',
                headers:{
                    Authorization: `Bearer ${TOKEN}`
                }
            }).then(res=>res.json())
                .then(js=>{
                    manageDeleteResponse(js,id)
                })
        }
    }

    const manageDeleteResponse = (res,id)=>{
        if(res.hasErrors)
        {
            if(res.errorType==="auth")
            {
                localStorage.removeItem("token")
                return navigate("/")
            }
            if(res.errorType==="notAllowed") alert("Not Allowed")
            if(res.errorType === "journalNotFound") alert("Journal doesn't exist or already deleted")

        }else{
            alert("Journal Deleted");
            const journals_new = journals.filter(journal=>journal[0]!== id);
            setJournals(journals_new)
        }
    }

    return (
        <>
            <Link className={"new-btn"} to={"/journal/new"}>New Journal</Link>
        <table className={"journal-list"}>
            <thead className={"list-heading"}>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Quote</th>
                    <th>Posted by</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {journals.length === 0 ? <tr><td colSpan={6}>No Journals Available</td></tr>
            :
                journals.map((journal,index)=>{
                    const date = new Date(journal[6])
                    return (
                        <tr key={`journal_${index}`} >
                            <td>{index+1}</td>
                            <td>{journal[1]}</td>
                            <td>{journal[3]}</td>
                            <td>{journal[4]}</td>
                            <td>{`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</td>
                            <td>
                                <Link className={"action-link"} to={`/journal/${journal[0]}`} >{userid === journal[2]?"Edit":"View"}</Link>
                                {
                                    userid === journal[2] && <Link className={"action-link"} onClick={e=>{deleteJournal(e,journal[0])}} to={`#`} >Delete</Link>
                                }
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
        </>
    )
}