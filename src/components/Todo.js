import React, { useState, useEffect } from 'react';
import {MdDeleteForever} from 'react-icons/md'
import   axios  from 'axios';
import './Todo.css';

const baseUrl = 'http://localhost:8080/msg'

function Task({ task, index, completeTask, removeTask }) {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            {task.msg}
            <span onClick={() => removeTask(task.id)}><MdDeleteForever/></span>
            <button onClick={() => completeTask(index)}>Complete</button>
        </div>
    );
}
function Todo() {
    const [tasksRemaining, setTasksRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            setLoading(true);
            try{
                const {data : response} = await axios.get(baseUrl+'/getAll');
                console.log(response)
                setTasks(response);
            }catch(error){
                console.error(error.message);
            }
            setLoading(false);
        }
        fetchData()
    },[]);
      
    useEffect(() => { 
      setTasksRemaining(tasks.filter(task => !task.completed).length) 
    },[tasks]);

    const addTask = title => {
        const newMsg = {msg: title}
        // console.log(newMsg)
        axios.post(baseUrl+'/add',newMsg)
        .then((res)=>{
            console.log(res)
            tasks.push(res.data) 
            setTasks({title : tasks.data})
        })
    };
    
    const completeTask = index => {

        const newTasks = [...tasks];
        newTasks[index].completed = true;
        setTasks(newTasks);
    };
    
    const removeTask = index => {
        axios.delete(baseUrl+"/delete/"+index)
        .then(setTasks(tasks))
        
    };

    return (
        <div className="todo-container">
            <div className="header">Pending ToDos ({tasksRemaining})</div>
            <div className="tasks">
                {tasks.map((task, index) => (
                    <Task
                    task={task}
                    index={index}
                    completeTask={completeTask}
                    removeTask={removeTask}
                    key={index}
                    />
                ))}
            </div>
            <div className="create-task" >
                <CreateTask addTask={addTask} />
            </div>
        </div>
    );
}

function CreateTask({ addTask }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        
        addTask(value);
        setValue("");
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add a new task"
                onChange={e => setValue(e.target.value)}
            />
            <button type='submit'>Add Task</button>
        </form>
    );
}
export default Todo;