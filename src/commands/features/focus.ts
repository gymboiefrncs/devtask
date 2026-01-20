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
    const unfocusedList = getUnfocusedFeaturesService();
    if (!unfocusedList.success) {
      console.error(unfocusedList.error.message);
      process.exitCode = 1;
      return;
    }
    const { data } = unfocusedList;
    const selectedIds = await promptFocusMultipleFeatures(data);
    if (!selectedIds) {
      console.log("No feature left to focus");
      return;
    }

    const updateResult = focusMultipleFeaturesService(selectedIds);
    if (!updateResult.success) {
      console.error(updateResult.error.message);
      process.exitCode = 1;
      return;
    }

    console.log(`(${updateResult.data.changes}) is focused`);
  } else {
    const focusedList = focusFeatureService(featId);

    if (!focusedList.success) {
      console.error(focusedList.error.message);
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

  const updateResult = unfocusMultipleFeaturesService(ids);
  if (!updateResult.success) {
    console.error(updateResult.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Unfocused (${updateResult.data.changes}) features`);
};
