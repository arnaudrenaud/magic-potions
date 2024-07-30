"use client";

import { ElementWithIcon } from "@/components/ElementWithIcon";
import { Blend, BookOpen, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const ITEM_PROPERTIES = [
    {
      path: "/",
      icon: <Blend />,
      label: "Composition",
      shortLabel: "Composition",
    },
    {
      path: "/discoveries",
      icon: <BookOpen />,
      label: "Découvertes",
      shortLabel: "Découvertes",
    },
    {
      path: "/inventory",
      icon: <Package />,
      label: "Inventaire",
      shortLabel: "Inventaire",
    },
  ];

  const currentPath = usePathname();
  return (
    <>
      <nav className="fixed z-10 left-0 right-0 bottom-0 flex bg-background [padding-bottom:var(--safe-area-inset-bottom)] border-t lg:right-auto lg:[top:0] lg:flex-col lg:border-0 lg:border-r">
        {ITEM_PROPERTIES.map(({ path, icon, label, shortLabel }) => {
          return (
            <Link
              href={path}
              className={`rounded-none flex-1 h-auto p-2 justify-center items-center bg-transparent hover:text-muted-foreground focus-visible:ring ring-primary ring-inset focus-visible:ring-offset-0 outline-none lg:flex-initial lg:px-6 lg:py-5 lg:justify-start lg:items-start ${
                currentPath === path ? "text-primary hover:text-primary" : ""
              }`}
            >
              <ElementWithIcon
                icon={icon}
                className="flex flex-col lg:flex-row"
              >
                <div className="text-xs sm:hidden">{shortLabel}</div>
                <div className="hidden text-xs sm:block lg:text-base">
                  {label}
                </div>
              </ElementWithIcon>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
