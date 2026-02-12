import { uniqueId } from "lodash-es";

import type { TextInputProps } from "../components/atoms/TextInput/TextInput.js";

export const UPLOAD_FILE_STATUS = {
  failed: "failed",
  new: "new",
  uploaded: "uploaded",
  uploading: "uploading",
} as const;

export interface UploadFileData {
  name: string;
  props?: Partial<TextInputProps>;
  resource?: string;
  type: "password" | "preview";
  value?: string;
}

export interface UploadFileInitOptions {
  data?: UploadFileData[];
  status?: keyof typeof UPLOAD_FILE_STATUS;
  type?: string;
}

export default class UploadFile {
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
