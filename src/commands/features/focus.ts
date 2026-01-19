import {
  focusFeatureService,
  focusMultipleFeaturesService,
  getUnfocusedFeatures,
  getFocusedFeatures,
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
    const features = getUnfocusedFeatures();
    if (!features.success) {
      console.error(features.error.message);
      process.exitCode = 1;
      return;
    }
    const { data } = features;
    const feats = await promptFocusMultipleFeatures(data);
    if (!feats) {
      console.log("No feature left to focus");
      return;
    }

    const res = focusMultipleFeaturesService(feats);
    if (!res.success) {
      console.error(res.error.message);
      process.exitCode = 1;
      return;
    }

    console.log(`(${res.data.changes}) is focused`);
  } else {
    const feature = focusFeatureService(featId);

    if (!feature.success) {
      console.error(feature.error.message);
      process.exitCode = 1;
      return;
    }
    console.log(`feature with id (${featId}) is focused`);
  }
};

export const unfocusFeatures = async () => {
  const features = getFocusedFeatures();
  if (!features.success) {
    console.error(features.error.message);
    process.exitCode = 1;
    return;
  }
  const { data } = features;
  const feats = await promptUnfocusMultipleFeatures(data);
  if (!feats) {
    console.log("No feature left to focus");
    return;
  }

  const res = unfocusMultipleFeaturesService(feats);
  if (!res.success) {
    console.error(res.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Unfocused (${res.data.changes}) features`);
};
