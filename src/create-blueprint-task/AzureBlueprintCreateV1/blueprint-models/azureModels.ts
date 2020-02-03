// export class AzureModels {

//     private connectedServiceName: string;
//     private managementGroupId: string;
//     private managementGroupName: string;
//     private subscriptionId: string;
//     private subscriptionName: string;
//     private resourceGroupName: string;
//     private servicePrincipalClientId: string;
//     private servicePrincipalKey: string;
//     private environmentAuthorityUrl: string;
//     private tenantId: string;
//     private url: string;

//     // joalmeid-axa-gov1 :: 115465be-7e11-4936-aeb4-f78959e16667
//     // joalmeid-axa-gov2 :: 5d33b687-0aa4-42a7-b562-352aa604cde0
//     // joalmeid-internalsubscription :: 255588a0-fd77-4e6f-8455-b24faa4e275c

//     constructor(connectedServiceName: string) {
//         try {
//             this.connectedServiceName = connectedServiceName;
//             if (this.connectedServiceName==='local') { // local debug
// //                this.subscriptionId = task.getInput('subscriptionid', true);
//                 this.managementGroupId = "ext-bp-test-mng";
//                 this.managementGroupName = "ext-bp-test-mng";
//                 this.subscriptionId = "255588a0-fd77-4e6f-8455-b24faa4e275c";
//                 this.subscriptionName = "joalmeid-internalsubscription";
//                 this.resourceGroupName = "ext-bp-test-rg";
//                 this.servicePrincipalClientId = "18f0ec06-2d32-4dc7-8d5c-fdbfe8e2b46a";
//                 this.servicePrincipalKey = "32492198-a421-4151-8383-b11be95a82c6";
//                 this.environmentAuthorityUrl = "";
//                 this.tenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47";
//             } else {
//               this.subscriptionId = "";
//               this.subscriptionName = "";
//               this.managementGroupId = ""
//               this.managementGroupName = ""
//               this.servicePrincipalClientId = "";
//               this.servicePrincipalKey = "";
//               this.environmentAuthorityUrl = "";
//               this.tenantId = "";
//           }
//         }
//         catch(err) {
//             throw new Error(`AzureModels_ConstructorFailed: ${err.message}`);
//         }
//     }

//     public getManagementGroupId(): string {
//       return this.managementGroupId;
//     }

//     public getManagementGroupName(): string {
//         return this.managementGroupName;
//     }

//     public getSubscriptionId(): string {
//         return this.subscriptionId;
//     }

//     public getSubscriptionName(): string {
//         return this.subscriptionName;
//     }

//     public getResourceGroupName(): string {
//       return this.resourceGroupName;
//     }

//     public getServicePrincipalClientId(): string {
//         return this.servicePrincipalClientId;
//     }

//     public getServicePrincipalKey(): string {
//         return this.servicePrincipalKey;
//     }

//     public getEnvironmentAuthorityUrl(): string {
//         return this.environmentAuthorityUrl;
//     }

//     public getTenantId(): string {
//         return this.tenantId;
//     }
// }