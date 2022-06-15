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

  // Interact with local storage

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('todo'));
    if (items) {
     setItems(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todo', JSON.stringify(items));
  }, [items]);

  const [filterType, setFilterType] = useState("all");

  const [itemSearch, setItemSearch] = useState("");

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };

  const handleAddItem = () => {
    const newItem = { key: myNewID(), label: itemToDo };

    // state call back
    setItems((prevItem) => [newItem, ...prevItem]);

    setItemToDo("");
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleItemDelete = ({ key }) => {
    const index = items.findIndex((item) => item.key === key);

    const leftSide = items.slice(0, index);
    const rightSide = items.slice(index + 1, items.length);

    setItems((prevItem) => [...leftSide, ...rightSide]);
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
  };

  const moreToDo = items.filter((item) => !item.done).length;
  const doneToDo = items.length - moreToDo;

  const filteredArray =
    filterType === "all"
      ? items
      : filterType === "done"
      ? items.filter((item) => item.done)
      : filterType === "search"
      ? search()
      : items.filter((item) => !item.done);

  const handleItemSearch = (event) => {
    setItemSearch(event.target.value);
    setFilterType("search");
  };

  function search() {
    const keyword = itemSearch.toLowerCase();
    let searchedArray = [];
    if (keyword != "") {
      searchedArray = items.filter((item) => {
        return item.label.toLowerCase().includes(keyword);
      });
    }

    return searchedArray;
  }

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
