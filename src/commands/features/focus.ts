import {
  focusFeatureService,
  focusMultipleFeaturesService,
  getUnfocusedFeaturesService,
  getFocusedFeaturesService,
  unfocusMultipleFeaturesService,
} from "../../services/features.services.js";
import {
  promptFocusMultipleFeatures,
  promptUnfocusMultipleFeatures,
} from "../../utils/prompts.js";

export const focusFeature = async (
  featId: string,
  options: { many?: boolean },
) => {
  if (options.many) {
    const unfocusedFeatures = getUnfocusedFeaturesService();
    if (!unfocusedFeatures.success) {
      console.error(unfocusedFeatures.error.message);
      process.exitCode = 1;
      return;
    }
    const { data } = unfocusedFeatures;
    const ids = await promptFocusMultipleFeatures(data);
    if (!ids) {
      console.log("No feature left to focus");
      return;
    }

    const result = focusMultipleFeaturesService(ids);
    if (!result.success) {
      console.error(result.error.message);
      process.exitCode = 1;
      return;
    }

    console.log(`(${result.data.changes}) is focused`);
  } else {
    const focusedFeatures = focusFeatureService(featId);

    if (!focusedFeatures.success) {
      console.error(focusedFeatures.error.message);
      process.exitCode = 1;
      return;
    }
    console.log(`feature with id (${featId}) is focused`);
  }
};

export const unfocusFeatures = async () => {
  const focusedFeatures = getFocusedFeaturesService();
  if (!focusedFeatures.success) {
    console.error(focusedFeatures.error.message);
    process.exitCode = 1;
    return;
  }
  const { data } = focusedFeatures;
  const ids = await promptUnfocusMultipleFeatures(data);
  if (!ids) {
    console.log("No feature left to unfocus");
    return;
  }

  const result = unfocusMultipleFeaturesService(ids);
  if (!result.success) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Unfocused (${result.data.changes}) features`);
};
