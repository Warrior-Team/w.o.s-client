import gql from "graphql-tag";

export const getRealities = gql `
  query getRealities {
    getRealities
    {
      warriorReality
      foodDemands
      plans
      ng
      name
    }
  }`