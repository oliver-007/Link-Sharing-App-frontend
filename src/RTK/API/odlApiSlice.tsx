import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  addUserData,
  removeUserData,
  setAuthenticated,
  setUnAuthenticated,
} from "../slices/userSlice";
import { setMessage } from "../slices/respMessageSlice";
import { addLinks } from "../slices/linkSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryWithRefresh = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    // Try to get a new access token with refresh token
    const refreshResult = await baseQuery(
      {
        url: "/api/user/refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // on refresh success, retrying the original query
      api.dispatch(setAuthenticated());

      // --------- IMPORTANT TO KEEP IN MIND ------------
      // initiate is a method provided by RTK Query that programmatically initiates a request to an endpoint, even outside of React components. It’s helpful in scenarios where you need to fetch data manually after a particular condition is met, such as after refreshing an access token.
      await api.dispatch(odlApiSlice.endpoints.getLoggedInUser.initiate({}));

      result = await baseQuery(args, api, extraOptions);
    } else {
      // on refresh failure, calling logout endpoint
      await baseQuery(
        {
          url: "/api/user/logout",
          method: "POST",
          credentials: "include",
        },
        api,
        extraOptions
      );
      api.dispatch(setUnAuthenticated());
      api.dispatch(removeUserData());
      api.dispatch(setMessage(" ⚠️ Session expired ! Please log in again."));
    }
  }
  return result;
};

export const odlApiSlice = createApi({
  reducerPath: "odlApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    // -=-------- GET USER DATA ---------
    getUserData: builder.query({
      query: () => "/api/user",
    }),

    // --------- CREATE USER ---------
    createUser: builder.mutation({
      query: (formData) => ({
        url: "/api/user/register",
        method: "POST",
        body: formData,
      }),
    }),

    // ---------- LOG-IN USER ----------
    loginUser: builder.mutation({
      query: (formData) => ({
        url: "/api/user/login",
        method: "POST",
        body: formData,
      }),
    }),

    // ---------- LOG-OUT USER -----------
    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/user/logout",
        method: "POST",
      }),
    }),

    // --------- GET CURRENT LOGGED-IN USER DATA -----------
    getLoggedInUser: builder.query({
      query: () => `/api/user/current-user-data`,

      //  The response is handled by the onQueryStarted lifecycle method in the getLoggedInUser endpoint, where it dispatches addUserData(data) to update the Redux store with the fetched user data.
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addUserData(data?.data));
          dispatch(addLinks(data?.data.links));
        } catch (error: any) {
          console.log("queryFulfilled promise failed : ", error);
          dispatch(setMessage(error.error.error));
        }
      },
    }),

    // ----------- UPDATE USER --------------
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/api/user/update-user-data",
        method: "PATCH",
        body: formData,
      }),
    }),

    // ------------ GET USER BY ID -------------
    getUserById: builder.query({
      query: ({ uId }) => `/api/user/user-by-id?uId=${uId}`,
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetLoggedInUserQuery,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} = odlApiSlice;
