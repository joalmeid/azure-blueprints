import tl = require("azure-pipelines-task-lib/task");

export class CreateBlueprintTaskParameters {

    // Authentication details
    public connectedServiceName: string;
    public scheme: string;
    public subscriptionId: string; 
    public tenantId: string;
    public clientId?: string;
    public clientSecret?: string;

    // Service connection scope (Management Group or Subscription)
    public serviceConnectionScope: string;
    public managementGroupId: string;
    public resourceGroupName: string;
    public altSubscription: string;
    public altSubscriptionId: string;

    // Blueprint details
    public blueprintName: string;
    public blueprintPath: string;
    public blueprintPublish: boolean;
    public blueprintVersion: string;

    public async getCreateBlueprintTaskParameters() : Promise<CreateBlueprintTaskParameters> {
      this.connectedServiceName = tl.getInput('ConnectedServiceName', true);
      if(this.connectedServiceName==='debug'){ // local debug
        this.subscriptionId = tl.getInput('SubscriptionId', true);
        this.tenantId = tl.getInput('tenantid', true);
        this.clientId = tl.getInput('serviceprincipalid', true);
        this.clientSecret = tl.getInput('serviceprincipalkey', true);
        this.scheme = tl.getInput('scheme', true);
        this.serviceConnectionScope = tl.getInput('scopeLevel', true);
        this.managementGroupId = tl.getInput('managementGroupId', true);
      } else {
        this.subscriptionId = tl.getEndpointDataParameter(this.connectedServiceName, 'SubscriptionId', true);
        this.tenantId = tl.getEndpointAuthorizationParameter(this.connectedServiceName, 'tenantid', true);
        this.clientId = tl.getEndpointAuthorizationParameter(this.connectedServiceName, 'serviceprincipalid', true);
        this.clientSecret = tl.getEndpointAuthorizationParameter(this.connectedServiceName, 'serviceprincipalkey', true);
        this.scheme = tl.getEndpointAuthorizationScheme(this.connectedServiceName, false);
  
        this.serviceConnectionScope = tl.getEndpointDataParameter(this.connectedServiceName, 'scopeLevel', true);
        this.managementGroupId = tl.getEndpointDataParameter(this.connectedServiceName, 'managementGroupId', true);
      }

      this.altSubscription = tl.getInput('AlternateLocation', true);
      this.altSubscriptionId = tl.getInput('AlternateSubscription', false);

      this.blueprintName = tl.getInput('BlueprintName', true);
      this.blueprintPath = tl.getInput('BlueprintPath', true);
      this.blueprintPublish = tl.getBoolInput('BlueprintPublish', true);
      this.blueprintVersion = tl.getInput('Version', true);

      //Print input variables values
      console.debug(tl.loc("ParsedTaskInputsLabel"));
      console.debug(tl.loc("InputsconnectedServiceNameLabel", this.connectedServiceName));
      console.debug(tl.loc("InputsSubscriptionIdLabel", this.subscriptionId));
      console.debug(tl.loc("InputTenantIdLabel", this.tenantId));
      console.debug(tl.loc("InputClientIdLabel", this.clientId));
      console.debug(tl.loc("InputClientSecretLabel", this.clientSecret));
      console.debug(tl.loc("InputSchemeLabel", this.scheme));
      console.debug(tl.loc("InputServiceConnectionScopeLabel", this.serviceConnectionScope));
      console.debug(tl.loc("InputManagementGroupIdLabel", this.managementGroupId));
      console.debug(tl.loc("InputAltSubscriptionLabel", this.altSubscription));
      console.debug(tl.loc("InputAltSubscriptionIdLabel", this.altSubscriptionId));
      console.debug(tl.loc("InputBlueprintNameLabel", this.blueprintName));
      console.debug(tl.loc("InputBlueprintPathLabel", this.blueprintPath));
      console.debug(tl.loc("InputBlueprintPublishLabel", this.blueprintPublish));
      console.debug(tl.loc("InputBlueprintVersionLabel", this.blueprintVersion));
      
      return this;
    }
}

