"use client";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default function HeroScrollLink({ href, className, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (!href.startsWith("#")) return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}
