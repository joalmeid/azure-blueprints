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
      this.connectedServiceName = tl.getInput("ConnectedServiceName", true);
      this.subscriptionId = tl.getEndpointDataParameter(this.connectedServiceName, "SubscriptionId", true);
      this.tenantId = tl.getEndpointAuthorizationParameter(this.connectedServiceName, 'tenantid', true);
      this.clientId = tl.getEndpointAuthorizationParameter(this.connectedServiceName, 'serviceprincipalid', false);
      this.clientSecret = tl.getEndpointAuthorizationParameter(this.connectedServiceName, 'serviceprincipalkey', false);
      this.scheme = tl.getEndpointAuthorizationScheme(this.connectedServiceName, false);

      this.serviceConnectionScope = tl.getEndpointDataParameter(this.connectedServiceName, "scopeLevel", true);
      this.managementGroupId = tl.getEndpointDataParameter(this.connectedServiceName, "managementGroupId", true);
      this.altSubscription = tl.getInput("AlternateLocation", true);
      this.altSubscriptionId = tl.getInput("AlternateSubscription", false);

      this.blueprintName = tl.getInput("BlueprintName", true);
      this.blueprintPath = tl.getInput("BlueprintPath", true);
      this.blueprintPublish = tl.getBoolInput("BlueprintPublish", true);
      this.blueprintVersion = tl.getInput("Version", true);

      //Print input variables values
      console.log(tl.loc("InputsconnectedServiceNameLabel", this.connectedServiceName));
      console.log(tl.loc("InputsSubscriptionIdLabel", this.subscriptionId));
      console.log(tl.loc("InputTenantIdLabel", this.tenantId));
      console.log(tl.loc("InputClientIdLabel", this.clientId));
      console.log(tl.loc("InputClientSecretLabel", this.clientSecret));
      console.log(tl.loc("InputSchemeLabel", this.scheme));
      console.log(tl.loc("InputServiceConnectionScopeLabel", this.serviceConnectionScope));
      console.log(tl.loc("InputManagementGroupIdLabel", this.managementGroupId));
      console.log(tl.loc("InputAltSubscriptionLabel", this.altSubscription));
      console.log(tl.loc("InputAltSubscriptionIdLabel", this.altSubscriptionId));
      console.log(tl.loc("InputBlueprintNameLabel", this.blueprintName));
      console.log(tl.loc("InputBlueprintPathLabel", this.blueprintPath));
      console.log(tl.loc("InputBlueprintPublishLabel", this.blueprintPublish));
      console.log(tl.loc("InputBlueprintVersionLabel", this.blueprintVersion));

      // tl.debug(tl.loc("InputsconnectedServiceNameLabel", connectedService));
      // tl.debug(tl.loc("InputsSubscriptionIdLabel", this.subscriptionId));
      // tl.debug(tl.loc("InputTenantIdLabel", this.tenantId));
      // tl.debug(tl.loc("InputClientIdLabel", this.clientId));
      // tl.debug(tl.loc("InputClientSecretLabel", this.clientSecret));
      // tl.debug(tl.loc("InputSchemeLabel", this.scheme));
      // tl.debug(tl.loc("InputServiceConnectionScopeLabel", this.serviceConnectionScope));
      // tl.debug(tl.loc("InputManagementGroupIdLabel", this.managementGroupId));
      // tl.debug(tl.loc("InputAltSubscriptionLabel", this.altSubscription));
      // tl.debug(tl.loc("InputAltSubscriptionIdLabel", this.altSubscriptionId));
      // tl.debug(tl.loc("InputBlueprintNameLabel", this.blueprintName));
      // tl.debug(tl.loc("InputBlueprintPathLabel", this.blueprintPath));
      // tl.debug(tl.loc("InputBlueprintPublishLabel", this.blueprintPublish));
      // tl.debug(tl.loc("InputBlueprintVersionLabel", this.blueprintVersion));
      
      return this;
    }
}

