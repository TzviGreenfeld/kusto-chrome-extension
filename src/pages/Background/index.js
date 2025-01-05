chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.method === 'POST') {
      if (details.requestBody) {
        const decoder = new TextDecoder('utf-8');
        const body = details.requestBody.raw
          ? decoder.decode(details.requestBody.raw[0].bytes)
          : '{}'; // default to empty JSON object if no body

        try {
          const parsedBody = JSON.parse(body);

          // Check if `csl` and `db` exist in the body
          if (parsedBody.csl && parsedBody.db) {
            const query = parsedBody.csl;

            // Retrieve existing data from storage
            chrome.storage.local.get('executedQueries', (data) => {
              const executedQueries = data.executedQueries || {};

              // Remove old data, if it exists
              if (
                executedQueries[query] &&
                typeof executedQueries[query] !== 'object'
              ) {
                delete executedQueries[query];
                console.log(`Deleted old data for query '${query}'`);
              }
              ///

              // Update query count
              if (executedQueries[query]) {
                executedQueries[query].count += 1;
                executedQueries[query].lastExecution = new Date().toISOString();
                console.log(
                  `OLD Query '${query}' updated. Used executedQueries[query]`,
                  executedQueries[query]
                );
              } else {
                executedQueries[query] = {
                  count: 1,
                  lastExecution: new Date().toISOString(),
                };
                console.log(
                  `NEW Query '${query}' saved. Used executedQueries[query]`,
                  executedQueries[query]
                );
              }

              // Save updated data back to storage
              chrome.storage.local.set({ executedQueries }, () => {});
            });
          }
        } catch (e) {
          console.error('Failed to parse POST body:', e);
        }
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);
