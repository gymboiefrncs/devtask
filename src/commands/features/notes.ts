import { addNotesService } from "../../services/features.services.js";

export const addNotes = (featId: string, notes: string) => {
  const note = addNotesService(notes, featId);
  if (!note.success) {
    console.error(note.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Notes added to feature ${featId}`);
};
