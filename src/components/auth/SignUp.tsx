import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiSolidLockOpen } from "react-icons/bi";
import { BsLink } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useCreateUserMutation } from "../../RTK/API/odlApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { IRegisterFormInput } from "../../type";
import { useAppDispatch, useAppSelector } from "../../RTK/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import DisplayMessage from "../DisplayMessage";
import Loader from "../Loader";
// import Loader from "../Loader";
// import DisplayMessage from "../DisplayMessage";
// import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
// import { setMessage } from "../../RTK/slices/respMessageSlice";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --------- HANDLE SHOW PASSWORD TOGGLE ---------
  const handleShowPasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  }; // --------- HANDLE  SHOW CONFIRM-PASSWORD TOGGLE ---------
  const handleShowConfirmPasswordToggle = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const [
    createUser,
    {
      data: createUserMutationData,
      isLoading: createUserMutationLoading,
      isSuccess: createUserMutationSuccess,
      error: createUserMutationError,
    },
  ] = useCreateUserMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.responseMessage);

  // NAVIGATE TO SIGN-IN PAGE AFTER SIGN-UP
  useEffect(() => {
    createUserMutationSuccess && navigate("/login");
  }, [createUserMutationSuccess]);

  // RESPONSE MESSAGE
  useEffect(() => {
    createUserMutationData &&
      dispatch(setMessage(createUserMutationData.message));

    createUserMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          createUserMutationError.data?.message
        )
      );
  }, [createUserMutationData, createUserMutationError]);

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IRegisterFormInput>({ defaultValues });

  // ----- WATCH THE PASSWORD FIELD -----
  const watchedPassword = watch("password");

  const formSubmit: SubmitHandler<IRegisterFormInput> = async (formData) => {
    try {
      await createUser(formData);
    } catch (error: any) {
      console.error("Error creating user", error);
      dispatch(setMessage(error.message));
    }
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  useEffect(() => {
    isSubmitSuccessful &&
      (reset(defaultValues),
      setShowPassword(false),
      setShowConfirmPassword(false));
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="mx-5 flex flex-col items-center justify-center h-screen ">
      <div className="flex items-center justify-center gap-x-1 py-2 text-xl mb-10 ">
        <BsLink
          size={30}
          className="bg-bluishPurple text-white rounded-md p-0.5"
        />
        <i className="font-bold tracking-wider">devlinks</i>
      </div>
      <div className="formClass">
        <div className="space-y-3">
          <h1 className=" text-slate-800/70 text-xl font-bold">
            Create Account :{" "}
          </h1>
          <p className="text-slate-500/80 text-sm ">
            Let's get you started sharing your links !
          </p>
        </div>
        <form onSubmit={handleSubmit(formSubmit)} className="space-y-8">
          <div className="space-y-8">
            {/* --------- E-MAIL INPUT FIELD --------- */}
            <div>
              <p className="text-slate-800/70">Email address : </p>
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
              <p className="text-slate-800/70">Password : </p>
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

            {/* -------- CONFIRM PASSWORD  ------- */}
            <div>
              <p className="text-slate-800/70">Confirm password : </p>
              <div className="flex items-center gap-x-4 sm:px-5 border-b border-zinc-300 focus-within:border-b-2 focus-within:border-bluishPurple caret-bluishPurple ">
                <BiSolidLockOpen size={20} className="text-zinc-600" />
                <input
                  className="text-zinc-700 outline-none size-full py-3 caret-bluishPurple "
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=" Enter your password"
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "* Please Confirm your password",
                    },
                    validate: (value) =>
                      value === watchedPassword || "Password doesn't match",
                  })}
                />
                <div
                  onClick={handleShowConfirmPasswordToggle}
                  className=" text-zinc-600 p-1 cursor-pointer "
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors && (
                <p className="formErrorMessage">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
          </div>

          <button className="w-full bg-bluishPurple duration-300 text-white rounded-md py-2">
            <p className="hover:scale-110 duration-200">Create Account</p>
          </button>

          <p className="text-sm text-center mt-3 text-zinc-600 ">
            Already have an account ?
            <Link to={`/login`}>
              <span className="text-bluishPurple tracking-wider hover:text-green-500 transition-colors duration-200 font-bold underline cursor-pointer  pl-2 ">
                Login
              </span>
            </Link>{" "}
            now.
          </p>
        </form>

        {/* ------- RESPONSE ERROR MESSAGE --------- */}
        {message && <DisplayMessage />}
      </div>

      {/* ------- LOADER MODAL ------ */}
      {createUserMutationLoading && (
        <Loader isLoading={createUserMutationLoading} />
      )}
    </div>
  );
};

export default SignUp;
