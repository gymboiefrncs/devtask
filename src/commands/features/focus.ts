import {
  focusAFeatureService,
  focusMultipleFeaureService,
  unfocusedFeatures,
  focusedFeatures,
  unfocusMultipleFeaureService,
} from "../../services/features.services.js";
import {
  promptfocusMultipleFeature,
  promptunfocusMultipleFeature,
} from "../../utils/prompts.js";

export const focusAFeature = async (
  featId: string,
  options: { many?: boolean }
) => {
  if (options.many) {
    const features = unfocusedFeatures();
    if (!features.success) {
      console.error(features.error.message);
      process.exitCode = 1;
      return;
    }
    const { data } = features;
    const feats = await promptfocusMultipleFeature(data);
    if (!feats) {
      console.log("No feature left to focus");
      return;
    }

    const res = focusMultipleFeaureService(feats);
    if (!res.success) {
      console.error(res.error.message);
      process.exitCode = 1;
      return;
    }

    console.log(`(${res.data.changes}) is focused`);
  } else {
    const feature = focusAFeatureService(featId);

    if (!feature.success) {
      console.error(feature.error.message);
      process.exitCode = 1;
      return;
    }
    console.log(`feature with id (${featId}) is focused`);
  }
};

export const unfocusFeatures = async () => {
  const features = focusedFeatures();
  if (!features.success) {
    console.error(features.error.message);
    process.exitCode = 1;
    return;
  }
  const { data } = features;
  const feats = await promptunfocusMultipleFeature(data);
  if (!feats) {
    console.log("No feature left to focus");
    return;
  }

  const res = unfocusMultipleFeaureService(feats);
  if (!res.success) {
    console.error(res.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Unfocused (${res.data.changes}) features`);
};
