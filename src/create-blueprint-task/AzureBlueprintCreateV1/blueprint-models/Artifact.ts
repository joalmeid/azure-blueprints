export class Artifact extends AzureResourceBase {
}

export enum ArtifactKind {
  RoleAssignmentArtifact = 0,
  PolicyAssignmentArtifact = 1,
  TemplateArtifact = 2
}

