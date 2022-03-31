import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import Todo from "./components/Todo";

ReactDOM.render(
	<React.StrictMode>
		<Todo />
	</React.StrictMode>,
	document.getElementById("root")
);
