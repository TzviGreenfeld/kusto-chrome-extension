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

// example request:
// fetch("https://idsharedwus.kusto.windows.net/v2/rest/query", {
//   "headers": {
//     "accept": "application/json",
//     "accept-language": "en-US,en;q=0.9",
//     "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJyaCI6IjEuQW84RHY0ajVjdkdHcjBHUnF5MTgwQkhiUjNmcVJpY0NSMFZMZ01vOGwtYUE2TGNhQU0yUEF3LiIsImFsZyI6IlJTMjU2IiwieDV0IjoiejFyc1lISEo5LThtZ2d0NEhzWnU4QktrQlB3Iiwia2lkIjoiejFyc1lISEo5LThtZ2d0NEhzWnU4QktrQlB3In0.eyJhdWQiOiJodHRwczovL2t1c3RvLmt1c3RvLndpbmRvd3MubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImlhdCI6MTczNTQ4NjAxMywibmJmIjoxNzM1NDg2MDEzLCJleHAiOjE3MzU0OTA3NzgsImFjciI6IjEiLCJhaW8iOiJBWlFBYS84WUFBQUF6T2ZlK2EyTlI0Qks3QU5OaEFRbVJJM1ZITitqeHJTZlN4aUZuMjdRTzdJcVQyRjdveUZRR3RGSVJ3UENxRTlOcmxFSENjc1J4aFZSWXNKenJhVGVydUVzQ1lDL0xyR2xGU3ZBVzI0dm9sVDNaS2FQRXkwZ1FDVWozSnZYSldySDBYVzY5cnJ0Vk1pL1M3bXU4RUM5NURDVytBNXdSVERwZkthMFNQQzRhS1hydER0N3R5RTRxRnZBWUxKSlJEd1IiLCJhbXIiOlsiZmlkbyIsInJzYSIsIm1mYSJdLCJhcHBpZCI6ImY5ODE4ZTUyLTUwYmQtNDYzZS04OTMyLWExNjUwYmQzZmFkMiIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiYWNlZWRhZjktZDljYi00MTU2LThhYTAtNmU1YjMxYjg3MDJiIiwiZmFtaWx5X25hbWUiOiJHcmVlbmZlbGQiLCJnaXZlbl9uYW1lIjoiVHp2aSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjIwLjEwNy41LjE2NyIsIm5hbWUiOiJUenZpIEdyZWVuZmVsZCIsIm9pZCI6IjM2MjM5M2M3LTE2N2QtNGE5Zi1iZGYxLTRmOTc3ZTcwNTYxYiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMTI3NTIxMTg0LTE2MDQwMTI5MjAtMTg4NzkyNzUyNy03NjkzMTA0OCIsInB1aWQiOiIxMDAzMjAwMzgxMTYwM0RDIiwicmgiOiJJIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiNDBjNmMzZjMtZWNlNi00OWJiLTkxYzMtMGY2Mjc3Zjc0MjA1Iiwic3ViIjoicTRuSTJXcXFpV2hTX04tLWFYVlJBVWFyV2VjX01zODZXLUpybi10cHN1WSIsInRlbmFudF9jdHJ5IjoiVVMiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiV1ciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InRncmVlbmZlbGRAbWljcm9zb2Z0LmNvbSIsInVwbiI6InRncmVlbmZlbGRAbWljcm9zb2Z0LmNvbSIsInV0aSI6IkQ2cjFjS0FmUWthOVpqYjdmUGdCQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiIxMiAxIiwieG1zX3BkbCI6IkVVUiJ9.BjQtKQEAxZx2dugrHtfPte67-cp30AIMrB2CtzUWr8hdP0CUebvRfuSa4AFUvLxqzz-Hl9GqWAcqkJlQo-AeFhPQ5fzrcsdy_tZUAEY8z_EjuX_WnSJaOOFxRstj3cDphdgT9wOJHey19NipqrvJi01dyg_3vUv9HLvOv2HQyCUPCQVpVv3JC1Pjpk-PFyO4g4k43u-9hyEqhpJiumEPiN5C6hPDnCK-BrsGH4cBbVkNN2gdop1krWP6yzVGedw05Fv2uA7QD4SMf_00T-pgpFlwtfVMMTYNWMfnznvm9okurRzWu7IqvUCDw9f_LDIuqq3AEFfDe8I_QDSZqaItdg",
//     "content-type": "application/json; charset=UTF-8",
//     "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "cross-site",
//     "x-ms-app": "Kusto.Web.KWE:2.174.0-7",
//     "x-ms-client-request-id": "Kusto.Web.KWE.Query;776825dc-ace0-4587-a752-bd1614497333;95603f3a-b289-482e-953b-7b575bbcb06a",
//     "x-ms-user-id": "Tzvi_Greenfeld"
//   },
//   "referrer": "https://kusto.azure.com/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"db\":\"NaasAgentServicesApsProd\",\"csl\":\"UASyncOperationEvent\\n| where TIMESTAMP > ago(30d)\\n| where TenantId in (\\n    \\\"8d48781e-597b-4e92-bf87-d2e8de356130\\\",\\n    \\\"fa9a3f29-8104-4985-8a52-62aba97b887a\\\",\\n    \\\"750e3f1d-9f3a-4168-b5ae-dcbd4ae8a865\\\",\\n    \\\"e96aabc6-8501-4886-9808-8094546e854d\\\",\\n    \\\"0c97c915-f6f2-4d1c-b825-4b75fc560f7c\\\",\\n    \\\"aaf55a78-4288-4808-895f-269999474191\\\",\\n    \\\"d5d9a12d-3b75-4bda-86dc-5576fdbd64a8\\\"\\n    )\\n// | where SyncStatus = \\\"Failed\\\"\\n| summarize count() by TenantId\",\"properties\":{\"Options\":{\"servertimeout\":\"00:04:00\",\"queryconsistency\":\"strongconsistency\",\"query_language\":\"csl\",\"request_readonly\":false,\"request_readonly_hardline\":false}}}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });

