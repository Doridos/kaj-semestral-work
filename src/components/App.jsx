import React, { useEffect, useState } from "react";
import { TopBar } from "./TopBar.jsx";
import { Body } from "./Body.jsx";
import { Menu } from "./Menu.jsx";
import { Audio } from "./Audio.jsx";
import { Todo } from "./Todo.jsx";
import {emptyHistory} from "./Canvas.jsx";

// Basic component for skeleton of application.
export function App(props) {
    const username = props.username;
    const setUsername = props.function;
    const [value, setValue] = useState(null);

    let componentToRender;
    switch (value) {
        case 'notebooks':
            componentToRender = <Body username={username} />;
            emptyHistory()
            break;
        case 'audio':
            componentToRender = <Audio />;
            break;
        case 'todo':
            componentToRender = <Todo />;
            break;
        default:
            componentToRender = <Body username={username} />;
            emptyHistory()
    }

    function handleValueChange(newValue){
        setValue(newValue)
    }

    return (
        <React.Fragment>
            <TopBar username={username} function={setUsername} />
            <Menu handleValueChange={handleValueChange} />
            {componentToRender}
        </React.Fragment>
    );
}
