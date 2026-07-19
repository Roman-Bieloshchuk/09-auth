import { cookies } from "next/headers";

import type { Note } from "@/types/note";

import { api } from "./api";

import type { User } from "@/types/user";

import type { AxiosResponse } from "axios";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore.toString();
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: search || undefined,
      tag: tag || undefined,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const checkServerSession = async (): Promise<
  AxiosResponse<User | null>
> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User | null>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response;
};
