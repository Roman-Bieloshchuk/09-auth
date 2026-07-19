import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import { getQueryClient } from "@/lib/queryClient";
import { fetchNotes } from "@/lib/api/serverApi";

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

const OG_IMAGE = {
  url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  width: 1200,
  height: 630,
  alt: "NoteHub application preview",
};

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const rawTag = slug[0] ?? "all";
  const filterName = rawTag === "all" ? "All" : rawTag;

  const title = `${filterName} notes | NoteHub`;
  const description =
    rawTag === "all"
      ? "Browse all notes in NoteHub."
      : `Browse notes filtered by the ${filterName} tag in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${rawTag}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const { slug } = await params;
  const { page = "1", search = "" } = await searchParams;

  const rawTag = slug[0];
  const tag = rawTag === "all" ? undefined : rawTag;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes(Number(page), 12, search, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
