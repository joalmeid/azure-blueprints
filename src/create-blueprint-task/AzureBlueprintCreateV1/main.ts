import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as fs from 'fs';

import { CreateBlueprintTaskParameters } from './azure-devops-models'
import { BlueprintController } from './operations'

async function run(): Promise<void> {

    try {
        var taskManifestPath = path.join(__dirname, "task.json");
        tl.debug("Setting resource path to " + taskManifestPath);
        tl.setResourcePath(taskManifestPath);

        var blueprintParameters = new CreateBlueprintTaskParameters();
        var taskParameters = await blueprintParameters.getCreateBlueprintTaskParameters();

        console.log(tl.loc("ParsedTaskInputsLabel"));
        var blueprintController = new BlueprintController(taskParameters);
        await blueprintController.setupAzure();
        await blueprintController.createUpgradeBlueprint();

        tl.setResult(tl.TaskResult.Succeeded, "");
    }
    catch(error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();