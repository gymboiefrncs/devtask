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
  const feats = await promptDeleteFeature(data);
  if (!feats) {
    console.log("No feature left to focus");
    return;
  }

  const res = removeFeatureService(feats);
  if (!res.success) {
    console.error(res.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`(${res.data.changes}) features removed`);
};
