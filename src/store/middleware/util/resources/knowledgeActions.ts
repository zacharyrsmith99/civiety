import { RootState } from "@/store/types";

export function calculateKnowledgeProduction(state: RootState) {
  const { knowledgeProduction } = state.resources;
  return knowledgeProduction;
}
