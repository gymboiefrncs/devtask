import {
  focusFeatureService,
  getFocusedFeaturesService,
  unfocusMultipleFeaturesService,
} from "../../services/features.services.js";
import { promptUnfocusMultipleFeatures } from "../../utils/prompts.js";

export const focusFeature = async (featId: string) => {
  const focusedList = focusFeatureService(featId);

  if (!focusedList.ok) {
    console.error(focusedList.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(`feature with id (${featId}) is focused`);
};

export const unfocusFeatures = async () => {
  const focusedFeatures = getFocusedFeaturesService();
  if (!focusedFeatures.ok) {
    console.error(focusedFeatures.err.message);
    process.exitCode = 1;
    return;
  }
  const { data } = focusedFeatures;
  const ids = await promptUnfocusMultipleFeatures(data);
  if (!ids) {
    console.log("No feature left to unfocus");
    return;
  }

  const updateResult = unfocusMultipleFeaturesService(ids);
  if (!updateResult.ok) {
    console.error(updateResult.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Unfocused (${updateResult.data.changes}) features`);
};
