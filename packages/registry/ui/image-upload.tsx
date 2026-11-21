/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import { useState, type ChangeEvent } from "react";
import { compressImage } from "@wo-library/web";

import { cn } from "@/lib/cn";

export interface ImageUploadProps {
  onFile: (file: File) => void;
  accept?: string;
  compress?: boolean;
  className?: string;
  label?: string;
}

/** File input that optionally shrinks images via `@wo-library/web`. */
export function ImageUpload({
  accept = "image/*",
  className,
  compress = true,
  label = "Choose image",
  onFile,
}: ImageUploadProps) {
  const [busy, setBusy] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setBusy(true);
    try {
      const next = compress ? await compressImage(file) : file;
      onFile(next);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-light",
        busy && "opacity-60",
        className,
      )}
    >
      {busy ? "Processing…" : label}
      <input
        accept={accept}
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          void handleChange(event);
        }}
        type="file"
      />
    </label>
  );
}
