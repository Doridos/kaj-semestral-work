import React, { useState } from 'react'
import './welcomepage.css'
import {App} from "./components/App.jsx";
import {Body} from "./components/Body.jsx";

function WelcomePage() {
  const [username, setUsername] = useState(localStorage.getItem("user"))

  return (
    <div>
        {
            username?
                (
                    <React.Fragment>
                      < App username={username} function={setUsername}/>
                    </React.Fragment>
                )
                :
                (<div className="login-box">
                    <h1>Login to My notebook</h1>
                    <form onSubmit={event => {
                        event.preventDefault()
                        let formField = document.querySelector("#username")
                        let submitUsername = new FormData(event.currentTarget).get("username")
                        if(submitUsername==="") {
                          alert("Please enter your username.")
                          formField.classList.add('red-border')
                        }
                        localStorage.setItem("user",submitUsername)
                        setUsername(submitUsername)
                    }}>
                            <label htmlFor="username">Username:</label>
                            <input id="username" name="username" type="text" placeholder="Enter your username" autoComplete="new-password"
                                   autoFocus required></input>
                            <button type="submit">Login</button>
                    </form>
                </div>
                )
        }
    </div>
  )
}

export default WelcomePage
