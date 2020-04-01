import gql from "graphql-tag";

export const updateSystem = gql ` 
  mutation updateSystem($reality: Int, $systemToUpdate: SystemInput) {
    updateSystem(reality:$reality, data: $systemToUpdate)
    {
      id
      name
      team
      details
      icon
      isAlive
      lastAlive
    }
  }`