import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteEvent, getEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "eventId nurrt found");

  const event = await getEvent({ id: parseInt(params.noteId), userId }); // Convert eventId to number
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  
  const userId = await requireUserId(request);
  invariant(params.noteId, "eventId test found");

  await deleteEvent({ id: parseInt(params.noteId), userId }); // Convert eventId to number

  return redirect("/notes");
};

export default function EventDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const error = useRouteError();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.event.title}</h3>
      {data.event.description && <p className="py-6">{data.event.description}</p>}
      <hr className="my-4" />
      <Form method="post" action={`/notes/${data.event.id}?_method=DELETE`}>
        <button
          type="submit"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>Something went wrong</h1>
      
    </div>
  );
}
