import { useEffect, useState } from "react";
import { BiSolidLockOpen } from "react-icons/bi";
import { HiMail } from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
// import { BsLink } from "react-icons/bs";
import { useLoginUserMutation } from "../../RTK/API/odlApiSlice";
import { ILogInFormInput } from "../../type";
import { useAppDispatch, useAppSelector } from "../../RTK/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import DisplayMessage from "../DisplayMessage";
import Loader from "../Loader";
import { addUserData, setAuthenticated } from "../../RTK/slices/userSlice";
import { addLinks } from "../../RTK/slices/linkSlice";
import { BsLink } from "react-icons/bs";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [
    logIn,
    {
      data: loginUserMutationData,
      isLoading: loginUserMutationLoading,
      error: loginUserMutationError,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();
  const { message } = useAppSelector((state) => state.responseMessage);
  const { isAuthenticated } = useAppSelector((state) => state.userReducer);

  // ------- NAVIGATE TO HOME PAGE AFTER SUCCESSFUL LOG-IN --------
  useEffect(() => {
    isAuthenticated && navigate("/links");
  }, [isAuthenticated]);

  useEffect(() => {
    loginUserMutationData &&
      (dispatch(addUserData(loginUserMutationData.data.user)),
      dispatch(setAuthenticated()),
      dispatch(addLinks(loginUserMutationData.data.user.links)));

    loginUserMutationData &&
      dispatch(setMessage(loginUserMutationData.message));

    loginUserMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          loginUserMutationError.data?.message
        )
      );
  }, [loginUserMutationData, loginUserMutationError]);

  const defaultValues = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<ILogInFormInput>({ defaultValues });

  const formSubmit: SubmitHandler<ILogInFormInput> = async (formData) => {
    try {
      await logIn(formData);
    } catch (error: any) {
      console.error("Error user login : ", error);
      dispatch(setMessage(error.message));
    }
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  useEffect(() => {
    isSubmitSuccessful && reset(defaultValues);
  }, [isSubmitSuccessful, reset]);

  // --------- HANDLE SHOW PASSWORD TOGGLE ---------
  const handleShowPasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="mx-5 flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center gap-x-1 py-2 text-xl mb-10 ">
        <BsLink
          size={30}
          className="bg-bluishPurple text-white rounded-md p-0.5"
        />
        <i className="font-bold tracking-wider">devlinks</i>
      </div>
      <div className="formClass">
        <div className="space-y-3">
          <h1 className=" text-slate-800/70 text-xl font-bold">Log In :</h1>
          <p className="text-slate-500/80 text-sm ">
            Add your details below to get the back intothe app
          </p>
        </div>
        <form onSubmit={handleSubmit(formSubmit)} className="space-y-8">
          <div className="space-y-3">
            {/* --------- E-MAIL INPUT FIELD --------- */}
            <div>
              <div className="flex items-center gap-x-4 sm:px-5  border-b border-zinc-300 focus-within:border-b-2 focus-within:border-bluishPurple caret-bluishPurple ">
                <HiMail size={20} className="text-zinc-600" />
                <input
                  className=" text-zinc-700 outline-none size-full py-3 caret-bluishPurple "
                  type="text"
                  placeholder="e.g. example@mail.com "
                  {...register("email", {
                    required: {
                      value: true,
                      message: "* E-mail required",
                    },
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "* invalid mail ",
                    },
                  })}
                />
              </div>
              {errors && (
                <p className="formErrorMessage">{errors.email?.message}</p>
              )}
            </div>

            {/* ---------- PASSWORD ----------  */}
            <div>
              <div className="flex items-center gap-x-4 sm:px-5 border-b border-zinc-300 focus-within:border-b-2 focus-within:border-bluishPurple caret-bluishPurple ">
                <BiSolidLockOpen size={20} className="text-zinc-600" />
                <input
                  className="text-zinc-700 outline-none size-full py-3 caret-bluishPurple "
                  type={showPassword ? "text" : "password"}
                  placeholder=" Enter your password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "* Password required",
                    },
                    minLength: {
                      value: 6,
                      message: "* password must be more than 5 characters ",
                    },
                  })}
                />
                <div
                  onClick={handleShowPasswordToggle}
                  className=" text-zinc-600 p-1 cursor-pointer "
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors && (
                <p className="formErrorMessage">{errors.password?.message}</p>
              )}
            </div>
          </div>

          <button className="w-full bg-bluishPurple duration-300 text-white rounded-md py-2">
            <p className="hover:scale-110 duration-200">Login</p>
          </button>

          <p className="text-sm text-center mt-3 text-zinc-600 ">
            Don't have an account ?
            <Link to={`/register`}>
              <span className="text-bluishPurple tracking-wider hover:text-green-500 transition-colors duration-200 font-bold underline cursor-pointer  pl-2 ">
                Create account
              </span>
            </Link>{" "}
            now.
          </p>
        </form>

        {/* ------- RESPONSE ERROR MESSAGE --------- */}
        {message && <DisplayMessage />}
      </div>

      {/* ------- LOADER MODAL ------ */}
      {loginUserMutationLoading && (
        <Loader isLoading={loginUserMutationLoading} />
      )}
    </div>
  );
};

export default SignIn;
