"use server";

import { createClient } from "@/lib/supabase/server";
import { contactMessageSchema } from "@/lib/validations/cms";

export type ContactFormState = {
  error?: string;
  success?: boolean;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse({
    sender_name: formData.get("sender_name"),
    sender_email: formData.get("sender_email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ ...parsed.data, status: "unread" });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
