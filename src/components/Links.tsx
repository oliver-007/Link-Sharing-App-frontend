import { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";

import LinkForm from "./LinkForm";
import letsStart from "../assets/start.png";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IFormInput } from "../type";
import { useAppDispatch, useAppSelector } from "../RTK/store";
import { addLinks } from "../RTK/slices/linkSlice";
import DisplayMessage from "./DisplayMessage";
import RootSkeleton from "./RootSkeleton";
import { setMessage } from "../RTK/slices/respMessageSlice";

const Links = () => {
  const [isDisabledAddBtn, setIsDisabledAddBtn] = useState(false);
  const dispatch = useAppDispatch();
  const { links } = useAppSelector((state) => state.allLinks);
  const { message } = useAppSelector((state) => state.responseMessage);

  const methods = useForm<IFormInput>({
    defaultValues: {
      links: [],
    },
  });

  const watchedLinks = methods.watch("links");

  const control = methods.control;
  const { fields, remove, prepend, update } = useFieldArray({
    control,
    name: "links",
  });

  useEffect(() => {
    links.length > 0 &&
      links.map((singleLink, index) =>
        update(index, { platform: singleLink.platform, link: singleLink.link })
      );
  }, [links]);

  // -------- FORM SUBMIT FUNC ---------
  const formSubmit = async (formData: IFormInput) => {
    dispatch(addLinks(formData.links));
    dispatch(
      setMessage(
        "Links Updated. Please save your updated profile form Profile page."
      )
    );
  };

  const handleAddLink = () => {
    prepend({ platform: "", link: "" });
  };

  const handleRemoveLink = (index: number) => {
    remove(index);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle Drag End: Reorder the items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the index of the dragged item and the item it was dropped over

      const getLinkIndex = (lId: any) =>
        fields.findIndex((singleField) => singleField.id === lId);

      const oldIndex = getLinkIndex(active.id);
      const newIndex = getLinkIndex(over.id);

      // Reorder the list using `arrayMove`
      methods.setValue("links", arrayMove(fields, oldIndex, newIndex));
    } else return;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 h-full ">
      {/* ---------- SAMPLE VIEW IN MOBILE SCREEN ----------- */}
      <span className="hidden md:block">
        <div className="col-span-1 bg-white py-10 px-5 flex items-center justify-center rounded-md h-full ">
          {" "}
          <div className=" border-2 border-zinc-400 rounded-xl h-[450px] w-[260px] p-2 ">
            <div className="border border-zinc-400 rounded-xl size-full flex flex-col px-2 py-5">
              {/* --------- ROOT SKELETON WITH PREVIEW IMG & USER INFO ---------- */}
              <RootSkeleton watchedLinks={watchedLinks} />
            </div>
          </div>
        </div>{" "}
      </span>
      <div className="col-span-2 bg-white rounded-md">
        <div className="px-5 py-8 space-y-8">
          {/* ------- TITLE ------- */}
          <div>
            <h2 className="text-xl font-bold text-zinc-600 ">
              Customize your links
            </h2>
            <p className="text-xs text-zinc-400">
              Add/edit/remove links below and then share all yur profiles with
              the world!
            </p>
          </div>
          <button
            onClick={handleAddLink}
            type="button"
            disabled={isDisabledAddBtn}
            className={`w-full rounded-md text-bluishPurple text-sm py-1 border font-semibold ${
              isDisabledAddBtn
                ? "bg-zinc-300 border-none cursor-not-allowed "
                : "bg-bluishPurple/10 border-bluishPurple/40 hover:bg-bluishPurple/20 "
            } `}
          >
            + Add new link
          </button>

          {fields.length > 0 ? (
            <DndContext
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(formSubmit)}
                  className="space-y-4 animate-fadeindown "
                >
                  <div className=" h-[350px] sm:h-[500px] overflow-auto space-y-4 ">
                    <SortableContext
                      items={fields.map((singleField) => singleField.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {fields.map((field, index) => (
                        <LinkForm
                          key={field.id}
                          field={field}
                          fields={fields}
                          index={index}
                          handleRemoveLink={handleRemoveLink}
                          setIsDisabledAddBtn={setIsDisabledAddBtn}
                        />
                      ))}
                    </SortableContext>
                  </div>
                  {/* -------- SUBMIT BUTTON ------- */}

                  <hr />
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className=" w-full sm:w-[80px] px-2 py-1 bg-bluishPurple/90 hover:bg-bluishPurple rounded-md text-white"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </FormProvider>
            </DndContext>
          ) : (
            <div className="flex flex-col p-5 items-center justify-center space-y-10 bg-zinc-50 rounded-md ">
              <img src={letsStart} alt="start" className="size-[15rem] " />
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-zinc-600 ">
                  Let's get you started
                </h3>
                <p className="text-zinc-400 text-xs ">
                  Use the "Add new link" button to get started. Once you have
                  more than one link, you can reorder and edit them. We're here
                  to help you share your prottles with everyone!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------ RESPONSE MESSAGE ----------- */}
      {message && <DisplayMessage />}
    </div>
  );
};

export default Links;
