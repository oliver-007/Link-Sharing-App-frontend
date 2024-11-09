import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiImageOn } from "react-icons/ci";

import avatarSVG from "../assets/avatar.svg";
import { IUserInfoFormInput } from "../type";
import RootSkeleton from "./RootSkeleton";
import { useAppDispatch, useAppSelector } from "../RTK/store";
import {
  useLogoutUserMutation,
  useUpdateUserMutation,
} from "../RTK/API/odlApiSlice";
import Loader from "./Loader";
import { setMessage } from "../RTK/slices/respMessageSlice";
import DisplayMessage from "./DisplayMessage";
import { removeUserData, setUnAuthenticated } from "../RTK/slices/userSlice";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/bmp"];

const Profile = () => {
  const { user } = useAppSelector((state) => state.userReducer);
  const [previewImg, setPreviewImg] = useState<string | null | undefined>(
    user?.profileImg
  );
  const [previewFirstName, setPreviewFirstName] = useState<string | null>(null);
  const [previewLastName, setPreviewLastName] = useState<string | null>(null);
  const [previewEmail, setPreviewEmail] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { message } = useAppSelector((state) => state.responseMessage);
  const { links } = useAppSelector((state) => state.allLinks);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // --------- UPDATE USER RTK-MUTAION HOOK ----------
  const [
    updateUserMutation,
    {
      data: updateUserMutationData,
      isLoading: updateUserMutationLoading,
      error: updateUserMutationError,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    updateUserMutationData &&
      dispatch(setMessage(updateUserMutationData.message));

    updateUserMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          updateUserMutationError.data.message
        )
      );
  }, [updateUserMutationData, updateUserMutationError]);

  // ---------- LOG-OUT RTK-MUTATION HOOK -----------
  const [
    logoutMutation,
    {
      data: logoutMutationData,
      isError: logoutMutationError,
      isLoading: logoutMutationLoading,
      isSuccess: logoutMutationSuccess,
    },
  ] = useLogoutUserMutation();

  useEffect(() => {
    logoutMutationData && dispatch(setMessage(logoutMutationData.message));

    logoutMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          logoutMutationError.data.message
        )
      );
  }, [logoutMutationData, logoutMutationError]);

  const defaultValues = {
    profileImg: null,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  };

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<IUserInfoFormInput>({ defaultValues });

  // ------- FORM SUBMIT --------
  const formSubmit: SubmitHandler<IUserInfoFormInput> = async (rawFromData) => {
    try {
      const formData = new FormData();

      rawFromData &&
        rawFromData.profileImg &&
        formData.append("profileImg", rawFromData.profileImg[0]);

      formData.append("firstName", rawFromData.firstName);
      formData.append("lastName", rawFromData.lastName);
      rawFromData &&
        rawFromData.email &&
        formData.append("email", rawFromData.email);
      links.forEach((singleLink, index) => {
        formData.append(`links[${index}]`, JSON.stringify(singleLink));
      });

      await updateUserMutation(formData);
    } catch (error: any) {
      console.log("Error creating user profile ---", error);
      dispatch(setMessage(error.message));
    }
  };

  // ------- HANDLE IMAGE CHANGE (SHOW IMAGE ON UI INSTANTLY) ----------
  const handleImageChange = () => {
    const fileList = getValues("profileImg");

    if (fileList && fileList[0]) {
      const file = fileList[0];

      // Validate file size and format
      if (file.size > MAX_FILE_SIZE) {
        setFileError("* File size must be below 1MB.");
        setPreviewImg(null);
        return;
      }
      if (!ALLOWED_FORMATS.includes(file.type)) {
        setFileError("* Invalid file format. Use PNG, JPG, or BMP.");
        setPreviewImg(null);
        return;
      }

      setFileError(null); // Clear any previous error

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // ------- HANDLE FIRST NAME CHANGE -------
  const handleFirstNameChange = () => {
    const firstName = getValues("firstName");
    firstName && setPreviewFirstName(firstName);
  };
  // ------- HANDLE LAST NAME CHANGE -------
  const handleLastNameChange = () => {
    const lastName = getValues("lastName");
    lastName && setPreviewLastName(lastName);
  };

  // -------- HANDLE EMAIL CHANGE ---------
  const handleEmailChange = () => {
    const email = getValues("email");
    email && setPreviewEmail(email);
  };

  // --------- HANDLE LOG OUT ---------
  const handleLogout = () => {
    logoutMutation({});
    dispatch(setUnAuthenticated());
    dispatch(removeUserData());
  };

  useEffect(() => {
    logoutMutationSuccess && navigate("/login");
  }, [logoutMutationSuccess]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 ">
      {/* ---------- SAMPLE VIEW IN MOBILE SCREEN ----------- */}
      <span className="hidden md:block">
        <div className="col-span-1 bg-white py-10 px-5 flex items-center justify-center rounded-md ">
          {" "}
          <div className=" border-2 border-zinc-400 rounded-xl h-[450px] w-[260px] p-2 ">
            <div className="border border-zinc-400 rounded-xl size-full flex flex-col py-5 px-2 ">
              {/* -------- ROOT SKELETON WITH PREVIEW IMG & USER INFO -------- */}
              <RootSkeleton
                previewImg={previewImg}
                previewFirstname={previewFirstName}
                previewLastName={previewLastName}
                previewEmail={previewEmail}
              />
            </div>
          </div>{" "}
        </div>
      </span>
      <div className="col-span-2 bg-white rounded-md">
        <div className="px-5 py-8 space-y-8">
          {/* ------- PROFILE DETAILS HEADING ------- */}
          <div>
            <h2 className="text-lg font-bold text-zinc-600 ">
              {" "}
              Profile Details{" "}
            </h2>
            <p className="text-xs text-zinc-400">
              {" "}
              Add your details to create a personal touch to your profile.{" "}
            </p>
          </div>

          {/* --------- PROFILE DETAILS FORM --------- */}
          <form
            onSubmit={handleSubmit(formSubmit)}
            className="flex flex-col space-y-4 "
          >
            {/* ------- PROFILE IMG DIV------- */}
            <div className="bg-zinc-100 flex flex-col sm:flex-row gap-y-2 items-center justify-around rounded-md p-2 text-zinc-500 ">
              <p> Profile picture </p>
              <div className=" relative border border-zinc-300 rounded-md bg-zinc-100 ">
                <img
                  src={previewImg ? previewImg : avatarSVG}
                  alt={previewImg ? previewImg : "avatar"}
                  className=" size-[100px] sm:size-[120px] rounded-md "
                />
                <div className=" opacity-0 hover:opacity-100 duration-300 absolute bg-black/30 rounded-md text-xs text-white flex items-center justify-center inset-0 flex-col cursor-pointer ">
                  <CiImageOn size={30} />
                  Change Image
                  <input
                    type="file"
                    className=" absolute inset-0 opacity-0 cursor-pointer "
                    id="profileImg"
                    {...register("profileImg", {
                      onChange: handleImageChange,
                    })}
                  />
                </div>
              </div>

              <div className="text-xs flex flex-col items-center justify-center ">
                <p> Image must be below 1024x1024px. </p>
                <p> Use PNG, JPG or BMP format. </p>

                {fileError && (
                  <div className="formErrorMessage"> {fileError} </div>
                )}
              </div>
            </div>

            {/* -------- PROFILE DETAILS ---------- */}
            <div className=" flex flex-col space-y-4 bg-zinc-100 p-5 text-zinc-500 rounded-md">
              {/* ------- FIRST NAME ------- */}
              <div className="grid grid-cols-2 sm:grid-cols-3 items-center space-y-2 ">
                <label
                  htmlFor="firstName"
                  className="text-zinc-500 col-span-1 text-sm"
                >
                  First name * :
                </label>
                <div className="col-span-2">
                  <input
                    className="inputClass"
                    type="text"
                    id="firstName"
                    placeholder="First name ...."
                    {...register("firstName", {
                      onChange: handleFirstNameChange,
                      required: {
                        value: true,
                        message: " * First Name is required. ",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "* First name must be more than 2 characters !",
                      },
                    })}
                  />
                  {errors && (
                    <p className="formErrorMessage">
                      {" "}
                      {errors.firstName?.message}{" "}
                    </p>
                  )}
                </div>
              </div>

              {/* ------ LAST NAME ------- */}
              <div className="grid grid-cols-2 sm:grid-cols-3 items-center space-y-2 ">
                <label
                  htmlFor="lastName"
                  className="text-zinc-500 col-span-1 text-sm"
                >
                  Last name * :
                </label>
                <div className="col-span-2">
                  <input
                    className="inputClass"
                    type="text"
                    id="lastName"
                    placeholder="Last name ...."
                    {...register("lastName", {
                      onChange: handleLastNameChange,
                      required: {
                        value: true,
                        message: " * Last Name is required. ",
                      },
                      minLength: {
                        value: 2,
                        message: "* Last name must be more than 2 characters !",
                      },
                    })}
                  />
                  {errors && (
                    <p className="formErrorMessage">
                      {" "}
                      {errors.lastName?.message}{" "}
                    </p>
                  )}
                </div>
              </div>

              {/* -------- E-MAIL ------- */}
              <div className="grid grid-cols-2 sm:grid-cols-3 items-center space-y-2 ">
                <label
                  htmlFor="email "
                  className="text-zinc-500 text-sm col-span-1 "
                >
                  Email :
                </label>
                <div className="col-span-2">
                  <input
                    className="inputClass "
                    type="email"
                    id="email"
                    placeholder="E-mail ...."
                    {...register("email", {
                      onChange: handleEmailChange,
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: "* invalid mail ",
                      },
                    })}
                  />
                  {errors && (
                    <p className="formErrorMessage">
                      {" "}
                      {errors.email?.message}{" "}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <hr />
            {/* -------- SUBMIT BUTTON ------- */}
            <div className="flex items-center justify-around">
              <button
                onClick={handleLogout}
                type="button"
                className=" w-[80px] px-2 py-1 bg-rose-500 hover:bg-rose-600 rounded-md text-white"
              >
                Log out
              </button>
              <button
                type="submit"
                className=" w-[80px] px-2 py-1 bg-bluishPurple/90 hover:bg-bluishPurple rounded-md text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --------- RESPONSE MESSAGE ---------- */}
      {message && <DisplayMessage />}

      {/* +++++++ LOADER ++++++ */}
      {logoutMutationLoading ||
        (updateUserMutationLoading && (
          <Loader
            isLoading={logoutMutationLoading || updateUserMutationLoading}
          />
        ))}
    </div>
  );
};

export default Profile;
