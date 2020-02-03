import { UserAssignedIdentity } from "./UserAssignedIdentity";

export class ManagedServiceIdentity {
  public type: string;
  public principalId: string;
  public tenantId: string;
  public userAssignedIdentities: UserAssignedIdentity;

  constructor() { 
  }
}
