export const normalizeImageUrl = (value) => (typeof value === "string" ? value.trim() : "");

const collectUrls = (source, { arrayKeys = [], stringKeys = [] } = {}) => {
  const urls = [];

  const pushUrl = (value) => {
    const normalized = normalizeImageUrl(value);
    if (normalized) {
      urls.push(normalized);
    }
  };

  const collectFromGroup = (group) => {
    if (!group) return;

    if (typeof group === "string") {
      pushUrl(group);
      return;
    }

    if (Array.isArray(group)) {
      group.forEach(collectFromGroup);
      return;
    }

    if (typeof group === "object") {
      arrayKeys.forEach((key) => {
        if (Array.isArray(group[key])) {
          group[key].forEach(collectFromGroup);
        }
      });
      stringKeys.forEach((key) => {
        if (typeof group[key] === "string") {
          pushUrl(group[key]);
        }
      });
    }
  };

  collectFromGroup(source);
  return urls;
};

export const collectImageUrls = (source) =>
  collectUrls(source, {
    arrayKeys: ["images", "urls"],
    stringKeys: ["imageUrl", "image_url", "url"],
  });

export const collectThumbnailUrls = (source) =>
  collectUrls(source, {
    arrayKeys: ["images", "urls", "thumbnails", "thumbnailUrls", "thumbnail_urls"],
    stringKeys: ["imageUrl", "image_url", "thumbnailUrl", "thumbnail_url", "url"],
  });
