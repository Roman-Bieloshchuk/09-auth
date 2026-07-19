"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Link from "next/link";

import { fetchNotes } from "@/lib/api/clientApi";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";

  const [inputValue, setInputValue] = useState(search);

  const perPage = 12;

  const basePath = `/notes/filter/${tag ?? "all"}`;

  const updateParams = (newPage: number, newSearch: string) => {
    const params = new URLSearchParams();

    if (newPage > 1) params.set("page", String(newPage));
    if (newSearch) params.set("search", newSearch);

    const queryString = params.toString();

    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  };

  const debouncedHandler = useDebouncedCallback((value: string) => {
    updateParams(1, value);
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedHandler(value);
  };

  const handlePageChange = (newPage: number) => {
    updateParams(newPage, search);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", String(page), search, tag],
    queryFn: () => fetchNotes(page, perPage, search, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <main className={css.container}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {notes.length > 0 && !isLoading && <NoteList notes={notes} />}
      </main>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
