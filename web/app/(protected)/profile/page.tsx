import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getCurrentUser } from "@/components/actions/user";
import { ProfileForm } from "@/components/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/sign-in");
  }

  const user = await getCurrentUser(session.accessToken);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Failed to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <ProfileForm user={user} />
    </div>
  );
}
