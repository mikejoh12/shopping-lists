// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ListItem {
  id?: number;
  name: string;
}

export interface ShoppingList {
  id?: number;
  ownerId: number;
  name: string;
  items: ListItem[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  password: string;
}

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "shoppingListApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ShoppingList", "User"],
  endpoints: (builder) => ({
    getAllTodos: builder.query<ShoppingList, void>({
      query: () => "lists",
      providesTags: ["ShoppingList"],
    }),
    addListItem: builder.mutation<ListItem, Partial<ListItem>>({
      query(body) {
        return {
          url: `lists`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),
    deleteListItem: builder.mutation<
      { success: boolean; id: number },
      number | undefined
    >({
      query(id) {
        return {
          url: `lists/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),
    addUser: builder.mutation<
      RegisterUserRequest,
      Partial<RegisterUserRequest>
    >({
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
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: `auth/logout`,
          method: "POST",
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
  useAddListItemMutation,
  useDeleteListItemMutation,
  useAddUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = api;
