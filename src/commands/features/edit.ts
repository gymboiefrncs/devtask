import { updateDescriptionService } from "../../services/features.services.js";

export const editDescription = (featId: string, description: string) => {
  const updatedFeature = updateDescriptionService(description, featId);
  if (!updatedFeature.success) {
    console.error(updatedFeature.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Project ${featId} name updated to: '${description}'`);
};
