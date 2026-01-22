import {
  addFeatureService,
  addMultipleFeatureService,
} from "../../services/features.services.js";
import { addFeatures } from "../../utils/prompts.js";

export const addFeature = async (
  description: string,
  options: { many: boolean },
) => {
  const addResult = options.many
    ? addMultipleFeatureService(await addFeatures())
    : addFeatureService(description);

  if (!addResult.ok) {
    console.error(addResult.err.message);
    process.exitCode = 1;
    return;
  }

  const { changes } = addResult.data;
  const label = changes === 1 ? "Features" : "Features";
  console.log(`(${changes}) ${label} added`);
};
