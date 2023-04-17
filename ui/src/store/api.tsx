// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials } from "../features/userSlice";

export interface ShoppingListItem {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface NewListItemRequest {
  name: string;
  listId: string;
}

export interface ShoppingList {
  id: string;
  ownerId: string | null;
  ownerName: string;
  name: string;
  items: ShoppingListItem[];
  sharingIds: string[];
  sharingInviteIds: string[];
  sharingNames: string[];
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

export interface ShareRequest {
  listId: string;
  userName: string;
}

export interface RespondToShareInviteRequest {
  listId: string;
  isAccepting: boolean;
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

    addLists: builder.mutation<void, ShoppingList[]>({
      query(body) {
        return {
          url: `lists/bulk`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),

    ShareList: builder.mutation<void, ShareRequest>({
      query(body) {
        return {
          url: `share-lists/create`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),

    RespondToShareInvite: builder.mutation<void, RespondToShareInviteRequest>({
      query(body) {
        return {
          url: `share-lists/respond`,
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

    checkoutList: builder.mutation<void, string>({
      query(id) {
        return {
          url: `lists/checkout/${id}`,
          method: "POST",
        };
      },
      invalidatesTags: ["ShoppingList"],
    }),

    getAllShareInviteLists: builder.query<ShoppingList[], void>({
      query: () => "share-lists",
      providesTags: ["ShoppingList"],
    }),

    addListItem: builder.mutation<void, NewListItemRequest>({
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
  useAddListsMutation,
  useShareListMutation,
  useRespondToShareInviteMutation,
  useCheckoutListMutation,
  useGetAllListsQuery,
  useGetAllShareInviteListsQuery,
  useAddListItemMutation,
  useModifyListItemMutation,
  useDeleteListMutation,
  useDeleteListItemMutation,
  useAddUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = api;
