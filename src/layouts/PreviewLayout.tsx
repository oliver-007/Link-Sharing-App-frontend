import { Link, useLocation, useParams } from "react-router-dom";
import RootSkeleton from "../components/RootSkeleton";
import { useAppDispatch, useAppSelector } from "../RTK/store";
import { setMessage } from "../RTK/slices/respMessageSlice";
import DisplayMessage from "../components/DisplayMessage";
import { FaCopy } from "react-icons/fa";
import { useGetUserByIdQuery } from "../RTK/API/odlApiSlice";
import { useEffect } from "react";
import { addLinks } from "../RTK/slices/linkSlice";
import { BsLink } from "react-icons/bs";

const PreviewLayout = () => {
  const userReducer = useAppSelector((state) => state.userReducer);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const { message } = useAppSelector((state) => state.responseMessage);

  // ----------- GET USER INTO RTK-QUERY HOOK ------------
  const {
    data: userByIdQueryData,
    // isLoading: userByIdQueryLoading,
    error: userByIdQueryError,
  } = useGetUserByIdQuery({ uId: userId }, { skip: !userId });

  useEffect(() => {
    userByIdQueryData &&
      (dispatch(setMessage(userByIdQueryData.message)),
      dispatch(addLinks(userByIdQueryData.data.links)));

    userByIdQueryError &&
      dispatch(
        setMessage(
          // @ts-ignore
          userByIdQueryError.data.message
        )
      );
  }, [userByIdQueryData, userByIdQueryError]);

  const copyUrlToClipboard = async () => {
    const fullUrl = `${window.location.origin}${location.pathname}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      dispatch(setMessage("Profile link copied to clipboard!"));
    } catch (error) {
      console.log("Failed to copy : ", error);
      dispatch(setMessage("Failed to copy link. Please try again."));
    }
  };

  return (
    <>
      <div className="bg-bluishPurple rounded-b-3xl p-4 h-[300px]">
        {/* if current signed-in user-id === user-id passed through url, only then this navbar will be shown on ui. */}
        {userId === userReducer.user?._id ? (
          <ul className="flex items-center justify-between rounded-md px-3 py-2 bg-white text-bluishPurple ">
            <Link to="/links">
              <li className="border border-bluishPurple text-xs px-1 sm:px-3 py-1 rounded-md cursor-pointer hover:bg-bluishPurple/10 duration-200 ">
                Back to Editor
              </li>
            </Link>
            <li
              onClick={copyUrlToClipboard}
              className="border border-bluishPurple px-3 py-2 rounded-md bg-bluishPurple  text-white cursor-pointer hover:scale-105 duration-200 flex items-center gap-x-2 "
            >
              <FaCopy />
              <p className=" hidden sm:block ">Copy Link</p>
            </li>
          </ul>
        ) : (
          <Link to="/links">
            <div className="flex text-2xl gap-x-3 items-center justify-center mt-5 ">
              <BsLink
                size={30}
                className="bg-bluishPurple shadow-sm shadow-white text-white rounded-md p-0.5"
              />
              <i className="hidden text-white sm:block  font-bold tracking-wider">
                devlinks
              </i>
            </div>
          </Link>
        )}
      </div>
      {/* --------- USER PROFILE -------- */}
      <div className="flex items-center justify-center -mt-[120px] ">
        <div className="rounded-xl shadow-lg shadow-gray-300 bg-white w-[260px] p-5">
          <RootSkeleton
            // IMPORTANT- keeping in mind: Since this page will be shown to anyone without logIn, so you can't use already saved data in userReducer. That's why in this page, you've to fetch user data using params userId again.
            previewImg={userByIdQueryData?.data?.profileImg}
            previewFirstname={userByIdQueryData?.data?.firstName}
            previewLastName={userByIdQueryData?.data?.lastName}
            previewEmail={userByIdQueryData?.data?.email}
          />
        </div>
      </div>

      {/* --------- RESPONSE MESSAGE ---------- */}
      {message && <DisplayMessage />}
    </>
  );
};

export default PreviewLayout;
