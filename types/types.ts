import { Group, Invite, Membership, User } from "@prisma/client";

export interface MembershipWithGroups extends Membership {
  group: Group;
}

export interface InviteWithGroupAndUser extends Invite {
  group: Group;
  sender: User;
}
