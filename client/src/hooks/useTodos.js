import { useState, useEffect } from 'react';
import * as api from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    api.getTodos().then(response => setTodos(response.data));
  }, []);

  const addTodo = async (title) => {
    const response = await api.createTodo(title);
    setTodos([...todos, response.data]);
  };

  const toggleTodo = async (id, completed) => {
    const response = await api.updateTodo(id, { completed: !completed });
    setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
  };

  const removeTodo = async (id) => {
    await api.deleteTodo(id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, removeTodo };
};