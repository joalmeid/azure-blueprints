import { ManagedServiceIdentity } from './ManagedServiceIdentity';
import { BlueprintStatus, BlueprintTargetScope , ResourceGroupDefinitions } from './BlueprintBase';
import { ParameterDefinition } from './Parameter';

export class BlueprintAssignment extends AzureResourceBase {
  public location: string;
  public scope: string;
  public identity: ManagedServiceIdentity;
  public displayName: string;
  public description: BlueprintStatus;
  public blueprintId: BlueprintTargetScope;
  public parameters: ParameterDefinition;
  public resourceGroups: ResourceGroupDefinitions;
  public status: AssignmentStatus;
  public lockSettings: AssignmentLockSettings;
  public provisioningState: AssignmentProvisioningState;

  constructor(name: string) {
    super(name);
  }
}

export class AssignmentStatus extends BlueprintResourceStatusBase {
}

export class AssignmentLockSettings extends BlueprintResourceStatusBase {
  public mode: LockMode;
}

export enum LockMode
{
  None = 0,
  AllResourcesReadOnly = 1,
  AllResourcesDoNotDelete = 2
}

export enum AssignmentProvisioningState
  {
    Unknown = 0,
    Creating = 1,
    Validating = 2,
    Waiting = 3,
    Deploying = 4,
    Cancelling = 5,
    Locking = 6,
    Succeeded = 7,
    Failed = 8,
    Canceled = 9,
    Deleting = 10
  }
