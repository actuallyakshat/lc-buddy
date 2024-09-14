import { InviteWithGroupAndUser } from "@/types/types";
import InviteCard from "./InviteCard";

export default function OutgoingRequests({
  invites,
  userId,
}: {
  invites: InviteWithGroupAndUser[];
  userId: string;
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold">Outgoing Requests</h2>
      <p className="text-sm font-medium text-muted-foreground">
        Requests you have sent to other users
      </p>
      <div className="mt-4">
        {invites
          .filter((invite) => invite.senderId == userId)
          .map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              type="outgoing"
              userId={userId}
            />
          ))}
        {invites!.length == 0 && (
          <p className="mt-5 text-sm font-medium text-muted-foreground">
            You have no outgoing invites {":("}
          </p>
        )}
      </div>
    </div>
  );
}
