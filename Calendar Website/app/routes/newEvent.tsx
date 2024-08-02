import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import NavBar from "~/navbar";

import { createEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const startStr = formData.get("start");
  const endStr = formData.get("end");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { description: null, title: "Title is required", start: null, end: null } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { description: "Description is required", title: null, start: null, end: null } },
      { status: 400 }
    );
  }

  if (typeof startStr !== "string" || startStr.length === 0) {
    return json(
      { errors: { description: null, title: null, start: "Start date is required", end: null } },
      { status: 400 }
    );
  }

  if (typeof endStr !== "string" || endStr.length === 0) {
    return json(
      { errors: { description: null, title: null, start: null, end: "End date is required" } },
      { status: 400 }
    );
  }

  const start = new Date(startStr);
  const end = new Date(endStr);

  // Validate the date conversion
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return json(
      { errors: { description: null, title: null, start: "Invalid start date", end: "Invalid end date" } },
      { status: 400 }
    );
  }

  const event = await createEvent({ title, description, start, end, userId });

  return redirect(`/notes/${event.id}`);
};

export default function NewEventPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.start) {
      startRef.current?.focus();
    } else if (actionData?.errors?.end) {
      endRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
    <NavBar />
    <div className="flex flex-row items-center justify-center pt-8 px-5 bg-white">
     
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-black px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={actionData?.errors?.title ? "title-error" : undefined}
          />
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={4}
            className="w-full flex-1 rounded-md border-2 border-black px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={actionData?.errors?.description ? "description-error" : undefined}
          />
        </label>
        {actionData?.errors?.description ? (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData.errors.description}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Start Date: </span>
          <input
            ref={startRef}
            name="start"
            type="datetime-local"
            className="flex-1 rounded-md border-2 border-black px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.start ? true : undefined}
            aria-errormessage={actionData?.errors?.start ? "start-error" : undefined}
          />
        </label>
        {actionData?.errors?.start ? (
          <div className="pt-1 text-red-700" id="start-error">
            {actionData.errors.start}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>End Date: </span>
          <input
            ref={endRef}
            name="end"
            type="datetime-local"
            className="flex-1 rounded-md border-2 border-black px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.end ? true : undefined}
            aria-errormessage={actionData?.errors?.end ? "end-error" : undefined}
          />
        </label>
        {actionData?.errors?.end ? (
          <div className="pt-1 text-red-700" id="end-error">
            {actionData.errors.end}
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        className="rounded bg-black px-4 py-2 text-white hover:bg-gray-600 focus:bg-blue-400"
      >
        Create Event
      </button>
    </Form>
    </div>
    </div>
  );
}
