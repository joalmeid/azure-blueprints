import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as fs from 'fs';
const fsPromises = require('fs').promises
import * as msRestAzure from 'ms-rest-azure';
import { AzureServiceClient } from 'ms-rest-azure';
import { UrlBasedRequestPrepareOptions } from 'ms-rest';
import { CreateBlueprintTaskParameters } from '../azure-devops-models'
import { Blueprint, Artifact, BlueprintsOptions, ArtifactOptions } from '../blueprint-models'

const BLUEPRINT_ARMAPI_VERSION: string = '2018-11-01-preview'

export class BlueprintController {

  private taskParameters: CreateBlueprintTaskParameters;
  private azureClient:AzureServiceClient; 

  constructor(taskParameters: CreateBlueprintTaskParameters) {
    this.taskParameters = taskParameters;
  }

  public async setupAzure(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.azureClient = await this.LoginAzure(this.taskParameters.clientId, this.taskParameters.clientSecret, this.taskParameters.tenantId);
      resolve();
    });
  }

  public createUpgradeBlueprint(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try{
        let clientId = this.taskParameters.clientId;
        let secret = this.taskParameters.clientSecret;
        let domain = this.taskParameters.tenantId;
        let blueprintOption: BlueprintsOptions = {
          managementGroupId: this.taskParameters.managementGroupId,
          subscriptionId: this.taskParameters.subscriptionId,
          resourceGroup: this.taskParameters.resourceGroupName,
          blueprintName: this.taskParameters.blueprintName,
          path: this.taskParameters.blueprintPath
        };

        let newBlueprint: Blueprint = await this.ImportBlueprint(this.azureClient, blueprintOption);

        resolve(true)
      } catch(error) { reject(error); }
    });
  }
  
  private async ImportBlueprint(azureClient:AzureServiceClient, blueprintOption: BlueprintsOptions): Promise<Blueprint> {
    return new Promise<Blueprint>(async (resolve, reject) => {
      try{
        let newBlueprint: Blueprint;
    
        //Blueprints
        let existingBlueprint: Blueprint = await this.GetBlueprint(azureClient, blueprintOption);
        if(existingBlueprint){
          let artifactsDeleted:boolean = await this.DeleteAllBlueprintArtifacts(azureClient, blueprintOption, existingBlueprint);
          if(!artifactsDeleted) reject();
        }
    
        let validatedBlueprintPath: string = await this.GetValidatedFilePathForBlueprint(blueprintOption);
        if(validatedBlueprintPath){
          newBlueprint = await this.CreateUpdateBlueprint(azureClient, blueprintOption, validatedBlueprintPath);
        }
        //Blueprint Artifacts
        let importedArtifacts: Artifact[];
        let validatedblueprintArtifactsPath: string = await this.GetValidatedFilePathForArtifacts(blueprintOption);
        if(validatedblueprintArtifactsPath){
          importedArtifacts = await this.ImportBlueprintArtifacts(azureClient, blueprintOption, validatedblueprintArtifactsPath);
        }
        resolve(newBlueprint);
      } catch(error) { reject(error); }
    });
  }
  
  private async GetBlueprint(azureClient:AzureServiceClient, blueprintOption: BlueprintsOptions): Promise<Blueprint> {
    return new Promise<Blueprint>(async (resolve, reject) => {
      try{
        let targetScope = blueprintOption.managementGroupId ? `https://management.azure.com/subscriptions/${blueprintOption.subscriptionId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}?api-version=${BLUEPRINT_ARMAPI_VERSION}` : 
        `https://management.azure.com/providers/Microsoft.Management/managementGroups/${blueprintOption.managementGroupId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}?api-version=${BLUEPRINT_ARMAPI_VERSION}`;
        let options: UrlBasedRequestPrepareOptions = {
              method: 'GET',
              url: targetScope,
              serializationMapper: null,
              deserializationMapper: null
          };

        let request = await azureClient.sendRequest(options, (err, result: Blueprint, request, response) => {
            if (err) {
              tl.debug(tl.loc("AzureRESTRequestError", err.message));
              reject(tl.loc("AzureRESTRequestError", err.message));
            } else if (response.statusCode==404) {
              tl.debug(tl.loc("AzureBlueprintNotFound"));
              resolve();
            } else if (response.statusCode!==200) {
              tl.debug(tl.loc("AzureBlueprintNotFound"));
              resolve(null);
            } else {
              tl.debug(tl.loc("AzureBlueprintFound", result.id, result.name, result.type));
              resolve (result);
            }
        });
      } catch(error) { reject(error); }
    });
  }
  
  private async DeleteAllBlueprintArtifacts(azureClient:AzureServiceClient, blueprintOption: BlueprintsOptions, curBlueprint: Blueprint): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let targetScope = blueprintOption.managementGroupId ? `https://management.azure.com/providers/Microsoft.Management/managementGroups/${blueprintOption.managementGroupId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}?api-version=${BLUEPRINT_ARMAPI_VERSION}` : 
          `https://management.azure.com/subscriptions/${blueprintOption.subscriptionId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}?api-version=${BLUEPRINT_ARMAPI_VERSION}`;
        let options: UrlBasedRequestPrepareOptions = {
          method: 'DELETE',
          url: targetScope,
          serializationMapper: null,
          deserializationMapper: null
        };
    
        let request = await azureClient.sendRequest(options, (err, result, request, response) => {
          if (err) {
            tl.debug(tl.loc("AzureRESTRequestError", err.message));
            reject(tl.loc("AzureRESTRequestError", err.message));
          } else if (response.statusCode!==200) {
            tl.debug(tl.loc("AzureBlueprintFailedDelete"));
            reject(tl.loc("AzureBlueprintFailedDelete"));
          } else {
            tl.debug(tl.loc("AzureBlueprintDeleted", curBlueprint.id));
            resolve(true);
          }
        });
      } catch(error) { reject(error); }
    });
  }
  
  private async CreateUpdateBlueprint(azureClient:AzureServiceClient, blueprintOption: BlueprintsOptions, blueprintPath: string): Promise<Blueprint> {
    return new Promise<Blueprint>(async (resolve, reject) => {
      try {
        fs.readFile(blueprintPath, 'utf8', async (err, data) => {
          if (err) throw err;
          let blueprint:string = data.toString();
    
          let targetScope = blueprintOption.managementGroupId ? `https://management.azure.com/providers/Microsoft.Management/managementGroups/${blueprintOption.managementGroupId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}?api-version=${BLUEPRINT_ARMAPI_VERSION}` : 
            `https://management.azure.com/subscriptions/${blueprintOption.subscriptionId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}?api-version=${BLUEPRINT_ARMAPI_VERSION}`;
          let options: UrlBasedRequestPrepareOptions = {
            method: 'PUT',
            url: targetScope,
            serializationMapper: null,
            deserializationMapper: null,
            headers: { 'Content-Type': 'application/json' },
            body: blueprint,
            disableJsonStringifyOnBody: true
          };
    
          let request = await azureClient.sendRequest(options, (err, result: Blueprint, request, response) => {
            if (err) {
              tl.debug(tl.loc("AzureRESTRequestError", err.message));
              reject(tl.loc("AzureRESTRequestError", err.message));
            } else if (response.statusCode!==201) {
              tl.debug(tl.loc("AzureBlueprintNotCreated"));
              reject(tl.loc("AzureBlueprintNotCreated"));
            } else {
              console.log(tl.loc("AzureBlueprintCreated", result.id, result.name, result.type));
              resolve(result);
            }
          });
        });
      } catch(error) { reject(error); }
    });
  }
  
  private async ImportBlueprintArtifacts(azureClient:AzureServiceClient, blueprintOption: BlueprintsOptions, artifactsPath: string): Promise<Artifact[]> {
    return new Promise<Artifact[]>(async (resolve, reject) => {
      let artifactList: Artifact[] = [];
      let artifactFiles: string[]

      try {
        artifactList = [];
        artifactFiles = await fsPromises.readdir(artifactsPath);
    
        await Promise.all(artifactFiles.map( async (artifactFilePath) => {
          let artifactOption: ArtifactOptions = {
            name: artifactFilePath.split("/").pop().substring(0,artifactFilePath.indexOf('.')),
            path: path.join(artifactsPath, artifactFilePath)
          };
          let bpArtifact: Artifact = await this.ImportBlueprintArtifact(azureClient, blueprintOption, artifactOption);
          artifactList.push(bpArtifact);
        }));
        resolve(artifactList);
      } catch(error) { 
        console.log(`1: ${fsPromises}`);
        console.log(`2: ${JSON.stringify(fsPromises)}`);
        console.log(`3: ${artifactFiles}`);
        console.log(`4: ${JSON.stringify(artifactFiles)}`);
        reject(error); 
      }
    });
  }
  
  private async ImportBlueprintArtifact(azureClient:AzureServiceClient, blueprintOption: BlueprintsOptions, artifactOption: ArtifactOptions): Promise<Artifact> {
    return new Promise<Artifact>(async (resolve, reject) => {
      try {
        let curArtifactFile = await fsPromises.readFile(artifactOption.path, 'utf8');
    
        let targetScope = blueprintOption.managementGroupId ? `https://management.azure.com/providers/Microsoft.Management/managementGroups/${blueprintOption.managementGroupId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}/artifacts/${artifactOption.name}?api-version=${BLUEPRINT_ARMAPI_VERSION}` : 
          `https://management.azure.com/subscriptions/${blueprintOption.subscriptionId}/providers/Microsoft.Blueprint/blueprints/${blueprintOption.blueprintName}/artifacts/${artifactOption.name}?api-version=${BLUEPRINT_ARMAPI_VERSION}`;
        let options: UrlBasedRequestPrepareOptions = {
          method: 'PUT',
          url: targetScope,
          serializationMapper: null,
          deserializationMapper: null,
          headers: { 'Content-Type': 'application/json' },
          body: curArtifactFile,
          disableJsonStringifyOnBody: true
        };
    
        let request = await azureClient.sendRequest(options, (err, result: Artifact, request, response) => {
          if (err) {
            tl.debug(tl.loc("AzureRESTRequestError", err.message));
            reject(tl.loc("AzureRESTRequestError", err.message));
        } else if (response.statusCode!==201) {
            tl.debug(tl.loc("AzureBlueprintArtifactNotCreated", artifactOption.name));
            reject(tl.loc("AzureBlueprintArtifactNotCreated", artifactOption.name));
          } else {
            console.log(tl.loc("AzureBlueprintArtifactCreated", artifactOption.name));
            resolve(result);
          }
        });
      } catch(error) { reject(error); }
    });
  }
  
  private async GetValidatedFilePathForBlueprint(blueprintOption: BlueprintsOptions): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let blueprintFileName: string = path.join(blueprintOption.path, 'blueprint.json');

        await fs.readFile(blueprintFileName, 'utf8', (error, data) => {
          if (error) {
            tl.debug(tl.loc("BlueprintNotValid", blueprintFileName));
            reject(error);
          }
          let bpContent = JSON.parse(data);
          resolve(blueprintFileName);
        });
      } catch(error) { reject(error); }
    });
  }
  
  private async GetValidatedFilePathForArtifacts(blueprintOption: BlueprintsOptions): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let artifactsFolderPath: string = path.join(blueprintOption.path, 'artifacts');
        await fs.access(artifactsFolderPath, fs.constants.R_OK, (error) => {
          if (error) {
            tl.debug(tl.loc("BlueprintArtifactNotValid", artifactsFolderPath));
            reject(error);
          }
          resolve(artifactsFolderPath);
        });
      } catch(error) { reject(error); }
    });
  }
  
  private async LoginAzure(clientId: string, secret: string, domain: string): Promise<AzureServiceClient> {
    return new Promise<AzureServiceClient>(async (resolve, reject) => {
      try{
        await msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, (err, creds) => {
          if (err) {
            tl.debug(tl.loc("AzureRESTAuthenticationError", err.message));
            reject(tl.loc("AzureRESTAuthenticationError", err.message));
          }
          resolve(new AzureServiceClient(creds, {}));
        });
      } catch(error) { reject(error); }
  });
  }
}