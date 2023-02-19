// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
  id?: number;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

type TodosResponse = Todo[];

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Todo", "User"],
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
    addUser: builder.mutation<LoginRequest, Partial<LoginRequest>>({
      query(body) {
        return {
          url: `auth/register`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation<LoginRequest, Partial<LoginRequest>>({
      query(body) {
        return {
          url: `auth/login`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useAddUserMutation,
  useLoginUserMutation
} = api;
