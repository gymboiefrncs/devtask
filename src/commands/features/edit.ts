import { updateDescriptionService } from "../../services/features.services.js";

export const editDescription = (featId: string, description: string) => {
  const updateResult = updateDescriptionService(description, featId);
  if (!updateResult.success) {
    console.error(updateResult.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Feature ${featId} description updated to: '${description}'`);
};
