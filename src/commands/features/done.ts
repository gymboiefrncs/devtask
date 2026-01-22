import {
  listAllFeaturesService,
  markFeatureAsDoneService,
} from "../../services/features.services.js";
import { updateProjectStatus } from "../../utils/updateProjectStatus.js";

export const markAsDone = (featId: string) => {
  const markResult = markFeatureAsDoneService(featId);
  if (!markResult.ok) {
    console.error(markResult.err.message);
    process.exitCode = 1;
    return;
  }

  console.log(`feature with id (${featId}) is marked as done`);

  const featuresList = listAllFeaturesService();
  if (!featuresList.ok) {
    console.error(featuresList.err.message);
    process.exitCode = 1;
    return;
  }
  if (!featuresList.data.length) {
    console.log("No features found for this project!");
    return;
  }

  // update project status if all features are don
  updateProjectStatus(featuresList.data);
};
