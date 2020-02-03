import { Artifact } from "./Artifact";

export class RoleAssignmentArtifact extends Artifact {
  public displayName: string;
  public description: string;
  public dependsOn: string[];
  public roleDefinitionId: string;
  public principleIds: any;
  public resourceGroup: string;
}

