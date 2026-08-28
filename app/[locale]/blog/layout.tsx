import type React from "react";
import type { Metadata, ResolvingMetadata } from "next";

type RootLayoutProps = {
  children: React.ReactNode;
};

export async function generateMetadata(
  {}: RootLayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: {
      default: `utities blog`,
      template: `%s | utities blog`,
    },
  };
}

export default async function BlogLayout({ children }: RootLayoutProps) {
  return <>{children}</>;
}
