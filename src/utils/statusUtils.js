/**
 * Returns the CSS module class for a given status badge.
 * Pass the `styles` object from the relevant SCSS module.
 *
 * @param {string} status - The status string (e.g. "completed", "processing")
 * @param {object} styles - CSS module styles object
 */
export const normalizeStatus = (status) => {
  const value = (status || "").toLowerCase().trim();
  if (!value) return "processing";

  if (value.includes("fail") || value.includes("error") || value.includes("cancelled") || value.includes("canceled")) {
    return "failed";
  }
  if (value.includes("complete") || value.includes("success")) {
    return "completed";
  }
  if (value.includes("queue") || value.includes("pending") || value.includes("waiting")) {
    return "queued";
  }
  if (value.includes("process") || value.includes("in_progress") || value.includes("running") || value.includes("generat")) {
    return "processing";
  }

  return value;
};

export const getStatusLabel = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "completed") return "Completed";
  if (normalized === "processing") return "Processing";
  if (normalized === "failed") return "Failed";
  if (normalized === "queued") return "Queued";

  if (!status) return "Processing";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getStatusBadgeClass = (status, styles) => {
  switch (normalizeStatus(status)) {
    case "completed": return styles.chipCompleted;
    case "processing": return styles.chipProcessing;
    case "failed": return styles.chipFailed;
    case "queued": return styles.chipQueued;
    default: return styles.chip;
  }
};

/**
 * Returns an inline SVG icon element matching the given status.
 * @param {string} status
 */
export const getStatusIcon = (status) => {
  const s = normalizeStatus(status);
  if (s === "completed") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (s === "queued") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
    );
  }
  if (s === "processing") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
  }
  if (s === "failed") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};
