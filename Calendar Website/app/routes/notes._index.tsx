import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { getEventListItems } from "~/models/event.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import React, { useState } from 'react';
import { Calendar, momentLocalizer, SlotInfo, Event as RBCEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const eventListItems = await getEventListItems({ userId });
  return json({ eventListItems });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const [events, setEvents] = useState<RBCEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: new Date(), end: new Date() });
  const [selectedEvent, setSelectedEvent] = useState<RBCEvent | null>(null);

  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    setNewEvent({ title: '', description: '', start: new Date(start), end: new Date(end) });
    setModalIsOpen(true);
  };

  const handleEventSubmit = () => {
    const eventWithUser = { ...newEvent, createdBy: user.email };
    setEvents([...events, eventWithUser]);
    setModalIsOpen(false);
  };

  const handleEventClick = (event: RBCEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

}
