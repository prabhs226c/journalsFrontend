import './App.css';
import Header from "./components/Header";
import {Route, Routes, useNavigate} from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import useLocalStorage from "use-local-storage";
import EditJournal from "./screens/EditJournal";
import NewJournal from "./screens/NewJournal";
import Register from "./screens/Register";

function App() {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

    const SwitchTheme = ()=>{
        const newTheme = theme === "light"?"dark":"light";
        setTheme(newTheme)
    }

    return (
    <div className="App" data-theme={theme}>
      <Header  currentTheme={theme} SwitchTheme={SwitchTheme} />
        <Routes  >
            <Route path={"/"}  element={<Login />}></Route>
            <Route path={"/register"} element={<Register />}></Route>
            <Route path={"/home"} element={<Home />}></Route>
            <Route path={"/journal/new"} element={<NewJournal/>}></Route>
            <Route path={"/journal/:id"} element={<EditJournal/>}></Route>
        </Routes>
    </div>
  );
}

export default App;
