import { FieldArrayWithId, useFormContext, Controller } from "react-hook-form";
import Select from "react-select";
import { RxDragHandleHorizontal } from "react-icons/rx";
import {
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaLink,
} from "react-icons/fa";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { IFormInput } from "../type";

interface ILinkFormProps {
  index: number;
  handleRemoveLink: (props: number) => void;
  field: FieldArrayWithId<IFormInput, "links", "id">;
  fields: FieldArrayWithId<IFormInput, "links", "id">[];
  setIsDisabledAddBtn: React.Dispatch<React.SetStateAction<boolean>>;
}

// Custom option component for react-select
const CustomOption = (props: any) => {
  const { data, innerRef, innerProps, isDisabled } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`flex items-center p-2  ${
        isDisabled
          ? "text-gray-400 bg-gray-100 cursor-not-allowed " // Custom classes for disabled options
          : "text-zinc-600 hover:bg-sky-200 cursor-pointer "
      }`}
    >
      <span className="mr-2">{data.icon}</span>
      {data.label}
    </div>
  );
};

// Custom SingleValue component for react-select
const CustomSingleValue = (props: any) => {
  const { data } = props;
  return (
    <div className="flex items-center px-3">
      <span className="mr-3">{data.icon}</span>
      {data.label}
    </div>
  );
};

const LinkForm: React.FC<ILinkFormProps> = ({
  index,
  handleRemoveLink,
  field,
  fields,
  setIsDisabledAddBtn,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: field.id,
      disabled: !isDragging, // Enable drag only when necessary
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: isDragging ? "none" : "auto", // Disable scroll while dragging
  };

  // ACTIVE DRAGGING ON LONG PRESS OR SPECIFIC MOVEMENT
  const handlePointerDown = () => {
    setTimeout(() => {
      setIsDragging(true);
    }, 150); // Delay to distinguish scroll form drag
  };

  const handlePointerUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const options = [
    { value: "Github", label: "Github", icon: <FaGithub /> },
    { value: "YouTube", label: "YouTube", icon: <FaYoutube /> },
    { value: "Twitter", label: "Twitter", icon: <FaTwitter /> },
    { value: "LinkedIn", label: "LinkedIn", icon: <FaLinkedin /> },
    { value: "Facebook", label: "Facebook", icon: <FaFacebook /> },
  ];

  // Create an array of platform values that are already selected
  const disabledOptions = fields.map((field) => field.platform);

  useEffect(() => {
    if (options.length === disabledOptions.length) {
      setIsDisabledAddBtn(true);
    } else setIsDisabledAddBtn(false);
  }, [disabledOptions, fields]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-1 bg-zinc-100 p-5 text-zinc-500 rounded-md animate-fadeindown "
      onPointerDown={handlePointerDown}
    >
      <div className="flex items-center justify-between text-sm font-semibold mb-5">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-x-1 cursor-grab "
        >
          <RxDragHandleHorizontal size={20} />
          Link # {index + 1}
        </div>
        <button
          onClick={() => handleRemoveLink(index)}
          type="button"
          className="p-1 hover:shadow hover:shadow-zinc-400 rounded-md hover:text-zinc-700 duration-300"
        >
          Remove
        </button>
      </div>

      {/* ------ PLATFORM NAME ------- */}
      <div>
        <label htmlFor={`platform-${index}`} className="text-zinc-500 text-sm">
          Platform
        </label>
        <div>
          <Controller
            name={`links.${index}.platform`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                styles={{
                  control: (provided: any, state: any) => ({
                    ...provided,
                    border: "1px solid transparent",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    boxShadow: state.isFocused && "0px 0px 5px 0px blueviolet",
                  }),
                  placeholder: (provided: any) => ({
                    ...provided,
                    fontSize: "13px",
                    color: "#9CA3AF",
                  }),
                }}
                options={options}
                placeholder="Select a platform ...."
                isSearchable={false}
                components={{
                  Option: CustomOption,
                  SingleValue: CustomSingleValue,
                }}
                value={options.find((option) => option.value === field.value)}
                onChange={(selectedOption) =>
                  selectedOption && field.onChange(selectedOption.value)
                }
                isOptionDisabled={(option) =>
                  disabledOptions.includes(option.value)
                }
              />
            )}
          />
        </div>
      </div>

      {/* -------- LINK ------- */}
      <div>
        <label htmlFor={`link-${index}`} className="text-zinc-500 text-sm">
          Link
        </label>
        <div className="flex items-center w-full rounded-md text-zinc-500 tracking-wider  caret-purple-400 bg-white  gap-x-3 focus-within:shadow-inner focus-within:shadow-bluishPurple/50 p-1 ">
          <div className=" pl-2 sm:pl-5">
            <FaLink className="text-xs" />
          </div>
          <input
            className=" focus:outline-none bg-none p-2  size-full rounded-md "
            type="text"
            id={`link-${index}`}
            placeholder="https://example.com"
            {...register(`links.${index}.link`, {
              required: "* Link is required",
              pattern: {
                value: /^https:\/\/.*/,
                message: "URL must start with https://",
              },
            })}
          />
        </div>
        {(errors.links as any)?.[index]?.link && (
          <p className="formErrorMessage">
            {(errors.links as any)[index]?.link.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LinkForm;
