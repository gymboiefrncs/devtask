import { updateDescriptionService } from "../../services/features.services.js";

export const editDescription = (featId: string, description: string) => {
  const result = updateDescriptionService(description, featId);
  if (!result.success) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Feature ${featId} description updated to: '${description}'`);
};
