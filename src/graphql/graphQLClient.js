import { GraphQLClient } from "graphql-request";

const createFetchWithTimeout = (timeout = 5000) => {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const signal = init.signal || controller.signal;

    const timerId = setTimeout(() => {
      if (!init.signal) controller.abort();
    }, timeout);

    try {
      return await fetch(input, {
        ...init,
        signal,
        cache: "no-store",
      });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timerId);
    }
  };
};

export const graphcms = new GraphQLClient(process.env.NEXT_PUBLIC_CMS_BASE_URL, {
  cache: "no-store",
  fetch: createFetchWithTimeout(5000),
});
