import ProfileSettingsView from "./_components/profile-settings-view";
import { UserService } from "@/services/user.service";

export default async function ProfilePage() {
  const user = await UserService.profile();

  return <ProfileSettingsView initialUser={user} />;
}
