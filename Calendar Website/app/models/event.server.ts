import { Event, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function getEvent({
  id,
  userId,
}: Pick<Event, "id"> & { userId: User["id"] }) {
  return prisma.event.findFirst({
    select: { id: true, title: true, description: true, start: true, end: true },
    where: { id, userId },
  });
}

export function getEventListItems({ userId }: { userId: User["id"] }) {
  return prisma.event.findMany({
    where: { userId },
    select: { id: true, title: true, start: true, end: true },
    orderBy: { start: "asc" }, 
  });
}

export function createEvent({
  title,
  description,
  start,
  end,
  userId,
}: Pick<Event, "title" | "description" | "start" | "end"> & {
  userId: User["id"];
}) {
  return prisma.event.create({
    data: {
      title,
      description,
      start,
      end,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteEvent({
  id,
  userId,
}: Pick<Event, "id"> & { userId: User["id"] }) {
  return prisma.event.deleteMany({
    where: { id, userId },
  });
}
