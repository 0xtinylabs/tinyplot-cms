import { ReactNode } from "react";

export const metadata = {
  title: "TinyPlot CMS - Files Management",
  description: "Manage AI and i18n files",
};

export default function FilesLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
