import { useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Login(props){
    const navigate = useNavigate();
    const userNameRef = useRef();
    const passwordRef = useRef();
    const [emailError,setEmailError] = useState("")
    const [passwordError,setPasswordError] = useState("")
    const [authError,setAuthError] = useState("")

    const handleLoginForm = (e)=>{
        e.preventDefault();
        const USERNAME = userNameRef.current.value;
        const PASSWORD = passwordRef.current.value;

        const FORM_BODY = {
            email:USERNAME,
            password:PASSWORD
        }

        fetch(`${process.env.REACT_APP_API_HOST}/auth/login`,{
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
            setAuthError(response.errors.user)
        }else
        {
            localStorage.setItem("token",response.access_token)
            return navigate("/home")
        }
    }

    return (

            <div className={"login-form-container"}>
                <form className={"login-form"} onSubmit={handleLoginForm}>
                        <h2>Login</h2>
                    <input placeholder={"Email"} ref={userNameRef} required className={"input-box"} type={"email"} name={"email"}/>
                    <label className={"err-label"}>{emailError}</label>

                    <input placeholder={"Password"} ref={passwordRef} required className={"input-box"} type={"password"} name={"password"}/>
                    <label className={"err-label"}>{passwordError}</label>

                    <input className={"login-btn"} type={"submit"} value={"login"}/>
                    <label className={"err-label"}>{authError}</label>
                    <Link to={"/register"} className={"App-link"} >Don't have an account? Register</Link>
                </form>

            </div>

    )
}