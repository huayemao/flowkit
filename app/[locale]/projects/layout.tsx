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
      default: `utities projects`,
      template: `%s | utities.online projects`,
    },
  };
}

export default async function ProjectsLayout({ children }: RootLayoutProps) {
  return <>{children}</>;
}
