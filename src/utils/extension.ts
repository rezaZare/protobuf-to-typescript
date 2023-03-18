export function getFileName(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}
