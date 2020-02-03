import { ParameterDefinition } from './Parameter';

export abstract class BlueprintBase extends AzureResourceBase {
  private _scope: string;
  private _subscriptionId: string;
  private _managementGroupId: string;
  private _displayName: string;
  private _description: string;
  private _location: string;
  private _status: BlueprintStatus;
  private _targetScope: BlueprintTargetScope;
  private _parameters: ParameterDefinition;
  private _resourceGroups: ResourceGroupDefinitions;

  get scope(): string {
    return this._scope;
  }

  get subscriptionId(): string {
    return this._subscriptionId;
  }

  get managementGroupId(): string {
    return this._managementGroupId;
  }

  get displayName(): string {
    return this._displayName;
  }

  get description(): string {
    return this._description;
  }

  get location(): string {
    return this._location;
  }

  get status(): BlueprintStatus {
    return this._status;
  }

  get targetScope(): BlueprintTargetScope {
    return this._targetScope;
  }

  get parameters(): ParameterDefinition {
    return this._parameters;
  }

  get resourceGroups(): ResourceGroupDefinitions {
    return this._resourceGroups;
  }

  set scope(newScope: string) {
    // if (newName && newName.length > fullNameMaxLength) {
    //     throw new Error("fullName has a max length of " + fullNameMaxLength);
    // }
    this._scope = newScope;
  }

  set subscriptionId(newSubscriptionId: string) {
    this._subscriptionId = newSubscriptionId;
  }

  set managementGroupId(newManagementGroupId: string) {
    this._managementGroupId = newManagementGroupId;
  }

  set displayName(newDisplayName: string) {
    this._displayName = newDisplayName;
  }

  set description(newDescription: string) {
    this._description = newDescription;
  }

  set location(newLocation: string) {
    this._location = newLocation;
  }

  set status(newStatus: BlueprintStatus) {
    this._status = newStatus;
  }

  set targetScope(newTargetScope: BlueprintTargetScope) {
    this._targetScope = newTargetScope;
  }

  set parameters(newParameters: ParameterDefinition) {
    this._parameters = newParameters;
  }

  set resourceGroups(newResourceGroups: ResourceGroupDefinitions) {
    this._resourceGroups = newResourceGroups;
  }
}

export enum BlueprintTargetScope
{
    Unknown = 0,
    Subscription = 1
}


export class ResourceGroupDefinitions {
  name: string;
  location: string;
  displayName: string;
  description: string;
  stringType?: string;
  dependsOn?: string[];
}

export class BlueprintStatus extends BlueprintResourceStatusBase{
}


