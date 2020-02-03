import { BlueprintBase, BlueprintTargetScope } from './BlueprintBase';

export class Blueprint extends BlueprintBase {
  private _versions: string[];

  constructor(name: string, subscriptionId: string, managementGroupId: string, displayName: string, description: string, targetScope: BlueprintTargetScope) { 
    super(name);
    this.name = name;
    this.subscriptionId = subscriptionId;
    this.managementGroupId = managementGroupId;
    this.displayName = displayName;
    this.description = description;
    this.targetScope = targetScope;
  }

  get versions(): string[] {
    return this._versions;
  }

  set versions(newVersions: string[]) {
    this._versions = newVersions;
  }

}
