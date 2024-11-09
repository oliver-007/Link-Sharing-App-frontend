import { Link, NavLink } from "react-router-dom";
import { FaEye, FaLink, FaRegUserCircle } from "react-icons/fa";
import { BsLink } from "react-icons/bs";
import { useAppSelector } from "../RTK/store";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.userReducer);

  return (
    <div className="flex items-center justify-around bg-white rounded-md py-2 text-zinc-600 text-sm">
      <Link to="/links">
        <div className="cursor-pointer flex items-center justify-center gap-x-1 py-2 text-xl ">
          <BsLink
            size={30}
            className="bg-bluishPurple text-white rounded-md p-0.5"
          />
          <i className="hidden sm:block  font-bold tracking-wider">devlinks</i>
        </div>
      </Link>
      <div className="flex items-center gap-x-6 sm:gap-x-12 ">
        <NavLink
          to="/links"
          className={({ isActive }) =>
            `flex items-center gap-x-1 px-2 py-2 sm:py-1 rounded-md hover:bg-bluishPurple/10 ${
              isActive ? "bg-bluishPurple/10 text-zinc-700 " : ""
            }`
          }
        >
          <FaLink size={20} className="sm:text-xs text-bluishPurple " />
          <p className="hidden sm:block">Links</p>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-x-1 px-2 py-2 sm:py-1 rounded-md hover:bg-bluishPurple/10 ${
              isActive ? "bg-bluishPurple/10 text-zinc-700" : ""
            }`
          }
        >
          <FaRegUserCircle
            className="sm:text-xs text-bluishPurple "
            size={20}
          />
          <p className="hidden sm:block">Profile Details</p>
        </NavLink>
      </div>
      <Link to={`/user/${user?._id}`}>
        <button
          type="button"
          className="px-2 py-2 sm:py-1 border flex items-center gap-x-1 border-bluishPurple/40 bg-bluishPurple/10 hover:bg-bluishPurple/20 rounded-md"
        >
          <FaEye size={20} className="text-bluishPurple sm:text-xs" />
          <p className=" hidden sm:block font-semibold">Preview</p>
        </button>
      </Link>
    </div>
  );
};

export default Navbar;
