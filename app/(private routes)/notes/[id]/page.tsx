import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const OG_IMAGE = {
  url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  width: 1200,
  height: 630,
  alt: "NoteHub note preview",
};

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;

  const shortContent =
    note.content.length > 100
      ? `${note.content.slice(0, 100)}...`
      : note.content;

  const description =
    shortContent || `View the note "${note.title}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/${id}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
