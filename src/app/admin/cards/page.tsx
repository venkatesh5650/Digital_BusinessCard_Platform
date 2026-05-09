import { getAdminCards } from "@/lib/admin-actions";
import CardDirectoryClient from "./CardDirectoryClient";

export default async function CardDirectoryPage() {
  const cards = await getAdminCards();

  return <CardDirectoryClient initialCards={cards} />;
}
