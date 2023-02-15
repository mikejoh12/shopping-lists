// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
  id?: number;
  name: string;
}

type TodosResponse = Todo[];

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getAllTodos: builder.query<TodosResponse, void>({
      query: () => "todos",
      providesTags: ["Todo"],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query(body) {
        return {
          url: `todos`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation<
      { success: boolean; id: number },
      number | undefined
    >({
      query(id) {
        return {
          url: `todos/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Todo"],
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
} = api;
