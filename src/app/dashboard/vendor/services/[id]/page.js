"use client";
import { useParams } from "next/navigation";
import { useApi } from "@/lib/hooks";
import ServiceForm from "@/components/ServiceForm";
import { PageTitle, Loader, ErrorBox } from "@/components/Ui";

export default function Page() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(`/api/services/${id}`);
  return (
    <>
      <PageTitle title="Edit Service" />
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : <ServiceForm initial={data} />}
    </>
  );
}
