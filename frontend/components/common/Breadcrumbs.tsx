"use client";

import Link from "next/link";
import { useBreadcrumbs } from "@/utils/getBreadcrumbs"; // adjust path if needed

export default function Breadcrumbs() {
  const items = useBreadcrumbs();

  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-2">
        {items.map((crumb, index) => (
          <li key={index} className="flex items-center">
            <Link
              href={crumb.url}
              className="hover:underline text-blue-600 font-medium"
            >
              {crumb.title}
            </Link>
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
