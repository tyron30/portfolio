"use client";

import { SingletonForm } from "@/components/shared/singleton-form";
import { aboutSchema, type About } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "full_name", label: "Full Name", type: "text", required: true },
  {
    name: "role_tag",
    label: "Role Tag (short)",
    type: "text",
    hint: "1-3 words max, e.g. 'IT Specialist' — this renders HUGE on the Hero as \"I'M AN ___\"",
  },
  {
    name: "headline",
    label: "Headline (longer)",
    type: "text",
    hint: "A full sentence is fine — shown as the smaller tagline under the Hero, and as your bio intro.",
  },
  {
    name: "profile_image_url",
    label: "Hero Image",
    type: "image",
    bucket: "profile",
    hint: "Used in the big Hero photo at the top of the page.",
  },
  {
    name: "about_image_url",
    label: "About Section Image",
    type: "image",
    bucket: "profile",
    hint: "A different photo for the \"Hello, I'm...\" section — separate from the Hero image above.",
  },
  { name: "bio", label: "Biography", type: "textarea" },
  {
    name: "key_skills",
    label: "Key Skills",
    type: "tags",
    hint: "Broader competencies NOT already listed in Tech Stack — e.g. Network Administration, IT Security Awareness, Customer Service. Don't repeat named tools/technologies here (those belong in Tech Stack).",
  },
  { name: "birthdate", label: "Birthdate (MM/DD/YYYY)", type: "text", hint: "Example: 05/04/2001. Only your age is shown on the site, never the date." },
  { name: "location", label: "Location", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "years_experience", label: "Years of Experience", type: "number" },
  { name: "projects_completed", label: "Projects Completed", type: "number" },
];

export default function AboutPage() {
  return (
    <SingletonForm<About>
      title="About Me"
      description="This content powers the About section and stats grid on the public site."
      table="about"
      queryKey="about"
      fields={fields}
      schema={aboutSchema}
    />
  );
}
