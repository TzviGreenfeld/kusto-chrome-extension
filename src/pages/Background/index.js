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

            console.log('query:', query);

            // Retrieve existing data from storage
            chrome.storage.local.get('executedQueries', (data) => {
              const executedQueries = data.executedQueries || {};

              // Update query count
              if (executedQueries[query]) {
                executedQueries[query]++;
              } else {
                executedQueries[query] = 1;
              }

              // Save updated data back to storage
              chrome.storage.local.set({ executedQueries }, () => {
                console.log(
                  `Query '${query}' saved. Used ${executedQueries[query]} times.`
                );
              });
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
