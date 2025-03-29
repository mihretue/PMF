// utils/getBreadcrumbs.ts or inside your layout file

// import Link from "next/link";
import { usePathname } from "next/navigation";

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbMap: Record<string, { title: string; url: string }> = {
    dashboard: { title: "Dashboard", url: "/admin/dashboard" },
    profile: { title: "Profile", url: "/profile" },
    settings: { title: "Settings", url: "/settings" },
    // ✅ Add more routes as needed
  };

  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";

  const breadcrumbs = [
    {
      title: "Home",
      url: "/",
    },
  ];

  for (const segment of segments) {
    currentPath += `/${segment}`;
    if (breadcrumbMap[segment]) {
      breadcrumbs.push({
        title: breadcrumbMap[segment].title,
        url: breadcrumbMap[segment].url,
      });
    } else {
      // fallback to capitalized segment if not mapped
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        url: currentPath,
      });
    }
  }

  return breadcrumbs;
}
