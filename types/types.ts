import { Group, Invite, Membership, User } from "@prisma/client";

export interface MembershipWithGroups extends Membership {
  group: Group;
}

export interface MembershipWithUsers extends Membership {
  user: User;
}

export interface InviteWithGroupAndUser extends Invite {
  group: Group;
  sender: User;
}

export interface GroupWithMembershipsAndUsers extends Group {
  memberships: MembershipWithUsers[];
}

export interface MembershipWithUsersAndGroup extends Membership {
  user: User;
  group: Group;
}

export interface SubmissionData {
  username: string;
  submissions: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };
}
