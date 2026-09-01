import { createContext, useState } from "react";
import api from "../utils/api";


export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [token, setToken] = useState(localStorage.getItem("token"))

    const login = async (username, password)=>{

        const formBody = new URLSearchParams()
        formBody.append("username", username)
        formBody.append("password", password)

        const response = await api.post("/auth/login", formBody,{
            headers:{"Content-Type" :"application/x-www-form-urlencoded"},
        })

        const newToken = response.data.access_token
        
        localStorage.setItem('token', newToken)
        setToken(newToken)

    }

    const register = async (email, username, password, phonenumber, address)=>{
        
        const response = await api.post("/auth/register",{
            email : email,
            username: username,
            password: password,
            phone_number: phonenumber,
            address: address,
        })
        console.log(response)
    }


    const logout =()=>{
        localStorage.removeItem("token")
        setToken(null)
    }

    
    
    return(
        <AuthContext.Provider value={{token, setToken, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}