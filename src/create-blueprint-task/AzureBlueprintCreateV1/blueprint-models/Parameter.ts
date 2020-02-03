export class ParameterDefinition {
  public type: string;
  public displayName: any;
  public description: string;
  public strongType?: string;
  public defaultValue?: any;
  public AllowedValues?: any
}

export class ParameterValueBase {
  public description: string;
}

export class ParameterValue extends ParameterValueBase {
  public value: any;
}
