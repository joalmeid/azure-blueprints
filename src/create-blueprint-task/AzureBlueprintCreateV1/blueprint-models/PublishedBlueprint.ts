import { BlueprintBase, BlueprintTargetScope } from './BlueprintBase';

export class PublishedBlueprint extends BlueprintBase {
  private _version: string;
  private _changeNotes: string;

  constructor(name: string, subscriptionId: string, managementGroupId: string, displayName: string, description: string, targetScope: BlueprintTargetScope) { 
    super(name);
    this.name = name;
    this.subscriptionId = subscriptionId;
    this.managementGroupId = managementGroupId;
    this.displayName = displayName;
    this.description = description;
    this.targetScope = targetScope;
  }

  get version(): string {
    return this._version;
  }

  set version(newVersions: string) {
    this._version = newVersions;
  }

  get changeNotes(): string {
    return this._changeNotes;
  }

  set changeNotes(newChangeNotes: string) {
    this._changeNotes = newChangeNotes;
  }

}
