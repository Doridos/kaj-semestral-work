import React from "react";
import {TopBar} from "./TopBar.jsx";
import {Body} from "./Body.jsx";

export function App(props) {
    let username = props.username;
    const setUsername = props.function

    return (
        <React.Fragment>
            <TopBar username={username} function={setUsername}/>
            <Body username={username} />
        </React.Fragment>
    );
}