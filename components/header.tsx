"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="pt-12 pb-4 text-center">
      <div className="inline-block mb-4">
        <Image
          src="/logo-tedx-conegliano.svg"
          alt="TEDxConegliano"
          width={320}
          height={40}
          priority
        />
      </div>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginBottom: "4px",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "13px",
            color: pathname === "/" ? "#E62B1E" : "#aaa",
            textDecoration: "none",
            fontWeight: pathname === "/" ? 600 : 400,
            letterSpacing: "0.02em",
            borderBottom: pathname === "/" ? "2px solid #E62B1E" : "2px solid transparent",
            paddingBottom: "2px",
            transition: "color 0.15s, border-color 0.15s",
          }}
        >
          Copy Agent
        </Link>
        <Link
          href="/sheets"
          style={{
            fontSize: "13px",
            color: pathname === "/sheets" ? "#E62B1E" : "#aaa",
            textDecoration: "none",
            fontWeight: pathname === "/sheets" ? 600 : 400,
            letterSpacing: "0.02em",
            borderBottom: pathname === "/sheets" ? "2px solid #E62B1E" : "2px solid transparent",
            paddingBottom: "2px",
            transition: "color 0.15s, border-color 0.15s",
          }}
        >
          Piano Editoriale
        </Link>
      </nav>
    </header>
  );
}
