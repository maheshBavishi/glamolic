/**
 * Returns the CSS module class for a given status badge.
 * Pass the `styles` object from the relevant SCSS module.
 *
 * @param {string} status - The status string (e.g. "completed", "processing")
 * @param {object} styles - CSS module styles object
 */
export const getStatusBadgeClass = (status, styles) => {
  switch ((status || "").toLowerCase()) {
    case "completed": return styles.chipCompleted;
    case "processing": return styles.chipProcessing;
    case "failed": return styles.chipFailed;
    case "queued": return styles.chipQueued;
    default: return styles.chip;
  }
};
