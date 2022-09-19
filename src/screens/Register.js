import { useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Register(props){
    const navigate = useNavigate();
    const userNameRef = useRef();
    const passwordRef = useRef();
    const fullNameRef = useRef();
    const [emailError,setEmailError] = useState("")
    const [passwordError,setPasswordError] = useState("")
    const [authError,setAuthError] = useState("")
    const [fullNameError,setFullNameError] = useState("")

    const handleLoginForm = (e)=>{
        e.preventDefault();
        const USERNAME = userNameRef.current.value;
        const PASSWORD = passwordRef.current.value;
        const FULL_NAME = fullNameRef.current.value;

        const FORM_BODY = {
            email:USERNAME,
            password:PASSWORD,
            name:FULL_NAME
        }

        fetch(`${process.env.REACT_APP_API_HOST}/auth/register`,{
            method:"post",
            mode:'cors',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(FORM_BODY)
        }).then((response)=>response.json())
            .then(json=>{
                manageLoginResponse(json)
            })
    }

    const manageLoginResponse = (response)=>{
        if(response.hasErrors)
        {
            setEmailError(response.errors.email)
            setPasswordError(response.errors.password)
            setFullNameError(response.errors.name)
            setAuthError(response.errors.user)
        }else
        {
            alert("You have been registered")
            setTimeout(()=>{return navigate("/")},2000)
        }
    }

    return (

        <div className={"login-form-container"}>
            <form className={"login-form"} onSubmit={handleLoginForm}>
                <h2>Register</h2>
                <input placeholder={"Full Name"} ref={fullNameRef} required className={"input-box"} type={"text"} name={"fullname"}/>
                <label className={"err-label"}>{fullNameError}</label>
                <input placeholder={"Email"} ref={userNameRef} required className={"input-box"} type={"email"} name={"email"}/>
                <label className={"err-label"}>{emailError}</label>

                <input placeholder={"Password"} ref={passwordRef} required className={"input-box"} type={"password"} name={"password"}/>
                <label className={"err-label"}>{passwordError}</label>

                <input className={"login-btn"} type={"submit"} value={"Register"}/>
                <label className={"err-label"}>{authError}</label>
            </form>
        </div>

    )
}