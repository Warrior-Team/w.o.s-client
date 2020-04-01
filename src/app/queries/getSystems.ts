import gql from "graphql-tag";

export const getSystems = gql ` 
 query getSystems($reality: Int) { 
  getSystems(reality:$reality)
  {
    id
    name
    team
    details
    icon
    isAlive
    lastAlive
    url
   }
 }`