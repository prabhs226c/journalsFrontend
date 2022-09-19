import logo from "../logo.svg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
export default function Header(props)
{
    const navigation = useLocation();
    const [name,setName] = useState("");
    const navigate = useNavigate()

    useEffect(()=>{
        const token = localStorage.getItem("token")

        if(token === null && navigation.pathname !== "/" && navigation.pathname !== "/register" ){
            return navigate("/")
        }
        if(token !== null  && (navigation.pathname ==="/" || navigation.pathname === "/register")) return navigate("/home")
        if(token !== null) {
            const username = jwtDecode(token).name
            setName(username)
        }
    },[navigation.pathname])

    const logout = (e)=>{
        e.preventDefault()
        localStorage.removeItem("token")
        return navigate("/")
    }

    return <header className="App-header">

        <div className={"header-left"}>
            <img src={logo} className="App-logo" alt="logo" />
            <p className={"App-user"}>{name}</p>
        </div>
        <div>
            <Link className={"theme-switch"} to={"#"} onClick={(e)=>{e.preventDefault(); props.SwitchTheme();}} ></Link>
            {navigation.pathname !== "/" && navigation.pathname !== "/register" && <Link to={""} onClick={logout} className={"App-link"} >{"Logout"}</Link>}
        </div>
    </header>
}
