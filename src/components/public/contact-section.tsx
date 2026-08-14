"use client";

import { useActionState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "@/app/(public)/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";

interface ContactSectionProps {
  contactInfo: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    map_lat?: number | null;
    map_lng?: number | null;
  } | null;
}

const initialState: ContactFormState = {};

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  return (
    <section id="contact" className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Get In <span className="text-gradient">Touch</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
          Have a project in mind or just want to say hi? My inbox is open.
        </p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-2">
        <Reveal className="space-y-4">
          {contactInfo?.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="glass flex items-center gap-3 rounded-xl p-4 transition-colors hover:border-primary"
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm">{contactInfo.email}</span>
            </a>
          )}
          {contactInfo?.phone && (
            <div className="glass flex items-center gap-3 rounded-xl p-4">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm">{contactInfo.phone}</span>
            </div>
          )}
          {contactInfo?.address && (
            <div className="glass flex items-center gap-3 rounded-xl p-4">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm">{contactInfo.address}</span>
            </div>
          )}

          {contactInfo?.map_lat && contactInfo?.map_lng && (
            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title="Location map"
                width="100%"
                height="200"
                loading="lazy"
                className="border-0"
                src={`https://www.google.com/maps?q=${contactInfo.map_lat},${contactInfo.map_lng}&z=14&output=embed`}
              />
            </div>
          )}
        </Reveal>

        {state.success ? (
          <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="font-medium">Message sent — thank you!</p>
            <p className="text-sm text-muted-foreground">I&apos;ll get back to you as soon as I can.</p>
          </div>
        ) : (
          <Reveal delay={0.15}>
            <form action={formAction} className="space-y-4">
              <FormField label="Name" htmlFor="sender_name" required>
                <Input id="sender_name" name="sender_name" required />
              </FormField>
              <FormField label="Email" htmlFor="sender_email" required>
                <Input id="sender_email" name="sender_email" type="email" required />
              </FormField>
              <FormField label="Subject" htmlFor="subject">
                <Input id="subject" name="subject" />
              </FormField>
              <FormField label="Message" htmlFor="body" required error={state.error}>
                <Textarea id="body" name="body" rows={5} required />
              </FormField>
              <Magnetic className="block w-full">
                <Button type="submit" variant="gradient" className="w-full" disabled={isPending}>
                  {isPending ? "Sending…" : "Send Message"}
                </Button>
              </Magnetic>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
