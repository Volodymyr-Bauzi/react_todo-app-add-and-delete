import { Todo } from '../../types/Todo';
import { TodoItem, TodoItemProps } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
} & Pick<TodoItemProps, 'tempTodo' | 'onDelete' | 'todosToDelete'>;

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  todosToDelete,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            tempTodo={tempTodo}
            onDelete={onDelete}
            todosToDelete={todosToDelete}
          />
        ))}
        {tempTodo && tempTodo.id === 0 && (
          <TodoItem todo={tempTodo} tempTodo={tempTodo} />
        )}
      </div>
    </section>
  );
};
