import { Suspense } from "react";
import BrowseServices from "./BrowseServices";
import { Loader } from "@/components/Ui";

export const metadata = { title: "Browse Services" };

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowseServices />
    </Suspense>
  );
}
