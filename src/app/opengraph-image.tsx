import { ImageResponse } from "next/og";
import { createPublicClient } from "@/lib/supabase/public-client";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
  let name = "Tyron Del Valle";
  let role = "IT Specialist";
  let place = "";
  try {
    const { data } = await createPublicClient().from("about").select("*").maybeSingle();
    if (data) {
      name = data.full_name || name;
      role = data.role_tag || data.headline || role;
      place = data.location || "";
    }
  } catch {
    /* fall back to defaults */
  }
  const host = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "white",
          background: "linear-gradient(135deg, #0b1220 0%, #1e3a8a 100%)",
        }}
      >
        <div style={{ display: "flex", width: 120, height: 8, borderRadius: 4, background: "#3b82f6" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 44, color: "#93c5fd" }}>{role}</div>
          {place ? (
            <div style={{ display: "flex", marginTop: 14, fontSize: 30, color: "#cbd5e1" }}>{place}</div>
          ) : null}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8" }}>{host}</div>
      </div>
    ),
    { ...size },
  );
}
