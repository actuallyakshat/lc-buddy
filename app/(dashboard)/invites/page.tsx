import { currentUser } from "@clerk/nextjs/server";
import IncomingInvites from "./_components/IncomingInvites";
import OutgoingRequests from "./_components/OutgoingRequests";
import { getAllInvites } from "../group/[groupId]/_actions/friends-actions";

export default async function Invites() {
  const user = await currentUser();
  const response = await getAllInvites({ userId: user!.id });
  const allInvites = response.data;
  if (!response.success) return <div>Error</div>;
  if (!allInvites) return <div>Error</div>;
  return (
    <div className="px-16 pt-12">
      <h1 className="text-3xl font-bold">Incoming Invites</h1>
      <p className="text-sm font-medium text-muted-foreground">
        Invitations you have received to join accountability groups
      </p>
      <IncomingInvites invites={allInvites} userId={user!.id} />
      <OutgoingRequests invites={allInvites} userId={user!.id} />
    </div>
  );
}
