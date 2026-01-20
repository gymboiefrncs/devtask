import { removeFeatureService } from "../../services/features.services.js";
import { listAllFeaturesService } from "../../services/features.services.js";
import { promptDeleteFeature } from "../../utils/prompts.js";

export const removeFeature = async () => {
  const listResult = listAllFeaturesService();
  if (!listResult.success) {
    console.error(listResult.error.message);
    process.exitCode = 1;
    return;
  }

  const { data } = listResult;
  const selectedids = await promptDeleteFeature(data);
  if (!selectedids) {
    console.log("No feature left to focus");
    return;
  }

  const removeResult = removeFeatureService(selectedids);
  if (!removeResult.success) {
    console.error(removeResult.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`(${removeResult.data.changes}) features removed`);
};
