import type { Note, NoteTag } from "@/types/note";

import { api } from "./api";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tag: NoteTag;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface UpdateUserData {
  username: string;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: search || undefined,
      tag: tag || undefined,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (noteData: CreateNoteInput): Promise<Note> => {
  const response = await api.post<Note>("/notes", noteData);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
};

export const register = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);

  return response.data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>("/auth/login", credentials);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User | null>("/auth/session");

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const updateMe = async (data: UpdateUserData): Promise<User> => {
  const response = await api.patch<User>("/users/me", data);

  return response.data;
};
