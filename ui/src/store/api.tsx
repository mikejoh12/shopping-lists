// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "../features/user/userSlice";

export interface ListItem {
  id?: number;
  name: string;
  listId: string | null;
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

export interface UserResponse {
  username: string;
}

export interface RegisterUserRequest {
  username: string;
  password: string;
}

export interface ShoppingList {
  name: string;
}

const baseQuery = fetchBaseQuery({ baseUrl: "/api" });
const baseQueryWithLogout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);
  if (result.error && result.error.status === 401) {
    api.dispatch(setCredentials(null));
    alert("You have been logged out");
  }
  return result;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "shoppingListApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["ShoppingList", "User"],
  endpoints: (builder) => ({
    addList: builder.mutation<ShoppingList, Partial<ShoppingList>>({
      query(body) {
        return {
          url: `lists`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),
    getAllListItems: builder.query<ShoppingList[], void>({
      query: () => "lists/items",
      providesTags: ["ShoppingList"],
    }),
    addListItem: builder.mutation<ListItem, Partial<ListItem>>({
      query(body) {
        return {
          url: `lists/items`,
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
    loginUser: builder.mutation<UserResponse, LoginRequest>({
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
  useAddListMutation,
  useGetAllListItemsQuery,
  useAddListItemMutation,
  useDeleteListItemMutation,
  useAddUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = api;
