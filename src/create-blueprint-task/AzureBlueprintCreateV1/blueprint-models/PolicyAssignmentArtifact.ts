import { Artifact } from "./Artifact";
import { ParameterValueBase } from "./Parameter";
import { Dictionary } from "./Types";

export class PolicyAssignmentArtifact extends Artifact {
  public displayName: string;
  public description: string;
  public dependsOn: string[];
  public policyDefinitionId: string;
  public parameters: Dictionary<ParameterValueBase>;
  public resourceGroup: string;

}
