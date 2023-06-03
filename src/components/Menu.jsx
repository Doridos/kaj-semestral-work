import { deleteDB } from './indexedDB.jsx';
import React, { useState, useEffect } from 'react';

export function Menu(props) {
    const [previousMenu, setPreviousMenu] = useState(null);

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleValueChange = (menu) => {
        setPreviousMenu(props.menu);
        props.handleValueChange(menu);
        const stateObj = { menu };
        window.history.pushState(stateObj, '', `#${menu}`);
    };

    const handlePopState = (event) => {
        const menu = event.state ? event.state.menu : null;
        setPreviousMenu(props.menu);
        props.handleValueChange(menu);
    };

    return (
        <nav className="menu">
            <div className="menu-item" onClick={() => handleValueChange('notebooks')}>
                Notebooks
            </div>
            <div className="menu-item" onClick={() => handleValueChange('audio')}>
                Voice records
            </div>
            <div className="menu-item" onClick={() => handleValueChange('todo')}>
                To do
            </div>
            <div
                className="menu-item delete-everything"
                onClick={() => {
                    let text = `Do you want to delete every notebook?\nIf yes press OK, otherwise press Cancel.`;
                    if (confirm(text) === true) {
                        deleteDB();
                        localStorage.setItem('notebook', '');
                    }
                }}
            >
                Delete all notebooks
                <svg className="trash-icon" viewBox="0 0 20 18">
                    <path
                        d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
                    ></path>
                </svg>
            </div>
        </nav>
    );
}
