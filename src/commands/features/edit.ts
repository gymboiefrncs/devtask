import { updateDescriptionService } from "../../services/features.services.js";

export const editDescription = (featId: string, description: string) => {
  const updateResult = updateDescriptionService(description, featId);
  if (!updateResult.ok) {
    console.error(updateResult.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Feature ${featId} description updated to: '${description}'`);
};
