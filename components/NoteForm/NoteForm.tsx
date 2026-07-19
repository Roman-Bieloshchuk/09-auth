"use client";

import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { createNote } from "@/lib/api/clientApi";
import type { CreateNoteInput } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";

import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNoteInput) => createNote(newNote),

    onSuccess: async () => {
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      toast.success("Note created successfully!");

      router.push("/notes/filter/all");
    },

    onError: () => {
      toast.error("Failed to create note.");
    },
  });

  const formAction = (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    if (title.length < 3) {
      toast.error("Title must contain at least 3 characters.");
      return;
    }

    if (title.length > 50) {
      toast.error("Title cannot exceed 50 characters.");
      return;
    }

    if (content.length > 500) {
      toast.error("Content cannot exceed 500 characters.");
      return;
    }

    createMutation.mutate({
      title,
      content,
      tag,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          name="title"
          defaultValue={draft.title}
          minLength={3}
          maxLength={50}
          required
          className={css.input}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setDraft({
              title: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={draft.content}
          maxLength={500}
          className={css.textarea}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setDraft({
              content: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          className={css.select}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setDraft({
              tag: event.target.value as NoteTag,
            });
          }}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
