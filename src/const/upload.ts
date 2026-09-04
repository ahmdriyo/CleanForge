export const MAX_UPLOAD_FILE_SIZE_MB = 5;
export const MAX_UPLOAD_FILE_SIZE = MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024;

export const isValidUploadFileSize = ({ size }: { size: number }) =>
  size > 0 && size <= MAX_UPLOAD_FILE_SIZE;
