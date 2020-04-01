import gql from "graphql-tag";

export const getStats = gql `
  query getStats($reality: Int, $serverId: Int) {
    getStats(statsInfoInput:{reality:$reality, serverId:$serverId})
    {
      serverId
      stats {
        duration_ms
        request_time
      }
    }
  }`