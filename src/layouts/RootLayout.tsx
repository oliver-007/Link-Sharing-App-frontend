// import { BsLink } from "react-icons/bs";
import { Outlet } from "react-router-dom";
import { useGetLoggedInUserQuery } from "../RTK/API/odlApiSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../RTK/store";
import { setAuthenticated } from "../RTK/slices/userSlice";
import ripple from "../assets/Ripple.svg";
import { setMessage } from "../RTK/slices/respMessageSlice";

const RootLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    data: loggedInUserQueryData,
    error: loggedInUserQueryError,
    isLoading: loggedInUserQueryLoading,
  } = useGetLoggedInUserQuery({});

  useEffect(() => {
    dispatch(setAuthenticated());
  }, [loggedInUserQueryData]);

  useEffect(() => {
    loggedInUserQueryError &&
      dispatch(
        setMessage(
          // @ts-ignore
          loggedInUserQueryError.data.message
        )
      );
  }, [loggedInUserQueryError]);

  return (
    <>
      {loggedInUserQueryLoading ? (
        <div className=" h-screen w-screen flex items-center justify-center ">
          <img src={ripple} alt="ripple" />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default RootLayout;
