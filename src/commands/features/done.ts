import {
  listAllFeaturesService,
  markFeatureAsDoneService,
} from "../../services/features.services.js";
import { updateProjectStatus } from "../../utils/updateProjectStatus.js";

export const markAsDone = (featId: string) => {
  const res = markFeatureAsDoneService(featId);
  if (!res.success) {
    console.error(res.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`feature with id (${featId}) is marked as done`);

  const features = listAllFeaturesService();
  if (!features.success) {
    console.error(features.error.message);
    process.exitCode = 1;
    return;
  }
  if (!features.data.length) {
    console.log("No features found for this project!");
    return;
  }

  // update project status if all features are done
  updateProjectStatus(features.data);
};
