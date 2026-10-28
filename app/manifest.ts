import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Maruti Fabrication", short_name: "Maruti", start_url: "/en/", display: "standalone", background_color: "#f4f2ec", theme_color: "#202622" };
}
