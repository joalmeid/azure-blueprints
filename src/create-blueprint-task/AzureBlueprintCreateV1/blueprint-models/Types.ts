export interface Dictionary<T> {
  [Key: string]: T;
}

export interface BlueprintsOptions {
  managementGroupId: string,
  subscriptionId: string,
  resourceGroup: string,
  blueprintName: string,
  path: string
}

export interface ArtifactOptions {
  name: string,
  path: string,
}