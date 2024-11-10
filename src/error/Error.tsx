// import { useNavigate } from "react-router-dom";
// import error404Svg from "../assets/404_error.svg";
// import error401Svg from "../assets/401_error.svg";

// interface IErrorProps {
//   errorMessage?: string;
//   status?: number;
// }

// const Error: React.FC<IErrorProps> = ({ errorMessage, status }) => {
//   const navigate = useNavigate();

//   const handleBtn = () => {
//     navigate(`${status === 401 ? "/login" : "/links"}`);
//   };

//   return (
//     <div
//       className="flex flex-col items-center justify-center bg-no-repeat bg-center w-screen h-screen  "
//       style={{
//         backgroundImage: `url(${status === 401 ? error401Svg : error404Svg})`,
//       }}
//     >
//       <p className="text-3xl text-rose-500 font-semibold"> {errorMessage} </p>
//       <button onClick={handleBtn} className="btn" type="button">
//         {status === 401 ? "Reload" : "Go Home"}
//       </button>
//     </div>
//   );
// };

// export default Error;

import { useNavigate } from "react-router-dom";
import error404Svg from "../assets/404_error.svg";
// import error401Svg from "../assets/401_error.svg";

// interface IErrorProps {
//   errorMessage?: string;
//   status?: number;
// }

const Error = () => {
  const navigate = useNavigate();

  const handleBtn = () => {
    navigate("/links");
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-no-repeat bg-center w-screen h-screen  "
      style={{
        backgroundImage: `url( ${error404Svg})`,
      }}
    >
      {/* <p className="text-3xl text-rose-500 font-semibold"> {errorMessage} </p> */}
      <button onClick={handleBtn} className="btn" type="button">
        Go Home
      </button>
    </div>
  );
};

export default Error;
