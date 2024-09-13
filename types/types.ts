import { Group, Membership } from "@prisma/client";

export interface MembershipWithGroups extends Membership {
  group: Group;
}
