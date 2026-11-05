"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof NextLink>, "href"> & {
  to: string;
  hash?: string;
  search?: Record<string, string>;
  activeOptions?: { exact?: boolean };
};

export function Link({ to, hash, search, activeOptions, ...props }: Props) {
  const pathname = usePathname();
  const query = search ? `?${new URLSearchParams(search)}` : "";
  const href = `${to}${query}${hash ? `#${hash}` : ""}`;
  const active = activeOptions?.exact ? pathname === to : pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));
  return <NextLink {...props} href={href} data-status={active ? "active" : undefined} />;
}
