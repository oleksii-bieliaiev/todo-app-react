import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  todos,
  setTodos,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);
  const editingTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodo.current) {
      editingTodo.current.focus();
    }
  }, [isEditing]);

  const removeTodo = (todoId: number) => {
    setTodos(todos.filter(currentTodo => currentTodo.id !== todoId));
  };

  const updateTodoTitle = (newTitle: string, todoId: number) => {
    setTodos(todos.map(currentTodo => {
      if (currentTodo.id === todoId) {
        return {
          ...currentTodo,
          title: newTitle,
        };
      }

      return currentTodo;
    }));
  };

  const submitChangedTitle = (event: React.FormEvent) => {
    event.preventDefault();
    if (changedTitle !== title) {
      updateTodoTitle(changedTitle, id);
      setIsEditing(false);
    }

    if (!changedTitle.length) {
      removeTodo(id);
    }

    setIsEditing(false);
  };

  const responseToKeys = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      updateTodoTitle(changedTitle, id);
      setIsEditing(false);
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setChangedTitle(title);
    }
  };

  const tickTodo = () => {
    setTodos(todos.map(currentTodo => {
      if (currentTodo.id === id) {
        return {
          ...currentTodo,
          completed: !currentTodo.completed,
        };
      }

      return currentTodo;
    }));
  };

  return (
    <li
      className={classNames(
        { editing: isEditing },
        { completed },
      )}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          id="toggle-view"
          onClick={tickTodo}
          checked={completed}
        />
        <label
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </label>
        <button
          type="button"
          aria-label="delete-button"
          className="destroy"
          data-cy="deleteTodo"
          onClick={() => removeTodo(id)}
        />
      </div>
      <form
        onSubmit={submitChangedTitle}
      >
        <input
          type="text"
          className="edit"
          ref={editingTodo}
          value={changedTitle}
          onChange={(event) => setChangedTitle(event.target.value)}
          onKeyDown={responseToKeys}
          onBlur={submitChangedTitle}
        />
      </form>
    </li>
  );
};
