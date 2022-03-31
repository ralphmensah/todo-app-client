import React, { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import "./Todo.css";
import Modal from "./modal";

const baseUrl = "http://localhost:8080/msg";

function Task({ msg, index, done, date, completeTask, removeTask }) {

	const formatDate = (date) => {
		const formatedDate = new Date(date);

		return `${formatedDate.getDate()}/${formatedDate.getMonth() + 1}/ ${
			formatedDate.getFullYear()
		}`;
	};

	return (
		<div className="list-group-item d-flex align-items-center justify-content-between todo btn btn-outline-secondary">
			<input
				type="checkbox"
				className=""
				onClick={() => completeTask(index)}
				defaultChecked={done}
			/>

			<div
				style={{
					textDecoration: done ? "line-through" : "",
				}}
				className="font shift"
			>
				{msg}
				
			</div>
			{/* TODO: format date */}
			<small className="font-weight-light">{formatDate(date)}</small>
			<span onClick={() => removeTask(index)} className="">
				<MdDeleteForever size={20} color="red" />
			</span>
		</div>
	);
}

function Todo() {
	const [TodosRemaining, setTodosRemaining] = useState(0);
	const [loading, setLoading] = useState(true);
	const [Todos, setTodos] = useState([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const { data: response } = await axios.get(baseUrl + "/getAll");
			setTodos(response);
		} catch (error) {
			console.error(error.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		const getAllTodos = async () => {
			const allTodos = await fetchData();
			if (allTodos) setTodos(allTodos);
		};
		getAllTodos();
	}, []);

	// console.log(Todos)
	useEffect(() => {
		setTodosRemaining(Todos.filter((task) => !task.done).length);
	}, [Todos]);

	const addTask = async (title) => {
		const newMsg = { msg: title };
		const response = await axios.post(baseUrl + "/add", newMsg);
		setTodos([...Todos, response.data]);
	};

	const completeTask = async (index) => {
		const newTodos = [...Todos];
		let isDone = !newTodos[index].done;
		const msgUpdate = {
			msg: newTodos[index].msg,
			done: isDone,
		};
		await axios.put(baseUrl + "/update/" + newTodos[index].id, msgUpdate);
		Todos.filter((todo) => {
			return todo.id === newTodos[index].id
				? (todo.done = isDone)
				: !isDone;
		});
		setTodos([...Todos]);
	};
	const updateTask = (index) => {
		const newUpdateTodos = [...Todos];
		const msgUpdate = {
			msg: "", //get from input,
			done: false,
		};
		axios
			.put(baseUrl + "/update/" + newUpdateTodos[index].id, msgUpdate)
			.then(setTodos(newUpdateTodos));
	};

	const removeTask = async (index) => {
		await axios.delete(`${baseUrl}/delete/${Todos[index].id}`);
		const newTodoList = Todos.filter((todo) => {
			return todo.id !== Todos[index].id;
		});
		setTodos(newTodoList);
	};
	return (
		<section className="section m-mt-4 m-4">
			<div className="card mx-auto" style={{ width: "50%" }}>
				<div className="card-header  d-flex align-items-center justify-content-between">
					<h4>
						Pending Tasks
						<span className="">({TodosRemaining})</span>
					</h4>
					<AddTaskButton addTask={addTask} />
				</div>

				<div className="list-group" style={{ borderBottom: "none" }}>
					{Todos.length === 0 ? (
						<h1>Nothing to show</h1>
					) : (
						Todos.map((task, index) => (
							<div key={index}>
								<Task
									msg={task.msg}
									index={index}
									date={task.date_created}
									completeTask={completeTask}
									removeTask={removeTask}
									done={task.done}
								/>
							</div>
						))
					)}
				</div>
			</div>
		</section>
	);
}

const AddTaskButton = (props) => {
	const [show, setShow] = useState(false);
	return (
		<div>
			<button
				type="button"
				className=" btn btn-outline-primary addTask"
				onClick={() => setShow(true)}
			>
				Create Task
			</button>
			<Modal
				addTask={props.addTask}
				onClose={() => setShow(false)}
				show={show}
			/>
		</div>
	);
};

export default Todo;
