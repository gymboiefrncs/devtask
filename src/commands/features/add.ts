import {
  addFeatureService,
  addMultipleFeatureService,
} from "../../services/features.services.js";
import { addFeatures } from "../../utils/prompts.js";

export const addFeature = async (
  description: string,
  options: { many: boolean }
) => {
  if (options.many) {
    const ans = await addFeatures();
    const features = addMultipleFeatureService(ans);
    if (!features.success) {
      console.error(features.error.message);
      process.exitCode = 1;
      return;
    }

    console.log(`(${features.data.changes}) Feature added`);
  } else {
    const feature = addFeatureService(description);
    if (!feature.success) {
      console.error(feature.error.message);
      process.exitCode = 1;
      return;
    }
    console.log(`(${feature.data.changes}) Feature added`);
  }
};
