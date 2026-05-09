import { getAdminUsers } from "@/lib/admin-actions";
import UserManagementClient from "./UserManagementClient";

export default async function UserManagementPage() {
  const users = await getAdminUsers();

  return <UserManagementClient initialUsers={users} />;
}
