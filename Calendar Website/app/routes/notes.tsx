import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import React, { useState } from 'react';
import { Calendar, momentLocalizer, SlotInfo, Event as RBCEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { useNavigate } from "@remix-run/react";

import { getEventListItems } from "~/models/event.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { link } from "fs";
import NavBar from "~/navbar";
const localizer = momentLocalizer(moment);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const eventListItems = await getEventListItems({ userId });
 
  return json({ eventListItems });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  // const [events, setEvents] = useState<RBCEvent[]>(data.eventListItems.map(event => ({
  //   title: event.title,
  //   start: new Date(event.start),
  //   end: new Date(event.end),
  //   allDay: false
  // })));
  const events = data.eventListItems.map((event) => ({
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: false
  }))
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: new Date(), end: new Date() });
  const [selectedEvent, setSelectedEvent] = useState<RBCEvent | null>(null);

  const navigate = useNavigate();
  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    // setNewEvent({ title: '', description: '', start: new Date(start), end: new Date(end) });
    // setModalIsOpen(true);
    navigate('/newEvent', {
      state: {
          start: start,
          end: end,
      },
  });
  };

  const handleEventSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const eventWithUser = { ...newEvent, createdBy: user.email };
    const response = await fetch("/events/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventWithUser),
    });
    const result = await response.json();
    if (response.ok) {
     // setEvents([...events, { ...result, start: new Date(result.start), end: new Date(result.end), allDay: false }]);
      setModalIsOpen(false);
    }
  };

  const handleEventClick = (event: RBCEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <NavBar />

      <main className="flex h-full bg-white">
        <div className="h-full w-80 bg-white">
          <Link to="/newEvent" className="block p-4 block border text-xl text-black shadow-sm hover:bg-blue-50">
            + New Event
          </Link>
         

          <hr />

          {data.eventListItems.length === 0 ? (
            <p className="p-4">No events yet</p>
          ) : (
            <ol>
              {data.eventListItems.map((event) => (
                <li key={event.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl text-orange-100 ${isActive ? "bg-white" : ""}`
                    }
                    to={{
                        pathname: `${event.id}`,
                      }}
                  >
                    📝 {event.title }
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
          
          <div style={styles.calendarContainer}>
            
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, margin: '50px' }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleEventClick}
            />
          </div>

          <Modal isOpen={modalIsOpen || selectedEvent !== null} onRequestClose={closeModal}>
            {selectedEvent ? (
              <div>
                <h2>{selectedEvent.title}</h2>
                <p><strong>Description:</strong> {selectedEvent.title}</p>
                <p><strong>Start:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><strong>End:</strong> {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <button onClick={closeModal}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleEventSubmit}>
                <h2>Create New Event</h2>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <textarea
                  placeholder="Event Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
                <button type="submit">Create Event</button>
              </form>
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}

const styles = {
  calendarContainer: {
    margin: '50px',
  },
};