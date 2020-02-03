import { Artifact } from "./Artifact";
import { ParameterValueBase } from "./Parameter";
import { Dictionary } from "./Types";

export class TemplateArtifact extends Artifact {
  public displayName: string;
  public description: string;
  public dependsOn: string[];
  public template: any;
  public parameters: Dictionary<ParameterValueBase>;
  public resourceGroup: string;
}

