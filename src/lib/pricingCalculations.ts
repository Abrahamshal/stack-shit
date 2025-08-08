// Pricing calculations based on research from 2024-2025

export interface PlatformPricing {
  name: string;
  plans: PricingPlan[];
}

export interface PricingPlan {
  name: string;
  monthlyPrice: number;
  includedTasks: number;
  pricePerAdditionalTask: number;
  features?: string[];
}

// Zapier Pricing (2024-2025)
export const zapierPricing: PlatformPricing = {
  name: 'Zapier',
  plans: [
    {
      name: 'Free',
      monthlyPrice: 0,
      includedTasks: 100,
      pricePerAdditionalTask: 0.25, // Estimated
    },
    {
      name: 'Professional',
      monthlyPrice: 19.99,
      includedTasks: 750,
      pricePerAdditionalTask: 0.027, // $20 for 750 more tasks
    },
    {
      name: 'Professional Plus',
      monthlyPrice: 49,
      includedTasks: 2000,
      pricePerAdditionalTask: 0.025,
    },
    {
      name: 'Team',
      monthlyPrice: 69,
      includedTasks: 3000,
      pricePerAdditionalTask: 0.023,
    },
  ],
};

// Make.com Pricing (2024-2025)
export const makePricing: PlatformPricing = {
  name: 'Make.com',
  plans: [
    {
      name: 'Free',
      monthlyPrice: 0,
      includedTasks: 1000,
      pricePerAdditionalTask: 0.013, // Estimated
    },
    {
      name: 'Core',
      monthlyPrice: 9,
      includedTasks: 10000,
      pricePerAdditionalTask: 0.0009, // $9 for 10k more operations
    },
    {
      name: 'Pro',
      monthlyPrice: 16,
      includedTasks: 10000,
      pricePerAdditionalTask: 0.0008,
    },
    {
      name: 'Teams',
      monthlyPrice: 29,
      includedTasks: 10000,
      pricePerAdditionalTask: 0.0007,
    },
  ],
};

export interface MigrationSavings {
  zapierMonthlyCost: number;
  makeMonthlyCost: number;
  n8nSelfHostedCost: number;
  monthlySavingsFromZapier: number;
  monthlySavingsFromMake: number;
  annualSavingsFromZapier: number;
  annualSavingsFromMake: number;
  breakEvenMonths: number;
  recommendedPlan: {
    zapier: PricingPlan;
    make: PricingPlan;
  };
}

/**
 * Calculate estimated monthly tasks based on workflow count and average executions
 * @param workflowCount Number of workflows
 * @param avgExecutionsPerDay Average executions per workflow per day
 */
export function estimateMonthlyTasks(
  workflowCount: number,
  avgExecutionsPerDay: number = 10
): number {
  // Assume each workflow runs avgExecutionsPerDay times per day
  // and each execution uses 2-3 tasks on average (trigger + actions)
  const avgTasksPerExecution = 2.5;
  return Math.round(workflowCount * avgExecutionsPerDay * 30 * avgTasksPerExecution);
}

/**
 * Find the most cost-effective plan for a given number of monthly tasks
 */
export function findOptimalPlan(
  platform: PlatformPricing,
  monthlyTasks: number
): { plan: PricingPlan; totalCost: number } {
  let bestPlan = platform.plans[0];
  let bestCost = Infinity;

  for (const plan of platform.plans) {
    let totalCost = plan.monthlyPrice;
    
    if (monthlyTasks > plan.includedTasks) {
      const additionalTasks = monthlyTasks - plan.includedTasks;
      totalCost += additionalTasks * plan.pricePerAdditionalTask;
    }
    
    if (totalCost < bestCost) {
      bestCost = totalCost;
      bestPlan = plan;
    }
  }

  return { plan: bestPlan, totalCost: bestCost };
}

/**
 * Calculate migration savings based on workflow analysis
 */
export function calculateMigrationSavings(
  totalNodes: number,
  workflowCount: number,
  migrationCost: number,
  avgExecutionsPerDay: number = 10,
  n8nHostingCost: number = 0 // Self-hosted is typically $0, but could include server costs
): MigrationSavings {
  // Estimate monthly task usage
  const estimatedMonthlyTasks = estimateMonthlyTasks(workflowCount, avgExecutionsPerDay);
  
  // Find optimal plans for each platform
  const zapierOptimal = findOptimalPlan(zapierPricing, estimatedMonthlyTasks);
  const makeOptimal = findOptimalPlan(makePricing, estimatedMonthlyTasks);
  
  // Calculate savings
  const monthlySavingsFromZapier = zapierOptimal.totalCost - n8nHostingCost;
  const monthlySavingsFromMake = makeOptimal.totalCost - n8nHostingCost;
  
  // Calculate break-even point (how many months to recover migration cost)
  const avgMonthlySavings = (monthlySavingsFromZapier + monthlySavingsFromMake) / 2;
  const breakEvenMonths = avgMonthlySavings > 0 
    ? Math.ceil(migrationCost / avgMonthlySavings)
    : 0;
  
  return {
    zapierMonthlyCost: zapierOptimal.totalCost,
    makeMonthlyCost: makeOptimal.totalCost,
    n8nSelfHostedCost: n8nHostingCost,
    monthlySavingsFromZapier,
    monthlySavingsFromMake,
    annualSavingsFromZapier: monthlySavingsFromZapier * 12,
    annualSavingsFromMake: monthlySavingsFromMake * 12,
    breakEvenMonths,
    recommendedPlan: {
      zapier: zapierOptimal.plan,
      make: makeOptimal.plan,
    },
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}