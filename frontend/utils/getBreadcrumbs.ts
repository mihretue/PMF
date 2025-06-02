// utils/useBreadcrumbs.ts
import { usePathname } from "next/navigation";
import { validRoutes } from "./validRoutes ";

export function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = [
    { title: "Home", url: "/", isLink: true },
  ];

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      title: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")),
      url: currentPath,
      isLink: validRoutes.includes(currentPath),
    });
  }

  return breadcrumbs;
}
