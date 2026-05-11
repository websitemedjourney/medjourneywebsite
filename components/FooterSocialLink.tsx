"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

type Icon = NonNullable<ComponentProps<typeof HugeiconsIcon>["icon"]>;

export type FooterSocialLinkProps = {
  href: string;
  ariaLabel: string;
  lead: string;
  title: string;
  icon: Icon;
};

export function FooterSocialLink({
  href,
  ariaLabel,
  lead,
  title,
  icon,
}: FooterSocialLinkProps) {
  return (
    <a href={href} aria-label={ariaLabel} className="flex items-center gap-2">
      <HugeiconsIcon
        icon={icon}
        className="hidden md:block w-10 h-10"
        strokeWidth={2}
      />
      <div className="flex min-w-0 flex-col items-start justify-start max-md:items-end">
        <p className="w-fit">{lead}</p>
        <p className="text-xl font-bold">{title}</p>
      </div>
      <HugeiconsIcon
        icon={icon}
        className="block md:hidden w-10 h-10"
        strokeWidth={2}
      />
    </a>
  );
}
