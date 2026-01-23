import {
  focusFeatureService,
  getFocusedFeaturesService,
  unfocusFeaturesService,
} from "../../services/features.services.js";

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
  const focusedFeature = getFocusedFeaturesService();
  if (!focusedFeature.ok) {
    console.error(focusedFeature.err.message);
    process.exitCode = 1;
    return;
  }

  const updateResult = unfocusFeaturesService(focusedFeature.data.id);
  if (!updateResult.ok) {
    console.error(updateResult.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Feature with id (${focusedFeature.data.id}) is unfocused`);
};
