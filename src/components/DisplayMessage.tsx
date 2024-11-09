import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "../RTK/store";
import { setMessage } from "../RTK/slices/respMessageSlice";
import { FaSave } from "react-icons/fa";

const DisplayMessage = () => {
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();
  const [isShowMessage, setIsShowMessage] = useState(false);

  // Show message when there's a new response
  useEffect(() => {
    setIsShowMessage(true);
    // First timer to hide the message after 5 seconds
    const timer = setTimeout(() => {
      setIsShowMessage(false); // Triggers fade out animation
      // Second timer to dispatch and reset message after fade out completes
      const fadingOutTimer = setTimeout(() => {
        dispatch(setMessage("")); // Clear the message from state
      }, 500); // Adjust this to match the duration of your fade-out animation
      return () => clearTimeout(fadingOutTimer);
    }, 5000); // Message is visible for 5 seconds
    return () => clearTimeout(timer); // Cleanup the timer
  }, [responseMessage, dispatch]);

  // -------- HANDLE CLOSE POP-UP MESSAGE --------
  const handleClose = () => {
    setIsShowMessage(false); // Triggers fade out animation
    const timer = setTimeout(() => {
      dispatch(setMessage("")); // Clear the message from state
    }, 500); // Adjust this to match the duration of your fade-out animation
    return () => clearTimeout(timer);
  };

  return (
    <div
      className={` bottom-10 left-1/2 -translate-x-1/2 fixed z-50 ${
        isShowMessage ? "animate-fadeinup" : "animate-fadeoutdown"
      }`}
    >
      <div
        className={`flex items-center bg-zinc-800 text-white rounded-lg px-3 py-2 text-[11px] font-semibold sm:text-base gap-x-6 `}
      >
        <FaSave />
        <p> {responseMessage.message} </p>
        <button onClick={handleClose} className=" p-0.5">
          <IoCloseSharp size={20} />
        </button>
      </div>
    </div>
  );
};

export default DisplayMessage;
