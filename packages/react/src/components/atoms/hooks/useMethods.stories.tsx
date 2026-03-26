import type { Meta, StoryObj } from "@storybook/react";

import { constant } from "lodash-es";

import useMethods from "../../../hooks/useMethods.js";

function UseMethodsDemo() {
  const [count, { decrement, increment, reset }] = useMethods(
    (state: number) => ({
      decrement: () => state - 1,
      increment: () => state + 1,
      reset: constant(0),
    }),
    0,
  );

  return (
    <div>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={decrement} type="button">
          Decrement
        </button>
        <button onClick={increment} type="button">
          Increment
        </button>
        <button onClick={reset} type="button">
          Reset
        </button>
      </div>
    </div>
  );
}

const metadata: Meta = {
  component: UseMethodsDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Type-safe alternative to `useReducer` that uses named methods instead of action types. Returns a `[state, methods]` tuple.",
      },
    },
  },
  title: "Hooks/useMethods",
};

export default metadata;

type Story = StoryObj;

export const Counter: Story = {
  render: () => <UseMethodsDemo />,
};

function TodoDemo() {
  const [todos, { add, remove }] = useMethods(
    (state: string[]) => ({
      add: (item: string) => [...state, item],
      remove: (index: number) => state.filter((_, index_) => index_ !== index),
    }),
    ["Buy groceries", "Read a book"],
  );

  return (
    <div>
      <ul>
        {todos.map((todo, index) => (
          <li key={todo}>
            {todo}{" "}
            <button onClick={() => remove(index)} type="button">
              ×
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => add(`Task ${todos.length + 1}`)} type="button">
        Add Task
      </button>
    </div>
  );
}

export const TodoList: Story = {
  render: () => <TodoDemo />,
};
