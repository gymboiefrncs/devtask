import { markFeatureAsDoneService } from "../../services/features.services.js";

export const markAsDone = (featId: string) => {
  const res = markFeatureAsDoneService(featId);
  if (!res.success) {
    console.error(res.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`feature with id (${featId}) is marked as done`);
};
