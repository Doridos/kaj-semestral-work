import React, {useEffect, useState} from 'react';
import './todo.css';

export function Todo() {
    useEffect(() => {
        function fetchData() {
            const username = localStorage.getItem('user');
            const r = indexedDB.open(username);

            r.onsuccess = function (e) {
                const db = e.target.result;
                const t = db.transaction(["notebookNames"], "readonly");
                const objectStore = t.objectStore("notebookNames");
                const request = objectStore.get('todo-1-items');

                request.onsuccess = function (e) {
                    if(e.target.result){
                        const record = e.target.result.todos;
                        let notCompleted = record.filter(t => t.completed === false)
                        let completed = record.filter(t => t.completed === true)
                        setTodos(notCompleted);
                        setCompletedTodos(completed)
                    }

                };
            };
        }

        fetchData();

        // Cleanup function
        return () => {
            // Perform any necessary cleanup here
        };
    }, []);
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);

    const handleInputChange = (event) => {
        setNewTodo(event.target.value);
    };

    const handleAddTodo = (event) => {
        event.preventDefault();
        if (newTodo.trim() === '') return;
        const todo = { text: newTodo, completed: false };
        setTodos([todo, ...todos]);
        setNewTodo('');
        const r = indexedDB.open(localStorage.getItem('user'));
        r.onsuccess = function (e) {
            let db = e.target.result;
            let t = db.transaction(["notebookNames"], "readwrite"); // Use "readonly" mode for the transaction
            let objectStore = t.objectStore("notebookNames");
            let request = objectStore.get('todo-1-items'); // Get the record by the username
            request.onsuccess = function (e) {
                let record = e.target.result;
                console.log(record)
                if (!record) {
                    console.log("doesnt")
                    let t = db.transaction(["notebookNames"], "readwrite");
                    let objectStore = t.objectStore("notebookNames");
                    objectStore.add({
                        name: 'todo-1-items',
                        todos: [todo]
                    });
                }
                else {
                    record.todos = [todo, ...record.todos]
                    const updateRequest = t.objectStore("notebookNames").put(record);

                    updateRequest.onsuccess = function(event) {
                        console.log('Record updated successfully');
                    };

                    updateRequest.onerror = function(event) {
                        console.log('Error updating record: ' + event.target.error);
                    };
                }
            };
        };
    };

    const handleTodoClick = (index) => {
        const clickedTodo = showCompleted ? completedTodos[index] : todos[index];
        clickedTodo.completed = !clickedTodo.completed;

        if (clickedTodo.completed) {
            if (showCompleted) {
                setCompletedTodos((prevCompletedTodos) =>
                    prevCompletedTodos.filter((todo) => todo !== clickedTodo)
                );
                setTodos((prevTodos) => [clickedTodo, ...prevTodos]);
            } else {
                setCompletedTodos((prevCompletedTodos) => [clickedTodo, ...prevCompletedTodos]);
                setTodos((prevTodos) => prevTodos.filter((todo) => todo !== clickedTodo));
            }
        } else {
            if (showCompleted) {
                setCompletedTodos((prevCompletedTodos) =>
                    prevCompletedTodos.filter((todo) => todo !== clickedTodo)
                );
                setTodos((prevTodos) => [clickedTodo, ...prevTodos]);
            } else {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo !== clickedTodo));
                setCompletedTodos((prevCompletedTodos) => [clickedTodo, ...prevCompletedTodos]);
            }
        }
        const r = indexedDB.open(localStorage.getItem('user'));
        r.onsuccess = function (e) {
            let db = e.target.result;
            let t = db.transaction(["notebookNames"], "readwrite"); // Use "readonly" mode for the transaction
            let objectStore = t.objectStore("notebookNames");
            let request = objectStore.get('todo-1-items'); // Get the record by the username
            request.onsuccess = function (e) {
                let record = e.target.result;
                record.todos = todos.concat(completedTodos)
                const updateRequest = t.objectStore("notebookNames").put(record);

                updateRequest.onsuccess = function (event) {
                    console.log('Record updated successfully');
                };

                updateRequest.onerror = function (event) {
                    console.log('Error updating record: ' + event.target.error);
                };
            }
        }
    };

    const handleDeleteCompleted = (index) => {
        if(index === -1){
            setCompletedTodos( [])
            const r = indexedDB.open(localStorage.getItem('user'));
            r.onsuccess = function (e) {
                let db = e.target.result;
                let t = db.transaction(["notebookNames"], "readwrite"); // Use "readonly" mode for the transaction
                let objectStore = t.objectStore("notebookNames");
                let request = objectStore.get('todo-1-items'); // Get the record by the username
                request.onsuccess = function (e) {
                    let record = e.target.result;
                    record.todos = todos
                    const updateRequest = t.objectStore("notebookNames").put(record);


                    updateRequest.onerror = function (event) {
                        console.log('Error updating record: ' + event.target.error);
                    };
                }
            }
        }
        else {
            const updatedCompletedTodos = [...completedTodos];
            updatedCompletedTodos.splice(index, 1);
            setCompletedTodos(updatedCompletedTodos);
            const r = indexedDB.open(localStorage.getItem('user'));
            r.onsuccess = function (e) {
                let db = e.target.result;
                let t = db.transaction(["notebookNames"], "readwrite"); // Use "readonly" mode for the transaction
                let objectStore = t.objectStore("notebookNames");
                let request = objectStore.get('todo-1-items'); // Get the record by the username
                request.onsuccess = function (e) {
                    let record = e.target.result;
                    record.todos = todos.concat(updatedCompletedTodos)
                    const updateRequest = t.objectStore("notebookNames").put(record);


                    updateRequest.onerror = function (event) {
                        console.log('Error updating record: ' + event.target.error);
                    };
                }
            }
        }

    };

    const handleSwitchChange = () => {
        setShowCompleted(!showCompleted);
    };

    const activeTodos = showCompleted ? completedTodos : todos;

    return (
        <section className="page">
            <div className="todo-container">
                <h1>What's your plan for today?</h1>
                <div className="btn-container">
                    <div className="switch btn-color-mode-switch">
                        <input type="checkbox" name="color_mode" id="color_mode" checked={showCompleted} onChange={handleSwitchChange}/>
                        <label htmlFor="color_mode" data-on="Completed" data-off="Planned"
                               className="btn-color-mode-switch-inner"></label>
                    </div>
                </div>

                {!showCompleted && (
                    <form onSubmit={handleAddTodo}>
                        <input
                            type="text"
                            placeholder="Enter a new todo"
                            value={newTodo}
                            autoFocus
                            onChange={handleInputChange}
                        />
                    </form>
                )}

                <div className="todo-list">
                    {activeTodos.map((todo, index) => (
                        <TodoItem
                            key={index}
                            todo={todo}
                            handleClick={() => handleTodoClick(index)}
                            handleDelete={() => handleDeleteCompleted(index)}
                        />
                    ))}
                </div>

                {showCompleted && completedTodos.length > 0 && (
                    <button className="delete-completed-button" onClick={ e => handleDeleteCompleted(-1)}>
                        Delete Completed
                    </button>
                )}
            </div>
        </section>
    );
}

function TodoItem({ todo, handleClick, handleDelete }) {
    const handleDeleteClick = (event) => {
        event.stopPropagation(); // Stop event propagation
        handleDelete();
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`} onClick={handleClick}>
            <span className="todo-text">{todo.text}</span>
            {todo.completed && (
                <span className="todo-icon">
                    ✓
                    <button className="delete-todo" onClick={handleDeleteClick}><svg className="trash-icon" viewBox="0 0 20 18">
            <path
                d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
        </svg></button>
                </span>
            )}
        </div>
    );
}
