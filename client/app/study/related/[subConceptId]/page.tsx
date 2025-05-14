import { useParams } from "next/navigation";
import RelatedProblemsComponent from "@/components/RelatedProblemsComponent";

export default function RelatedProblemsPage() {
  const { subConceptId } = useParams();
  return <RelatedProblemsComponent subConceptId={subConceptId} />;
} 