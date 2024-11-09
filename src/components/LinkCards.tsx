import React from "react";
import { ILink } from "../type";
import LinkSkeleton from "./LinkSkeleton";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "../RTK/store";

interface ILinksArrayProps {
  watchedLinks?: ILink[];
}

const LinkCards: React.FC<ILinksArrayProps> = ({ watchedLinks }) => {
  const allLinks = useAppSelector((state) => state.allLinks);
  const linksArray = watchedLinks || allLinks.links;

  const platformIcons: { [key: string]: JSX.Element } = {
    Github: <FaGithub />,
    YouTube: <FaYoutube />,
    Twitter: <FaTwitter />,
    LinkedIn: <FaLinkedin />,
    Facebook: <FaFacebook />,
  };

  const platformColors: { [key: string]: string } = {
    Github: "bg-gray-800",
    YouTube: "bg-red-600",
    Twitter: "bg-blue-400",
    LinkedIn: "bg-blue-600",
    Facebook: "bg-blue-700",
  };

  return (
    <div className=" text-xs h-[15rem] overflow-auto w-full flex flex-col space-y-3 ">
      {linksArray.length > 0 ? (
        linksArray.map((singleLink, index) => (
          <Link
            key={index}
            to={singleLink.link || "/"}
            target={`${!singleLink.link ? "" : "_blank"}`}
            rel="noopener noreferrer"
          >
            <div
              className={`text-white flex items-center justify-between rounded-md px-3 py-2 ${
                platformColors[singleLink.platform]
              }`}
            >
              <div className="flex items-center gap-x-2">
                <span> {platformIcons[singleLink.platform]} </span>
                <span>{singleLink.platform}</span>
              </div>
              <FaArrowRight />
            </div>
          </Link>
        ))
      ) : (
        // -------- LINKS SKELETON ----------
        <LinkSkeleton />
      )}
    </div>
  );
};

export default LinkCards;