// example Response
// [
//   {
//       "FrameType": "DataSetHeader",
//       "IsProgressive": false,
//       "Version": "v2.0",
//       "IsFragmented": false,
//       "ErrorReportingPlacement": "InData"
//   },
//   {
//       "FrameType": "DataTable",
//       "TableId": 0,
//       "TableKind": "QueryProperties",
//       "TableName": "@ExtendedProperties",
//       "Columns": [
//           {
//               "ColumnName": "TableId",
//               "ColumnType": "int"
//           },
//           {
//               "ColumnName": "Key",
//               "ColumnType": "string"
//           },
//           {
//               "ColumnName": "Value",
//               "ColumnType": "dynamic"
//           }
//       ],
//       "Rows": [
//           [
//               1,
//               "Visualization",
//               "{\"Visualization\":null,\"Title\":null,\"XColumn\":null,\"Series\":null,\"YColumns\":null,\"AnomalyColumns\":null,\"XTitle\":null,\"YTitle\":null,\"XAxis\":null,\"YAxis\":null,\"Legend\":null,\"YSplit\":null,\"Accumulate\":false,\"IsQuerySorted\":false,\"Kind\":null,\"Ymin\":\"NaN\",\"Ymax\":\"NaN\",\"Xmin\":null,\"Xmax\":null}"
//           ]
//       ]
//   },
//   {
//       "FrameType": "DataTable",
//       "TableId": 1,
//       "TableKind": "PrimaryResult",
//       "TableName": "PrimaryResult",
//       "Columns": [
//           {
//               "ColumnName": "TenantId",
//               "ColumnType": "string"
//           },
//           {
//               "ColumnName": "count_",
//               "ColumnType": "long"
//           }
//       ],
//       "Rows": [
//           [
//               "aaf55a78-4288-4808-895f-269999474191",
//               2
//           ],
//           [
//               "fa9a3f29-8104-4985-8a52-62aba97b887a",
//               4
//           ],
//           [
//               "750e3f1d-9f3a-4168-b5ae-dcbd4ae8a865",
//               2
//           ],
//           [
//               "e96aabc6-8501-4886-9808-8094546e854d",
//               2
//           ],
//           [
//               "0c97c915-f6f2-4d1c-b825-4b75fc560f7c",
//               2
//           ],
//           [
//               "8d48781e-597b-4e92-bf87-d2e8de356130",
//               2
//           ],
//           [
//               "d5d9a12d-3b75-4bda-86dc-5576fdbd64a8",
//               6
//           ]
//       ]
//   },
//   {
//       "FrameType": "DataTable",
//       "TableId": 2,
//       "TableKind": "QueryCompletionInformation",
//       "TableName": "QueryCompletionInformation",
//       "Columns": [
//           {
//               "ColumnName": "Timestamp",
//               "ColumnType": "datetime"
//           },
//           {
//               "ColumnName": "ClientRequestId",
//               "ColumnType": "string"
//           },
//           {
//               "ColumnName": "ActivityId",
//               "ColumnType": "guid"
//           },
//           {
//               "ColumnName": "SubActivityId",
//               "ColumnType": "guid"
//           },
//           {
//               "ColumnName": "ParentActivityId",
//               "ColumnType": "guid"
//           },
//           {
//               "ColumnName": "Level",
//               "ColumnType": "int"
//           },
//           {
//               "ColumnName": "LevelName",
//               "ColumnType": "string"
//           },
//           {
//               "ColumnName": "StatusCode",
//               "ColumnType": "int"
//           },
//           {
//               "ColumnName": "StatusCodeName",
//               "ColumnType": "string"
//           },
//           {
//               "ColumnName": "EventType",
//               "ColumnType": "int"
//           },
//           {
//               "ColumnName": "EventTypeName",
//               "ColumnType": "string"
//           },
//           {
//               "ColumnName": "Payload",
//               "ColumnType": "string"
//           }
//       ],
//       "Rows": [
//           [
//               "2024-12-29T15:44:26.426308Z",
//               "Kusto.Web.KWE.Query;776825dc-ace0-4587-a752-bd1614497333;95603f3a-b289-482e-953b-7b575bbcb06a",
//               "ca2b9d3e-d51c-4a6b-a82f-37c743924f29",
//               "f94ff804-3789-4d84-a934-5ad4b985fd64",
//               "7b03abda-5e86-4d55-92eb-21f0e9519e06",
//               4,
//               "Info",
//               0,
//               "S_OK (0)",
//               4,
//               "QueryInfo",
//               "{\"Count\":32,\"Text\":\"Query completed successfully\"}"
//           ],
//           [
//               "2024-12-29T15:44:26.426308Z",
//               "Kusto.Web.KWE.Query;776825dc-ace0-4587-a752-bd1614497333;95603f3a-b289-482e-953b-7b575bbcb06a",
//               "ca2b9d3e-d51c-4a6b-a82f-37c743924f29",
//               "f94ff804-3789-4d84-a934-5ad4b985fd64",
//               "7b03abda-5e86-4d55-92eb-21f0e9519e06",
//               4,
//               "Info",
//               0,
//               "S_OK (0)",
//               6,
//               "EffectiveRequestOptions",
//               "{\"Count\":32,\"Text\":\"{\\\"DataScope\\\":\\\"All\\\",\\\"QueryConsistency\\\":\\\"strongconsistency\\\",\\\"MaxMemoryConsumptionPerIterator\\\":5368709120,\\\"MaxMemoryConsumptionPerQueryPerNode\\\":68718888960,\\\"QueryFanoutNodesPercent\\\":100,\\\"QueryFanoutThreadsPercent\\\":100}\"}"
//           ],
//           [
//               "2024-12-29T15:44:26.4543279Z",
//               "Kusto.Web.KWE.Query;776825dc-ace0-4587-a752-bd1614497333;95603f3a-b289-482e-953b-7b575bbcb06a",
//               "ca2b9d3e-d51c-4a6b-a82f-37c743924f29",
//               "f94ff804-3789-4d84-a934-5ad4b985fd64",
//               "7b03abda-5e86-4d55-92eb-21f0e9519e06",
//               4,
//               "Info",
//               0,
//               "S_OK (0)",
//               5,
//               "WorkloadGroup",
//               "{\"Count\":1,\"Text\":\"default\"}"
//           ],
//           [
//               "2024-12-29T15:44:26.4543279Z",
//               "Kusto.Web.KWE.Query;776825dc-ace0-4587-a752-bd1614497333;95603f3a-b289-482e-953b-7b575bbcb06a",
//               "ca2b9d3e-d51c-4a6b-a82f-37c743924f29",
//               "f94ff804-3789-4d84-a934-5ad4b985fd64",
//               "7b03abda-5e86-4d55-92eb-21f0e9519e06",
//               6,
//               "Stats",
//               0,
//               "S_OK (0)",
//               0,
//               "QueryResourceConsumption",
//               "{\"QueryHash\":\";;f5d712a9506ea62b\",\"ExecutionTime\":0.0316843,\"resource_usage\":{\"cache\":{\"shards\":{\"hot\":{\"hitbytes\":0,\"missbytes\":0,\"retrievebytes\":0},\"cold\":{\"hitbytes\":2317138,\"missbytes\":22174,\"retrievebytes\":104188},\"bypassbytes\":0}},\"cpu\":{\"user\":\"00:00:00.0781250\",\"kernel\":\"00:00:00.0156250\",\"total cpu\":\"00:00:00.0937500\",\"breakdown\":{\"query execution\":\"00:00:00.0937500\",\"query planning\":\"00:00:00\"}},\"memory\":{\"peak_per_node\":6301040},\"network\":{\"inter_cluster_total_bytes\":68755,\"cross_cluster_total_bytes\":0}},\"input_dataset_statistics\":{\"extents\":{\"total\":45,\"scanned\":35,\"scanned_min_datetime\":\"2024-11-28T20:01:56.2476810Z\",\"scanned_max_datetime\":\"2024-12-29T15:44:19.2144588Z\"},\"rows\":{\"total\":15838062,\"scanned\":15834657},\"rowstores\":{\"scanned_rows\":0,\"scanned_values_size\":0},\"shards\":{\"queries_generic\":35,\"queries_specialized\":0}},\"dataset_statistics\":[{\"table_row_count\":7,\"table_size\":308}],\"cross_cluster_resource_usage\":{}}"
//           ]
//       ]
//   },
//   {
//       "FrameType": "DataSetCompletion",
//       "HasErrors": false,
//       "Cancelled": false
//   }
// ]
