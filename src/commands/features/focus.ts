import {
  focusAFeatureService,
  focusMultipleFeaureService,
  listAllFeaturesService,
} from "../../services/features.services.js";
import { promptfocusMultipleFeature } from "../../utils/prompts.js";

export const focusAFeature = async (
  featId: string,
  options: { many: boolean }
) => {
  if (options.many) {
    const features = listAllFeaturesService();
    if (!features.success) {
      console.error(features.error.message);
      process.exitCode = 1;
      return;
    }
    const { data } = features;
    const feats = await promptfocusMultipleFeature(data);
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
