import { uniqueId } from "lodash-es";

export const UPLOAD_FILE_STATUS = {
  failed: "failed",
  new: "new",
  uploaded: "uploaded",
  uploading: "uploading",
} as const;

export interface UploadFileData {
  name: string;
  /** Optional UI hints for an associated field (password/preview). */
  props?: Record<string, unknown>;
  resource?: string;
  type: "password" | "preview";
  value?: string;
}

export interface UploadFileInitOptions {
  data?: UploadFileData[];
  status?: keyof typeof UPLOAD_FILE_STATUS;
  type?: string;
}

/**
 * Client-side upload item with status tracking.
 *
 * Used by file-input / image-upload UI to represent a selected file and its
 * progress through upload.
 */
export class UploadFile {
  data?: UploadFileData[];
  file: File;
  id: string;
  progress?: [number, number];
  status: keyof typeof UPLOAD_FILE_STATUS;
  type?: string;

  constructor(file: File, { data, status, type }: UploadFileInitOptions = {}) {
    this.file = file;
    this.id = uniqueId("upload_file_");
    this.status = status ?? "new";
    this.data = data;
    this.type = type;
  }
}
