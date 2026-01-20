import { addNotesService } from "../../services/features.services.js";

export const addNotes = (featId: string, notes: string) => {
  const result = addNotesService(notes, featId);
  if (!result.success) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Notes added to feature ${featId}`);
};
