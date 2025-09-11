import UserAvatarMenu from "@/components/UserAvatarMenu";
import RequireAuth from "@/components/RequireAuth";

export default function LockerRoom() {
  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Locker Room</h1>
          <UserAvatarMenu size={48} />
        </div>
      </main>
    </RequireAuth>
  );
}
