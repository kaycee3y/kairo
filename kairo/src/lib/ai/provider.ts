// src/lib/ai/provider.ts
import { BreakdownResponse, EmpathyRestructureResponse, StuckReason } from "@/lib/types";

export interface AIProvider {
  getBreakdown(task: string): Promise<BreakdownResponse>;
  getEmpathyRestructure(
    reason: StuckReason,
    currentStepTitle: string,
    currentStepDescription: string
  ): Promise<EmpathyRestructureResponse>;
}