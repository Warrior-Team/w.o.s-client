import gql from "graphql-tag";

export const addSystem = gql ` 
  mutation addSystem($reality: Int, $systemToAdd: SystemInput) {
    addSystem(reality:$reality, data: $systemToAdd)
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