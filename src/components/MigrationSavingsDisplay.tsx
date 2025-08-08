import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Zap, 
  Package,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { 
  calculateMigrationSavings, 
  formatCurrency, 
  formatNumber,
  type MigrationSavings 
} from '@/lib/pricingCalculations';
import { Button } from '@/components/ui/button';

interface MigrationSavingsDisplayProps {
  totalNodes: number;
  workflowCount: number;
  migrationCost: number;
  onContactSales?: () => void;
}

export default function MigrationSavingsDisplay({
  totalNodes,
  workflowCount,
  migrationCost,
  onContactSales,
}: MigrationSavingsDisplayProps) {
  // Calculate savings with different execution frequencies
  const conservativeSavings = calculateMigrationSavings(
    totalNodes,
    workflowCount,
    migrationCost,
    5 // 5 executions per day (conservative)
  );
  
  const averageSavings = calculateMigrationSavings(
    totalNodes,
    workflowCount,
    migrationCost,
    10 // 10 executions per day (average)
  );
  
  const activeSavings = calculateMigrationSavings(
    totalNodes,
    workflowCount,
    migrationCost,
    20 // 20 executions per day (active usage)
  );

  // Use average for display
  const savings = averageSavings;

  return (
    <div className="space-y-6">
      {/* Main Savings Overview */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Migration Savings Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zapier Comparison */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">vs Zapier</div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(savings.annualSavingsFromZapier)}
              </div>
              <div className="text-sm text-muted-foreground">annual savings</div>
              <Badge variant="outline" className="mt-2">
                {formatCurrency(savings.monthlySavingsFromZapier)}/month
              </Badge>
            </div>

            {/* Make.com Comparison */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">vs Make.com</div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(savings.annualSavingsFromMake)}
              </div>
              <div className="text-sm text-muted-foreground">annual savings</div>
              <Badge variant="outline" className="mt-2">
                {formatCurrency(savings.monthlySavingsFromMake)}/month
              </Badge>
            </div>

            {/* Break-even Period */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Break-even in</div>
              <div className="text-3xl font-bold text-primary">
                {savings.breakEvenMonths}
              </div>
              <div className="text-sm text-muted-foreground">months</div>
              <Badge variant="default" className="mt-2">
                ROI: {Math.round((savings.annualSavingsFromZapier / migrationCost) * 100)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Platform Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Platform Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Zapier ({savings.recommendedPlan.zapier.name})</span>
                  <span className="font-bold">{formatCurrency(savings.zapierMonthlyCost)}/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated for {formatNumber(workflowCount * 10 * 30 * 2.5)} tasks/month
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Make.com ({savings.recommendedPlan.make.name})</span>
                  <span className="font-bold">{formatCurrency(savings.makeMonthlyCost)}/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated for {formatNumber(workflowCount * 10 * 30 * 2.5)} operations/month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* n8n Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              n8n Self-Hosted Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Software License</span>
                  <span className="font-bold text-green-600">$0/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Open-source, self-hosted
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Migration Cost (one-time)</span>
                  <span className="font-bold">{formatCurrency(migrationCost)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalNodes} nodes × $20/node
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Unlimited workflows & executions</div>
                    <div className="text-muted-foreground">No monthly task limits</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Savings by Usage Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Conservative */}
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-medium mb-2">Light Usage</div>
                <div className="text-sm text-muted-foreground mb-2">
                  ~5 executions/workflow/day
                </div>
                <div className="space-y-1">
                  <div className="text-sm">
                    vs Zapier: <span className="font-bold text-green-600">
                      {formatCurrency(conservativeSavings.annualSavingsFromZapier)}/year
                    </span>
                  </div>
                  <div className="text-sm">
                    vs Make: <span className="font-bold text-green-600">
                      {formatCurrency(conservativeSavings.annualSavingsFromMake)}/year
                    </span>
                  </div>
                </div>
              </div>

              {/* Average */}
              <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
                <div className="font-medium mb-2">Average Usage</div>
                <div className="text-sm text-muted-foreground mb-2">
                  ~10 executions/workflow/day
                </div>
                <div className="space-y-1">
                  <div className="text-sm">
                    vs Zapier: <span className="font-bold text-green-600">
                      {formatCurrency(averageSavings.annualSavingsFromZapier)}/year
                    </span>
                  </div>
                  <div className="text-sm">
                    vs Make: <span className="font-bold text-green-600">
                      {formatCurrency(averageSavings.annualSavingsFromMake)}/year
                    </span>
                  </div>
                </div>
              </div>

              {/* Active */}
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-medium mb-2">Heavy Usage</div>
                <div className="text-sm text-muted-foreground mb-2">
                  ~20 executions/workflow/day
                </div>
                <div className="space-y-1">
                  <div className="text-sm">
                    vs Zapier: <span className="font-bold text-green-600">
                      {formatCurrency(activeSavings.annualSavingsFromZapier)}/year
                    </span>
                  </div>
                  <div className="text-sm">
                    vs Make: <span className="font-bold text-green-600">
                      {formatCurrency(activeSavings.annualSavingsFromMake)}/year
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-900">Note on Savings</div>
                <div className="text-blue-700">
                  Actual savings may vary based on your specific usage patterns. The more you use your workflows, 
                  the more you save with n8n's unlimited execution model.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Start Saving?</h3>
              <p className="text-muted-foreground">
                Migrate to n8n and save {formatCurrency(Math.max(savings.annualSavingsFromZapier, savings.annualSavingsFromMake))} per year
              </p>
            </div>
            <Button size="lg" onClick={onContactSales} className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}