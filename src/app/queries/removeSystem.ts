import gql from "graphql-tag";

export const removeSystem = gql`
  mutation removeSystem ($reality: Int, $id: Int) {
    removeSystem(reality:$reality, id: $id)
  }`