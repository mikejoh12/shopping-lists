// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "../features/userSlice";

export interface ShoppingListItem {
  id?: string;
  name: string;
  listId: string | null;
  isCompleted: boolean;
}

export interface ShoppingList {
  id?: string;
  ownerId: number;
  name: string;
  items: ShoppingListItem[];
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
  if (result.error && result.error.status === 401) {
    api.dispatch(setCredentials(null));
    alert("You have been logged out");
  }
  return result;
};

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

    getAllLists: builder.query<ShoppingList[], void>({
      query: () => "lists",
      providesTags: ["ShoppingList"],
    }),

    deleteList: builder.mutation<
      { success: boolean; id: number },
      string | undefined
    >({
      query(id) {
        return {
          url: `lists/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),

    addListItem: builder.mutation<ShoppingListItem, Partial<ShoppingListItem>>({
      query(body) {
        return {
          url: `lists/items`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),

    modifyListItem: builder.mutation<ShoppingListItem, ShoppingListItem>({
      query(body) {
        return {
          url: `lists/items/${body.id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),

    deleteListItem: builder.mutation<
      { success: boolean; id: number },
      string | undefined
    >({
      query(id) {
        return {
          url: `lists/items/${id}`,
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

export const {
  useAddListMutation,
  useGetAllListsQuery,
  useAddListItemMutation,
  useModifyListItemMutation,
  useDeleteListMutation,
  useDeleteListItemMutation,
  useAddUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = api;
