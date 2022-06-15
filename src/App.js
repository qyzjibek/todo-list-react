import { useState, useEffect } from "react";
import { v4 as myNewID } from "uuid";

import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  const [itemToDo, setItemToDo] = useState("");

  const [items, setItems] = useState([]);

  const [filterType, setFilterType] = useState("all");

  const [itemSearch, setItemSearch] = useState("");

  const [isChanged,setChanged] = useState(false);

  // Interact with local storage

  useEffect(() => {
    const itemsNew = JSON.parse(localStorage.getItem('todo'));
    if (itemsNew) {
     setItems(itemsNew);
    }
  }, []);

  useEffect(() => {
    if(isChanged){
      localStorage.setItem('todo', JSON.stringify(items));
      setChanged(false);
    }
  }, [isChanged, items]);

  // Event Handlers

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };

  const handleAddItem = () => {
    if(itemToDo !== "") {
      const newItem = { key: myNewID(), label: itemToDo };

      // state call back
      setItems((prevItem) => [newItem, ...prevItem]);

      setChanged(true);
      setItemToDo("");
    }
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );

    setChanged(true);
  };

  const handleItemDelete = ({ key }) => {
    const index = items.findIndex((item) => item.key === key);

    const leftSide = items.slice(0, index);
    const rightSide = items.slice(index + 1, items.length);

    setItems((prevItem) => [...leftSide, ...rightSide]);

    setChanged(true);
  };

  const handleFilterChange = ({ type }) => {
    setFilterType(type);
  };

  const handleItemImportant = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );

    setChanged(true);
  };

  const handleItemSearch = (event) => {
    setItemSearch(event.target.value);
  };

  // Variables

  const moreToDo = items.filter((item) => !item.done).length;
  const doneToDo = items.length - moreToDo;

  // items either full either filtered
  const searchedArray = items.filter((item) => item.label.toLowerCase().includes(itemSearch.toLowerCase()));
  const filteredArray =
        filterType === "all"
      ? searchedArray
      : filterType === "done"
      ? searchedArray.filter((item) => item.done)
      : searchedArray.filter((item) => !item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {moreToDo} more to do, {doneToDo} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          value={itemSearch}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleItemSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`btn btn-info ${
                filterType === item.type ? "" : "btn-outline-info"
              }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.length > 0 &&
          filteredArray.map((item) => (
            <li
              key={item.key}
              className={`list-group-item ${item.important ? "active" : ""}`}
            >
              <span className={`todo-list-item ${item.done ? "done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => handleItemImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
