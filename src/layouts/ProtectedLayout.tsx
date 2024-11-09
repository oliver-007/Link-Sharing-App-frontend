import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAppSelector } from "../RTK/store";
import { useEffect } from "react";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="py-3 px-5 bg-zinc-100 space-y-3 ">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
