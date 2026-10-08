"use client";

import { useEffect, useState } from "react";

export function usePhotoUrl(photo: Blob | null): string {
  const [source, setSource] = useState<{ photo: Blob; url: string } | null>(null);

  useEffect(() => {
    if (!photo) {
      setSource(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setSource({ photo, url });
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  return source?.photo === photo ? source.url : "";
}
