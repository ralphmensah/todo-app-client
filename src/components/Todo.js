import React, { useState, useEffect } from 'react';
import {MdDeleteForever} from 'react-icons/md'
import   axios  from 'axios';
import './Todo.css';

const baseUrl = 'http://localhost:8080/msg'

function Task({ msg ,index, done, completeTask, removeTask }) {
    return (
        <div
            className="task"
            style={{ textDecoration: done ? "line-through" : "" }}
        >
            {msg}
            <span onClick={() => removeTask(index)}><MdDeleteForever/></span>
            <button style={{background: done ? "red": "green"}} onClick={() => completeTask(index)}>{ done ? "Incomplete": "Completed"}</button>
        </div>
    );
}
function Todo() {
    const [TodosRemaining, setTodosRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [Todos, setTodos] = useState([]);

    const fetchData = async ()=>{
        setLoading(true);
        try{
            const {data : response} = await axios.get(baseUrl+'/getAll');
            setTodos(response);
        }catch(error){
            console.error(error.message);
        }
        setLoading(false);
    }

    useEffect(()=>{
        const getAllTodos = async()=>{
            const allTodos = await fetchData();
            if(allTodos)setTodos(allTodos);
        }
        getAllTodos()
    },[]);
      
    // console.log(Todos)
    useEffect(() => { 
      setTodosRemaining(Todos.filter(task => !task.done).length) 
    },[Todos]);

    const addTask = async (title) => {
        const newMsg = {msg: title}
        const response  = await axios.post(baseUrl+'/add',newMsg);
        setTodos([...Todos,response.data])
    };
    
    const completeTask = async (index) => {
        const newTodos = [...Todos];
        let isDone = !newTodos[index].done;  
        const msgUpdate = {
            msg: newTodos[index].msg,
            done: isDone
        }
        await axios.put(baseUrl+'/update/'+ newTodos[index].id, msgUpdate); 
        Todos.filter((todo)=>{
            return todo.id ===newTodos[index].id ? todo.done = isDone : !isDone
        })
        setTodos([...Todos])
        
       
    };
    const updateTask = index =>{
        const newUpdateTodos = [...Todos];
        const msgUpdate = {
            msg: "", //get from input,
            done: false
        }
        axios.put(baseUrl+'/update/'+ newUpdateTodos[index].id, msgUpdate)
        .then( setTodos(newUpdateTodos))
    }
    
    const removeTask = async (index) => {
        await axios.delete(`${baseUrl}/delete/${Todos[index].id}`)
        const newTodoList = Todos.filter((todo)=>{
            return todo.id !== Todos[index].id;
        })
        setTodos(newTodoList)
    };

    return (
        <div className="todo-container">
            <div className="header">Pending ToDos ({TodosRemaining})</div>
            <div className="Todos">
                {Todos.map((task, index) => (
                    <Task
                    msg={task.msg}
                    index = {index}
                    completeTask={completeTask}
                    removeTask={removeTask}
                    done={task.done}
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