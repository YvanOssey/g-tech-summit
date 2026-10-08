/** Speaker photos live in the public Supabase Storage bucket "speakers". */
export const SPEAKER_BUCKET = "speakers";

export function speakerPhotoUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${SPEAKER_BUCKET}/${encodeURIComponent(path)}`;
}
