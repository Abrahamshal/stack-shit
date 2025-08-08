import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StandalonePricingCalculator() {
  const [nodeCount, setNodeCount] = useState(15);
  const [operationsPerMonth, setOperationsPerMonth] = useState('80000');
  const [activeScenariosCount, setActiveScenariosCount] = useState('5');
  const [makePlan, setMakePlan] = useState('pro');
  const [makeMonthlyCost, setMakeMonthlyCost] = useState(0);
  const [breakEvenMonths, setBreakEvenMonths] = useState(0);
  const [oneYearSavings, setOneYearSavings] = useState(0);

  const pricePerNode = 20;
  const totalPrice = nodeCount * pricePerNode;

  const getMakeMonthlyCost = () => {
    const operations = parseInt(operationsPerMonth);
    const scenarios = parseInt(activeScenariosCount);

    let baseCost = 0;
    let opsIncluded = 0;
    let additionalOpsCost = 0;
    let scenariosIncluded = 0;
    let additionalScenariosCost = 0;

    switch(makePlan) {
      case 'core':
        baseCost = 9;
        opsIncluded = 10000;
        additionalOpsCost = 9;
        scenariosIncluded = 2;
        additionalScenariosCost = 5;
        break;
      case 'pro':
        baseCost = 16;
        opsIncluded = 25000;
        if (operations <= 25000) additionalOpsCost = 8;
        else if (operations <= 50000) additionalOpsCost = 7.5;
        else if (operations <= 100000) additionalOpsCost = 7;
        else additionalOpsCost = 6.5;
        scenariosIncluded = 5;
        additionalScenariosCost = 4;
        break;
      case 'team':
        baseCost = 29;
        opsIncluded = 50000;
        if (operations <= 50000) additionalOpsCost = 7;
        else if (operations <= 100000) additionalOpsCost = 6.5;
        else if (operations <= 200000) additionalOpsCost = 6;
        else additionalOpsCost = 5.5;
        scenariosIncluded = 15;
        additionalScenariosCost = 3;
        break;
      case 'enterprise':
        baseCost = 199;
        opsIncluded = 200000;
        additionalOpsCost = 6;
        scenariosIncluded = 50;
        additionalScenariosCost = 2;
        break;
      default:
        baseCost = 16;
        opsIncluded = 25000;
        additionalOpsCost = 8;
        scenariosIncluded = 5;
        additionalScenariosCost = 4;
    }

    const additionalOps = Math.max(0, operations - opsIncluded);
    const additionalOpsBlocks = Math.ceil(additionalOps / 10000);
    const totalAdditionalOpsCost = additionalOpsBlocks * additionalOpsCost;

    const additionalScenarios = Math.max(0, scenarios - scenariosIncluded);
    const totalAdditionalScenariosCost = additionalScenarios * additionalScenariosCost;

    return baseCost + totalAdditionalOpsCost + totalAdditionalScenariosCost;
  };

  const calculateBreakeven = () => {
    const monthlyMakeCost = getMakeMonthlyCost();
    setMakeMonthlyCost(monthlyMakeCost);

    const breakEven = Math.ceil(totalPrice / monthlyMakeCost);
    setBreakEvenMonths(breakEven);

    const savings = (monthlyMakeCost * 12) - totalPrice;
    setOneYearSavings(savings);
  };

  useEffect(() => {
    calculateBreakeven();
  }, [operationsPerMonth, activeScenariosCount, makePlan, nodeCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="nodeCount" className="block text-sm font-semibold text-gray-700 mb-2">Total Number of Nodes</label>
                <div className="flex items-center">
                  <Button variant="outline" onClick={() => setNodeCount(Math.max(0, nodeCount - 1))}>-</Button>
                  <Input type="number" id="nodeCount" value={nodeCount} onChange={(e) => setNodeCount(parseInt(e.target.value) || 0)} className="w-24 text-center" />
                  <Button variant="outline" onClick={() => setNodeCount(nodeCount + 1)}>+</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Each node costs $20</p>
              </div>
              <div>
                <span className="font-medium">Migration Cost:</span>
                <div className="font-bold text-xl text-primary">${totalPrice}</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Make.com Subscription Costs</h3>
            <div className="space-y-4">
              <Select value={operationsPerMonth} onValueChange={setOperationsPerMonth}>
                <SelectTrigger><SelectValue placeholder="Monthly Operations" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">10,000 ops/month</SelectItem>
                  <SelectItem value="25000">25,000 ops/month</SelectItem>
                  <SelectItem value="50000">50,000 ops/month</SelectItem>
                  <SelectItem value="80000">80,000 ops/month (Average)</SelectItem>
                  <SelectItem value="100000">100,000 ops/month</SelectItem>
                  <SelectItem value="200000">200,000 ops/month</SelectItem>
                  <SelectItem value="500000">500,000 ops/month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activeScenariosCount} onValueChange={setActiveScenariosCount}>
                <SelectTrigger><SelectValue placeholder="Active Scenarios" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 scenario</SelectItem>
                  <SelectItem value="2">2 scenarios</SelectItem>
                  <SelectItem value="5">5 scenarios</SelectItem>
                  <SelectItem value="10">10 scenarios</SelectItem>
                  <SelectItem value="15">15 scenarios</SelectItem>
                  <SelectItem value="25">25 scenarios</SelectItem>
                  <SelectItem value="50">50 scenarios</SelectItem>
                </SelectContent>
              </Select>
              <Select value={makePlan} onValueChange={setMakePlan}>
                <SelectTrigger><SelectValue placeholder="Make.com Plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core ($9/mo)</SelectItem>
                  <SelectItem value="pro">Pro ($16/mo)</SelectItem>
                  <SelectItem value="team">Team ($29/mo)</SelectItem>
                  <SelectItem value="enterprise">Enterprise ($199/mo)</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <h4 className="font-medium text-green-800 mb-2">Your Savings</h4>
                <div>Estimated Make.com monthly cost: <span className="font-bold">${makeMonthlyCost}</span></div>
                <div>Break-even after: <span className="font-bold">{breakEvenMonths} months</span></div>
                <div>First year savings: <span className="font-bold">${oneYearSavings}</span></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
