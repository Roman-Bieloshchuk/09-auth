"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";

import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal isOpen onClose={handleClose}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal isOpen onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal isOpen onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>

          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>

          <p className={css.date}>
            {new Intl.DateTimeFormat("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            }).format(new Date(note.createdAt))}
          </p>

          <button type="button" className={css.backBtn} onClick={handleClose}>
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
}
