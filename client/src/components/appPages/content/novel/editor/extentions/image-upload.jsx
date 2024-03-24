import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const promise = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-image`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!promise.ok) {
    const text = await promise.text();
    throw new Error(text);
  }
  const data = await promise.json();
  return data.url;

  //This should return a src of the uploaded image
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
