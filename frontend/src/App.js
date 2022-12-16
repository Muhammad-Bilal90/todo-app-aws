import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const todoVal = useRef();

  useEffect(() => {
    function getData() {
      setLoading(true);
      const response = fetch(
        `https://df6m6s9tnj.execute-api.us-west-2.amazonaws.com/prod/todo`
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setTodos(res);
          setLoading(false);
        })
        .catch((err) => console.log(err));

      return response;
    }

    getData();
  }, []);


  const createTHandler = (e) => {
    e.preventDefault();
    console.log(todoVal.current.value);
    const response = fetch(`https://df6m6s9tnj.execute-api.us-west-2.amazonaws.com/prod/todo`,
    {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: todoVal.current.value}),
    })
    .then(res => res.json())
    .then( res => {
      console.log(res)
      setTodos([...todos, res])
      console.log(todos)
      todoVal.current.value = "";
    })
    .catch(err => console.log(err));
  }


  const updateHandler = (id) => {
    let newVal = prompt("Enter new value...", "");
    let indexVal = todos.findIndex(todo => todo.id === id);
    const response = fetch(`https://df6m6s9tnj.execute-api.us-west-2.amazonaws.com/prod/todo?id=${id}`,
    {
      method: "PUT",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newVal}),
    })
    .then(res => res.json())
    .then(res => {
      let arrayInstance = todos.slice(0);
      arrayInstance.splice(indexVal, 1, res);
      console.log(arrayInstance);
      setTodos(arrayInstance);
    })
    .catch(err => console.log(err));

  }


  const deleteHandler = (id) => {
    const response = fetch(`https://df6m6s9tnj.execute-api.us-west-2.amazonaws.com/prod/todo?id=${id}`,
    {
      method: "DELETE"
    })
    .then(() => {
      setTodos(todos.filter(todo => todo.id !== id))
    })
    .catch(err => console.logg(err));
  }


  return (
    <div className="App">
      <h1>Todo App</h1>
        <form onSubmit={createTHandler}>
          <input type="text" ref={todoVal} required/>
          <button className="addButton" type="submit">Add</button>
        </form>
      <ul>
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          todos &&
          todos.map((todo) => {
            return (
              <li key={todo.id} className="list">
                <span className="left">
                  {todo.name}
                </span>
                <span className="right">
                  <button className="green" onClick={ () => { updateHandler(todo.id) }}>Edit</button>
                  <button className="red" onClick={() => { deleteHandler(todo.id) }}>Delete</button>
                </span>  
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default App;
