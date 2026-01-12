import { addFeatureService } from "../../services/features.services.js";

export const addFeature = (description: string) => {
  const feature = addFeatureService(description);
  if (!feature.success) {
    console.error(feature.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`(${feature.data.changes}) Feature added`);
};
