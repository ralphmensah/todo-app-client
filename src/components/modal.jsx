import React, {useEffect, useState} from "react";
import {CSSTransition} from 'react-transition-group'
import  ReactDOM  from "react-dom";
import "./modal.css";

const Modal = (props) => {
	
	const closeOnEscapeKey = (e) => {
		if ((e.charCode || e.keyCode) === 27) {
			props.onClose();
		}
	};

    useEffect(() => {
      document.body.addEventListener('keydown', closeOnEscapeKey)
    
      return () => {
        document.body.removeEventListener('keydown', closeOnEscapeKey)
      }
    })
    
	return ReactDOM.createPortal(
		<CSSTransition in={props.show} unmountOnExit timeout={{enter: 0, exit:300}}>
            <div className="modal" onClick={props.onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h4 className="modal-title">Create Task</h4>
				</div>
				<div className="modal-body">
                    <CreateTask addTask={props.addTask}/>
                </div>

				<div className="modal-footer">
					<button className="btn btn-outline-danger" onClick={props.onClose}>
						Close
					</button>
				</div>
			</div>
            </div>
		</CSSTransition>,
        document.getElementById('root')
	)
};

function CreateTask(props) {
	const [value, setValue] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!value) return;

		props.addTask(value);
		setValue("");
	};

	return (
		<form onSubmit={handleSubmit} className="inputBox">
			<div className="input-group ">
				<input
					type="text"
					className="form-control"
					value={value}
					placeholder="Add a new task"
					onChange={(e) => setValue(e.target.value)}
				/>
				<div className="input-group-append">
					<button className="btn btn-outline-success" type="submit">
						Add Task
					</button>
				</div>
			</div>
		</form>
	);
}

export default Modal;
