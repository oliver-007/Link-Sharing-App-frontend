import { useAppSelector } from "../RTK/store";
import { ILink } from "../type";
import LinkCards from "./LinkCards";

interface IRootSkeletonProps {
  watchedLinks?: ILink[];
  previewImg?: string | null;
  previewFirstname?: string | null;
  previewLastName?: string | null;
  previewEmail?: string | null;
}

const RootSkeleton: React.FC<IRootSkeletonProps> = ({
  watchedLinks,
  previewImg,
  previewEmail,
  previewFirstname,
  previewLastName,
}) => {
  const userReducer = useAppSelector((state) => state.userReducer);

  const profileImg = userReducer.user?.profileImg;
  const firstName = userReducer.user?.firstName;
  const lastName = userReducer.user?.lastName;
  const email = userReducer.user?.email;

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center space-y-3 ">
        {/* ---------- USER PROFILE IMAGE DISPLAY ----------- */}
        <div
          className={`  ${!(previewImg || profileImg) && "animate-pulse"}  `}
        >
          {previewImg || profileImg ? (
            <img
              src={previewImg || profileImg}
              alt={previewFirstname || firstName}
              className="rounded-full size-[5rem] shadow-md shadow-bluishPurple/80 border border-bluishPurple"
            />
          ) : (
            <div className="rounded-full size-[5rem] bg-zinc-300 "> </div>
          )}
        </div>

        {/* -------- USER NAME & EMAIL DISPLAY --------- */}
        <div className="flex flex-col items-center justify-center space-y-2 ">
          <div className="text-zinc-500 capitalize flex items-center space-x-1 ">
            {" "}
            <span
              className={` ${
                !(previewFirstname || firstName) && "animate-pulse"
              } `}
            >
              {" "}
              {previewFirstname ? (
                previewFirstname
              ) : firstName ? (
                firstName
              ) : (
                <p className="bg-zinc-300 w-[4rem] h-[10px] rounded-full "> </p>
              )}
            </span>
            <span
              className={` ${
                !(previewLastName || lastName) && "animate-pulse"
              } `}
            >
              {previewLastName ? (
                previewLastName
              ) : lastName ? (
                lastName
              ) : (
                <p className="bg-zinc-300 w-[4rem] h-[10px] rounded-full"> </p>
              )}{" "}
            </span>
          </div>
          <div
            className={`text-zinc-400 text-xs ${
              !(previewEmail || email) && "animate-pulse"
            } `}
          >
            {previewEmail ? (
              previewEmail
            ) : email ? (
              email
            ) : (
              <p className="bg-zinc-300 w-[5rem] h-[8px] rounded-full "></p>
            )}
          </div>
        </div>
      </div>
      {/* -------- SHOW LINKS ON MOCK MOBILE DISPLAY ------- */}
      <LinkCards watchedLinks={watchedLinks} />
    </div>
  );
};

export default RootSkeleton;
