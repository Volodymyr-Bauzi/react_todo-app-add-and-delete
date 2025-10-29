import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Todo } from '../types/Todo';
import { StatusFilter } from '../types/statusFilter';
import { ErrorMessage } from '../types/error';
import { server, USER_ID } from '../api/todos';
import useErrors from './useErrors';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const [todosToDelete, setTodosToDelete] = useState<Todo[] | null>(null);

  const {
    errorMessage,
    showErrorNotification,
    showError,
    hideError,
    setErrorMessage,
  } = useErrors();

  const addInputRef = useRef<HTMLInputElement>(null);

  // Load todos from server on mount
  useEffect(() => {
    setErrorMessage(ErrorMessage.Null);

    server
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LoadingTodos));
  }, [setErrorMessage, showError]);

  useEffect(() => {
    if (!tempTodo) {
      addInputRef.current?.focus();
    }
  }, [tempTodo]);

  // ✅ Corrected and optimized filtering logic
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (status === StatusFilter.Completed) {
        return todo.completed;
      }

      if (status === StatusFilter.Active) {
        return !todo.completed;
      }

      return true; // explicit boolean for StatusFilter.All
    });
  }, [todos, status]);

  const todosLeft = todos.filter(todo => !todo.completed).length;

  // Handle new todo submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    // Temporary optimistic todo
    setTempTodo({
      title: normalizedQuery,
      completed: false,
      id: 0,
      userId: USER_ID,
    });

    server
      .createTodo({ title: normalizedQuery })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setQuery('');
      })
      .catch(() => showError(ErrorMessage.AddingTodo))
      .finally(() => {
        setTempTodo(null);
      });
  };

  // Handle deleting a todo
  const handleDelete = (todoId: Todo['id']) => {
    const foundTodo = todos.find(todo => todo.id === todoId);

    if (!foundTodo) {
      return;
    }

    setTempTodo(foundTodo);

    server
      .deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => showError(ErrorMessage.DeletingTodo))
      .finally(() => setTempTodo(null));
  };

  // Handle input query changes
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle filter status (All, Active, Completed)
  const handleStatusChange = (newStatus: StatusFilter) => {
    setStatus(newStatus);
  };

  const handleDeleteAllCompleted = () => {
    const toDelete = todos.filter(todo => {
      return todo.completed;
    });

    const idxs = toDelete.map(todo => todo.id);

    setTodosToDelete(toDelete);

    idxs.forEach(todo => handleDelete(todo));
  };

  return {
    todos,
    query,
    status,
    tempTodo,
    todosLeft,
    addInputRef,
    errorMessage,
    filteredTodos,
    todosToDelete,
    showErrorNotification,
    handleDeleteAllCompleted,
    hideError,
    handleSubmit,
    handleDelete,
    handleQueryChange,
    handleStatusChange,
  };
};

export default useTodos;
