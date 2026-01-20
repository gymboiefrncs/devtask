import { removeFeatureService } from "../../services/features.services.js";
import { listAllFeaturesService } from "../../services/features.services.js";
import { promptDeleteFeature } from "../../utils/prompts.js";

export const removeFeature = async () => {
  const features = listAllFeaturesService();
  if (!features.success) {
    console.error(features.error.message);
    process.exitCode = 1;
    return;
  }

  const { data } = features;
  const ids = await promptDeleteFeature(data);
  if (!ids) {
    console.log("No feature left to focus");
    return;
  }

  const result = removeFeatureService(ids);
  if (!result.success) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`(${result.data.changes}) features removed`);
};
