import { useState } from 'react';
import { Trash2, Plus, Cloud, ArrowRight, Copy, Users, Target, Filter, CreditCard, CheckCircle, ExternalLink, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

// Helper functions (outside component to avoid recreation)
const fmt = (val, dec = 2) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);
const fmtNum = (val) => new Intl.NumberFormat('en-US').format(Math.round(val));
const fmtM = (val) => {
  if (val >= 1000000) return fmt(val / 1000000, 1) + 'M';
  if (val >= 1000) return fmt(val / 1000, 0) + 'K';
  return fmtNum(val);
};

// Cost Table Component (outside main component)
function CostTable({ costs, setCosts, newCost, setNewCost, color, isLocked = false, simple = false, yearly = false }) {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [expandedSubscription, setExpandedSubscription] = useState(null);
  
  const updateCost = (id, field, value) => {
    if (isLocked) return;
    setCosts(costs.map(c => c.id === id ? { ...c, [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value } : c));
  };
  const updateTeamBreakdown = (id, team, value) => {
    if (isLocked) return;
    setCosts(costs.map(c => {
      if (c.id !== id) return c;
      const breakdown = { ...(c.teamBreakdown || { Product: '', Dev: '', DevOps: '', Security: '' }), [team]: value };
      // Calculate total from breakdown
      const total = Object.values(breakdown).reduce((sum, v) => sum + (Number(v) || 0), 0);
      return { ...c, teamBreakdown: breakdown, amount: total || c.amount };
    }));
  };
  const deleteCost = (id) => {
    if (isLocked) return;
    setCosts(costs.filter(c => c.id !== id));
  };
  const addCost = () => {
    if (isLocked) return;
    if (newCost.name && newCost.amount) {
      setCosts([...costs, { ...newCost, id: Date.now(), amount: Number(newCost.amount) || 0 }]);
      setNewCost({ name: '', amount: '', currency: 'EUR', scalable: false });
    }
  };

  const isTeamCost = (cost) => !simple && (cost.name.toLowerCase().includes('team') || cost.name.toLowerCase().includes('salar'));
  const isSubscriptionCost = (cost) => !simple && (cost.name.toLowerCase().includes('subscription') || cost.name.toLowerCase().includes('saas') || cost.name.toLowerCase().includes('license'));

  const lockedInputClass = "bg-gray-100 text-gray-600 cursor-not-allowed";
  const editableInputClass = "bg-white";

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 text-xs font-medium px-1 text-gray-500">
        <div className="col-span-4">Service</div>
        <div className="col-span-2">{yearly ? 'Amount /year' : 'Amount'}</div>
        <div className="col-span-2">Currency</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-1"></div>
      </div>
      {costs.map((cost) => (
        <div key={cost.id}>
          <div className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${cost.scalable ? 'bg-violet-50' : 'bg-gray-50'} ${isLocked ? 'opacity-90' : ''}`}>
            <div className="col-span-4 flex items-center gap-1">
              <input 
                type="text" 
                value={cost.name} 
                onChange={(e) => updateCost(cost.id, 'name', e.target.value)} 
                disabled={isLocked}
                className={`w-full px-2 py-1 border rounded text-sm border-gray-200 ${isLocked ? lockedInputClass : editableInputClass}`} 
              />
              {!isLocked && isTeamCost(cost) && (
                <button 
                  onClick={() => setExpandedTeam(expandedTeam === cost.id ? null : cost.id)}
                  className="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
                  title="Team breakdown"
                >
                  {expandedTeam === cost.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
              {!isLocked && isSubscriptionCost(cost) && (
                <button 
                  onClick={() => setExpandedSubscription(expandedSubscription === cost.id ? null : cost.id)}
                  className="text-gray-400 hover:text-purple-500 transition-colors flex-shrink-0"
                  title="Subscriptions list"
                >
                  {expandedSubscription === cost.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="col-span-2">
              {isLocked ? (
                <div className="w-full px-2 py-1 border rounded text-right text-sm border-gray-200 bg-gray-100 text-gray-600">
                  {fmtNum(cost.amount)}
                </div>
              ) : (
                <input 
                  type="number" 
                  value={cost.amount} 
                  onChange={(e) => updateCost(cost.id, 'amount', e.target.value)} 
                  className="w-full px-2 py-1 border rounded text-right text-sm border-gray-200 bg-white" 
                />
              )}
            </div>
            <div className="col-span-2">
              <select 
                value={cost.currency} 
                onChange={(e) => updateCost(cost.id, 'currency', e.target.value)} 
                disabled={isLocked}
                className={`w-full px-2 py-1 border rounded text-sm border-gray-200 ${isLocked ? lockedInputClass : editableInputClass}`}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="col-span-3">
              {isLocked ? (
                <div className={`w-full px-2 py-1 border rounded text-sm font-medium text-center ${cost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                  {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                </div>
              ) : (
                <button 
                  onClick={() => updateCost(cost.id, 'scalable', !cost.scalable)}
                  className={`w-full px-2 py-1 border rounded text-sm font-medium text-center transition-colors ${cost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-200' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                </button>
              )}
            </div>
            <div className="col-span-1 flex justify-end">
              {!isLocked && (
                <button onClick={() => deleteCost(cost.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {isLocked && (
                <span className="text-xs text-gray-400">🔒</span>
              )}
            </div>
          </div>
          {/* Team breakdown - only when not locked */}
          {!isLocked && isTeamCost(cost) && expandedTeam === cost.id && (
            <div className="ml-4 mt-1 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="text-xs font-medium text-blue-600 mb-2">Team Breakdown</div>
              <div className="grid grid-cols-4 gap-2">
                {['Product', 'Dev', 'DevOps', 'Security'].map((team) => (
                  <div key={team}>
                    <label className="block text-xs text-gray-500 mb-1">{team}</label>
                    <input 
                      type="number" 
                      value={cost.teamBreakdown?.[team] || ''} 
                      onChange={(e) => updateTeamBreakdown(cost.id, team, e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1 border rounded text-xs text-right border-gray-200 bg-white"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-blue-100 flex justify-between text-xs">
                <span className="text-gray-500">Sum:</span>
                <span className={`font-medium ${
                  Object.values(cost.teamBreakdown || {}).reduce((sum, v) => sum + (Number(v) || 0), 0) === Number(cost.amount) 
                    ? 'text-emerald-600' 
                    : 'text-amber-600'
                }`}>
                  {fmtNum(Object.values(cost.teamBreakdown || {}).reduce((sum, v) => sum + (Number(v) || 0), 0))} / {fmtNum(Number(cost.amount) || 0)}
                </span>
              </div>
            </div>
          )}
          {/* Subscriptions URL - only when not locked */}
          {!isLocked && isSubscriptionCost(cost) && expandedSubscription === cost.id && (
            <div className="ml-4 mt-1 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
              <div className="text-xs font-medium text-purple-600 mb-2">Subscriptions List</div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <input 
                  type="url" 
                  value={cost.subscriptionsUrl || ''} 
                  onChange={(e) => updateCost(cost.id, 'subscriptionsUrl', e.target.value)}
                  disabled={isLocked}
                  placeholder="Link to subscriptions spreadsheet or document..."
                  className={`flex-1 px-2 py-1 text-xs border rounded border-purple-200 placeholder-gray-400 ${isLocked ? lockedInputClass : editableInputClass}`}
                />
                {cost.subscriptionsUrl && (
                  <a href={cost.subscriptionsUrl} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 flex-shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {cost.subscriptionsUrl && (
                <a href={cost.subscriptionsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-2">
                  View subscriptions list <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      ))}
      {!isLocked && (
        <div className="grid grid-cols-12 gap-2 items-center border-t border-dashed pt-3 mt-4 border-gray-300">
          <div className="col-span-4"><input type="text" placeholder="New cost..." value={newCost.name} onChange={(e) => setNewCost({...newCost, name: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200" /></div>
          <div className="col-span-2"><input type="number" placeholder="0" value={newCost.amount} onChange={(e) => setNewCost({...newCost, amount: e.target.value})} className="w-full px-2 py-1 border rounded text-right text-sm bg-white border-gray-200" /></div>
          <div className="col-span-2"><select value={newCost.currency} onChange={(e) => setNewCost({...newCost, currency: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200"><option value="EUR">EUR</option><option value="USD">USD</option></select></div>
          <div className="col-span-3">
            <button 
              onClick={() => setNewCost({...newCost, scalable: !newCost.scalable})}
              className={`w-full px-2 py-1 border rounded text-sm font-medium text-center transition-colors ${newCost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-200' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
            >
              {newCost.scalable ? '⚡ Infra' : '🏢 Overhead'}
            </button>
          </div>
          <div className="col-span-1"><button onClick={addCost} className={`p-1 text-white rounded hover:opacity-80 ${color}`}><Plus className="w-4 h-4" /></button></div>
        </div>
      )}
    </div>
  );
}

// Flow Visualization Component (outside main component)
function FlowVisualization({ operations, filterRate, approvalRate, transactions, successful, colorScheme = 'indigo' }) {
  const colors = {
    indigo: { bg: 'bg-indigo-600', light: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    purple: { bg: 'bg-purple-600', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  };
  const c = colors[colorScheme];
  
  return (
    <div className={`rounded-lg p-3 border ${c.border} ${c.light}`}>
      <div className="flex items-center justify-between gap-2">
        {/* Operations */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CreditCard className={`w-4 h-4 ${c.text}`} />
            <span className="text-xs font-medium text-gray-600">Operations</span>
          </div>
          <div className={`text-lg font-bold ${c.text}`}>{fmtM(operations)}</div>
          <div className="text-xs text-gray-500">all merchant requests</div>
        </div>
        
        {/* Arrow + Filtered Rate */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="bg-red-100 rounded px-2 py-0.5 mt-1">
            <div className="text-xs font-bold text-red-600">{fmt(100 - filterRate, 0)}%</div>
            <div className="text-xs text-red-500">filtered</div>
          </div>
        </div>
        
        {/* Transactions */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Filter className={`w-4 h-4 ${c.text}`} />
            <span className="text-xs font-medium text-gray-600">Transactions</span>
          </div>
          <div className={`text-lg font-bold ${c.text}`}>{fmtM(transactions)}</div>
          <div className="text-xs text-gray-500">sent to provider</div>
        </div>
        
        {/* Arrow + Approved Rate */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="bg-amber-100 rounded px-2 py-0.5 mt-1">
            <div className="text-xs font-bold text-amber-600">{fmt(approvalRate, 0)}%</div>
            <div className="text-xs text-amber-500">approved</div>
          </div>
        </div>
        
        {/* Successful */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-gray-600">Successful</span>
          </div>
          <div className="text-lg font-bold text-emerald-600">{fmtM(successful)}</div>
          <div className="text-xs text-gray-500">approved transactions</div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function TransactionCostCalculator() {
  const [eurToUsd, setEurToUsd] = useState('1.08');
  const [activeTab, setActiveTab] = useState('costs'); // 'costs' or 'clients'
  
  // BASELINE
  const [baselineYear, setBaselineYear] = useState('2025');
  const [show2025Section, setShow2025Section] = useState(false); // Collapsed by default
  const [baselineAnnualOperations, setBaselineAnnualOperations] = useState('48000000');
  const [baselineAnnualTransactions, setBaselineAnnualTransactions] = useState('45600000');
  const [baselineApprovalRate, setBaselineApprovalRate] = useState('79');
  const [baselineCosts, setBaselineCosts] = useState([
    { id: 1, name: 'AWS', amount: 96000, currency: 'USD', scalable: true },
  ]);
  const baselineLocked = false; // 2025 figures are editable
  const [newBaselineCost, setNewBaselineCost] = useState({ name: '', amount: '', currency: 'EUR', scalable: false });
  
  // PROJECTED - Monthly tracking for 2026
  const [projectedYear, setProjectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = Jan, current month being edited
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Annual costs (paid once per year, spread as /12 for unit economics)
  // scalable: true = infra costs that scale with volume, false = fixed overhead
  const [annualCosts, setAnnualCosts] = useState([
    { id: 1, name: 'PCI DSS + 3DS', amount: 28000, currency: 'EUR', type: 'fixed', scalable: false },
    { id: 2, name: 'Penetration tests', amount: 5000, currency: 'EUR', type: 'fixed', scalable: false },
    { id: 3, name: 'AWS (prepay)', amount: 84000, currency: 'USD', type: 'fixed', scalable: true },
  ]);
  const [newAnnualCost, setNewAnnualCost] = useState({ name: '', amount: '', currency: 'EUR', type: 'fixed', scalable: false });
  
  // Initialize monthly data - each month has its own costs (volume comes from clients)
  const getDefaultMonthData = (monthIndex) => ({
    costs: [
      { id: 1, name: 'AWS', amount: 12000, currency: 'USD', scalable: true },
      { id: 2, name: 'Hetzner', amount: 500, currency: 'EUR', scalable: true },
      { id: 3, name: 'Team (Product + Tech)', amount: 160000, currency: 'EUR', scalable: false, teamBreakdown: { Product: '', Dev: '', DevOps: '', Security: '' } },
      { id: 4, name: 'Subscriptions', amount: 25000, currency: 'EUR', scalable: false, subscriptionsUrl: '' },
    ],
    confirmed: false,
  });
  
  const [monthlyData, setMonthlyData] = useState(() => 
    MONTHS.map((_, i) => getDefaultMonthData(i))
  );
  
  const [newProjectedCost, setNewProjectedCost] = useState({ name: '', amount: '', currency: 'EUR', type: 'fixed', scalable: false });
  
  // Annual cost functions
  const addAnnualCost = () => {
    if (newAnnualCost.name && newAnnualCost.amount) {
      setAnnualCosts([...annualCosts, { ...newAnnualCost, id: Date.now(), amount: Number(newAnnualCost.amount) || 0 }]);
      setNewAnnualCost({ name: '', amount: '', currency: 'EUR', type: 'fixed', scalable: false });
    }
  };
  const updateAnnualCost = (id, field, value) => {
    setAnnualCosts(annualCosts.map(c => c.id === id ? { ...c, [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value } : c));
  };
  const deleteAnnualCost = (id) => setAnnualCosts(annualCosts.filter(c => c.id !== id));
  
  // Update a specific month's data
  const updateMonthData = (monthIndex, field, value) => {
    setMonthlyData(prev => prev.map((m, i) => {
      if (i !== monthIndex) return m;
      return { ...m, [field]: value };
    }));
  };
  
  // Update a cost in a specific month
  const updateMonthCost = (monthIndex, costId, field, value) => {
    setMonthlyData(prev => prev.map((m, i) => {
      if (i !== monthIndex) return m;
      return {
        ...m,
        costs: m.costs.map(c => c.id === costId ? { ...c, [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value } : c)
      };
    }));
  };
  
  // Confirm a month and copy data to next unconfirmed months
  const confirmMonth = (monthIndex) => {
    setMonthlyData(prev => {
      const updated = [...prev];
      updated[monthIndex] = { ...updated[monthIndex], confirmed: true };
      
      // Pre-fill next unconfirmed months with this month's data
      for (let i = monthIndex + 1; i < 12; i++) {
        if (!updated[i].confirmed) {
          updated[i] = {
            ...updated[monthIndex],
            confirmed: false,
          };
        }
      }
      return updated;
    });
    
    // Move to next month
    if (monthIndex < 11) {
      setSelectedMonth(monthIndex + 1);
    }
  };
  
  // Add cost to a month
  const addMonthCost = (monthIndex) => {
    if (newProjectedCost.name && newProjectedCost.amount) {
      setMonthlyData(prev => prev.map((m, i) => {
        if (i !== monthIndex) return m;
        return {
          ...m,
          costs: [...m.costs, { ...newProjectedCost, id: Date.now(), amount: Number(newProjectedCost.amount) || 0 }]
        };
      }));
      setNewProjectedCost({ name: '', amount: '', currency: 'EUR', type: 'fixed' });
    }
  };
  
  // Delete cost from a month
  const deleteMonthCost = (monthIndex, costId) => {
    setMonthlyData(prev => prev.map((m, i) => {
      if (i !== monthIndex) return m;
      return { ...m, costs: m.costs.filter(c => c.id !== costId) };
    }));
  };
  
  // Analytics URLs (hidden by default) - for baseline only now
  const [baselineAnalyticsUrl, setBaselineAnalyticsUrl] = useState('');
  const [showBaselineAnalytics, setShowBaselineAnalytics] = useState(false);
  const [baselineProviderAnalyticsUrl, setBaselineProviderAnalyticsUrl] = useState('');
  const [showBaselineProviderAnalytics, setShowBaselineProviderAnalytics] = useState(false);
  
  // 2026 analytics
  const [show2026Analytics, setShow2026Analytics] = useState(false);
  const [analytics2026Url, setAnalytics2026Url] = useState('');
  const [show2026ProviderAnalytics, setShow2026ProviderAnalytics] = useState(false);
  const [providerAnalytics2026Url, setProviderAnalytics2026Url] = useState('');
  
  // Monthly custom dev tracking: { "clientId-monthIndex": { revenue: '0', cost: '0' } }
  const [monthlyCustomDev, setMonthlyCustomDev] = useState({});
  const [profitabilityMonth, setProfitabilityMonth] = useState(1); // Default to Feb (current month)
  
  const getCustomDev = (clientId, monthIndex) => {
    const key = `${clientId}-${monthIndex}`;
    return monthlyCustomDev[key] || { revenue: '0', cost: '0' };
  };
  
  const setCustomDev = (clientId, monthIndex, field, value) => {
    const key = `${clientId}-${monthIndex}`;
    setMonthlyCustomDev(prev => ({
      ...prev,
      [key]: { ...getCustomDev(clientId, monthIndex), [field]: value }
    }));
  };
  
  // CLIENTS
  const [clients, setClients] = useState([
    { id: 1, name: 'Client A', monthlyOperations: '4000000', monthlyTransactions: '3800000', approvalRate: '79', price: '0.01', pricingModel: 'perTransaction', fixedFeePerTxn: '0', oneTimeFee: '0', monthlyFee: '0', startDate: '2026-01-01', analyticsUrl: '', showAnalytics: false, providerAnalyticsUrl: '', showProviderAnalytics: false, customDevRevenue: '0', customDevCost: '0' },
    { id: 2, name: 'Client B', monthlyOperations: '1000000', monthlyTransactions: '950000', approvalRate: '82', price: '0.015', pricingModel: 'perTransaction', fixedFeePerTxn: '0', oneTimeFee: '0', monthlyFee: '0', startDate: '2026-02-16', analyticsUrl: '', showAnalytics: false, providerAnalyticsUrl: '', showProviderAnalytics: false, customDevRevenue: '0', customDevCost: '0' },
  ]);
  const [expandedClients, setExpandedClients] = useState([1]); // First client expanded by default
  const [expandedTiers, setExpandedTiers] = useState(null); // Track which cost has tiers expanded
  const [targetMargin, setTargetMargin] = useState('30');
  const [breakEvenPrice, setBreakEvenPrice] = useState('0.01');
  
  const toggleClientExpanded = (clientId) => {
    setExpandedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  // Helpers - parse strings to numbers
  const num = (val) => Number(val) || 0;
  const toEur = (amount, currency) => currency === 'USD' ? amount / num(eurToUsd) : amount;

  // Calculate tiered cost based on operations volume (cumulative/marginal tiers like tax brackets)
  const calculateTieredCost = (tiers, operations) => {
    if (!tiers || tiers.length === 0 || operations <= 0) return 0;
    
    let totalCost = 0;
    let remainingOps = operations;
    let previousCap = 0;
    
    for (const tier of tiers) {
      const tierCap = tier.upTo || Infinity;
      const tierRange = tierCap - previousCap;
      const opsInTier = Math.min(remainingOps, tierRange);
      
      if (opsInTier > 0) {
        totalCost += opsInTier * tier.rate;
        remainingOps -= opsInTier;
      }
      
      previousCap = tierCap;
      if (remainingOps <= 0) break;
    }
    
    return totalCost;
  };

  // Calculations
  const calculateCosts = (costs, isYearly = false, operations = 0) => {
    let fixed = 0, variable = 0, tiered = 0, overhead = 0, infra = 0;
    costs.forEach(c => {
      let amountEur;
      
      // If cost has operation-based tiers, calculate from tiers
      if (c.tipiered && c.tiers && c.tiers.length > 0 && operations > 0) {
        const tieredAmount = calculateTieredCost(c.tiers, operations);
        amountEur = toEur(tieredAmount, c.currency);
      } else {
        amountEur = toEur(c.amount, c.currency);
      }
      
      const monthlyAmount = isYearly ? amountEur / 12 : amountEur;
      // Support both old type-based and new scalable-based costs
      if (c.scalable !== undefined) {
        if (c.scalable) infra += monthlyAmount;
        else overhead += monthlyAmount;
      } else {
        if (c.type === 'fixed') fixed += monthlyAmount;
        else if (c.type === 'variable') variable += monthlyAmount;
        else if (c.type === 'tiered') tiered += monthlyAmount;
      }
    });
    const total = fixed + variable + tiered + overhead + infra;
    return { fixed, variable, tiered, overhead, infra, total };
  };

  // BASELINE calculations (yearly amounts)
  const baselineMonthlyOperations = num(baselineAnnualOperations) / 12;
  const baselineMonthlyTransactions = num(baselineAnnualTransactions) / 12;
  const baselineFilterRate = num(baselineAnnualOperations) > 0 ? (num(baselineAnnualTransactions) / num(baselineAnnualOperations)) * 100 : 0;
  const baselineMonthlySuccessful = Math.round(baselineMonthlyTransactions * num(baselineApprovalRate) / 100);
  
  const baselineMonthly = calculateCosts(baselineCosts, true); // yearly amounts
  const baselineYearly = { 
    fixed: baselineMonthly.fixed * 12, 
    variable: baselineMonthly.variable * 12, 
    tiered: baselineMonthly.tiered * 12, 
    overhead: baselineMonthly.overhead * 12,
    infra: baselineMonthly.infra * 12,
    total: baselineMonthly.total * 12 
  };
  const baselineCostPerOperation = baselineMonthlyOperations > 0 ? baselineMonthly.total / baselineMonthlyOperations : 0;
  const baselineCostPerTransaction = baselineMonthlyTransactions > 0 ? baselineMonthly.total / baselineMonthlyTransactions : 0;
  const baselineCostPerSuccessful = baselineMonthlySuccessful > 0 ? baselineMonthly.total / baselineMonthlySuccessful : 0;

  // Helper to get days in a month
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
  // Helper to calculate client's volume factor for a given month (0-11)
  // Returns 0 if not active, 1 if fully active, or prorated fraction for partial month
  const getClientMonthFactor = (client, monthIndex) => {
    try {
      if (!client.startDate) return 1; // No start date = always active
      
      const startDate = new Date(client.startDate);
      if (isNaN(startDate.getTime())) return 1; // Invalid date = assume active
      
      const year = 2026; // Current tracking year
      const monthStart = new Date(year, monthIndex, 1);
      const daysInMonth = getDaysInMonth(year, monthIndex);
      const monthEnd = new Date(year, monthIndex, daysInMonth);
      
      // Client starts after this month ends
      if (startDate > monthEnd) return 0;
      
      // Client started before this month begins
      if (startDate <= monthStart) return 1;
      
      // Partial month - calculate proration
      const startDay = startDate.getDate();
      const activeDays = daysInMonth - startDay + 1;
      return activeDays / daysInMonth;
    } catch (e) {
      return 1; // On error, assume active
    }
  };

  // VOLUME FROM CLIENTS - for selected month (with proration)
  const getMonthlyVolume = (monthIndex) => {
    let ops = 0, txn = 0, successful = 0;
    const clientDetails = [];
    
    clients.forEach(c => {
      const factor = getClientMonthFactor(c, monthIndex);
      const clientOps = Math.round(num(c.monthlyOperations) * factor);
      const clientTxn = Math.round(num(c.monthlyTransactions) * factor);
      const clientSuccessful = Math.round(clientTxn * num(c.approvalRate) / 100);
      
      ops += clientOps;
      txn += clientTxn;
      successful += clientSuccessful;
      
      clientDetails.push({
        ...c,
        factor,
        activeOps: clientOps,
        activeTxn: clientTxn,
        activeSuccessful: clientSuccessful,
        isActive: factor > 0,
        isPartial: factor > 0 && factor < 1
      });
    });
    
    return { ops, txn, successful, clientDetails };
  };
  
  const selectedMonthVolume = getMonthlyVolume(selectedMonth);
  const totalClientOperations = selectedMonthVolume.ops;
  const totalClientTransactions = selectedMonthVolume.txn;
  const totalClientSuccessful = selectedMonthVolume.successful;
  const activeClients = selectedMonthVolume.clientDetails.filter(c => c.isActive);
  
  const avgApprovalRate = totalClientTransactions > 0 
    ? (totalClientSuccessful / totalClientTransactions) * 100 
    : 0;
  const avgFilterRate = totalClientOperations > 0 
    ? (totalClientTransactions / totalClientOperations) * 100 
    : 0;

  // CURRENT MONTH calculations
  const currentMonth = monthlyData[selectedMonth] || monthlyData[0];
  
  // Helper to calculate costs split by scalable (infra) vs fixed (overhead)
  const calculateCostsSplit = (costs, operations = 0) => {
    let scalable = 0, fixed = 0;
    costs.forEach(c => {
      let amountEur;
      // If cost has operation-based tiers, calculate from tiers
      if (c.tipiered && c.tiers && c.tiers.length > 0 && operations > 0) {
        const tieredAmount = calculateTieredCost(c.tiers, operations);
        amountEur = toEur(tieredAmount, c.currency);
      } else {
        amountEur = toEur(c.amount, c.currency);
      }
      if (c.scalable) scalable += amountEur;
      else fixed += amountEur;
    });
    return { scalable, fixed, total: scalable + fixed };
  };
  
  // Calculate annual costs spread per month (split by scalable)
  const annualCostsMonthly = calculateCosts(annualCosts);
  const annualCostsSplit = calculateCostsSplit(annualCosts);
  const annualCostsPerMonth = {
    fixed: annualCostsMonthly.fixed / 12,
    variable: annualCostsMonthly.variable / 12,
    tiered: annualCostsMonthly.tiered / 12,
    total: annualCostsMonthly.total / 12,
    scalable: annualCostsSplit.scalable / 12,
    overhead: annualCostsSplit.fixed / 12,
  };
  
  // Current month costs split (with tiered costs based on operations)
  const currentMonthCosts = calculateCosts(currentMonth.costs, false, totalClientOperations);
  const currentMonthSplit = calculateCostsSplit(currentMonth.costs, totalClientOperations);
  const currentMonthTotalWithAnnual = currentMonthCosts.total + annualCostsPerMonth.total;
  
  // Scalable (infra) costs = monthly scalable + annual scalable/12
  const currentMonthScalable = currentMonthSplit.scalable + annualCostsPerMonth.scalable;
  // Fixed (overhead) costs = monthly fixed + annual fixed/12
  const currentMonthOverhead = currentMonthSplit.fixed + annualCostsPerMonth.overhead;
  
  // Marginal cost per unit (infra only - for minimum pricing)
  const marginalCostPerOp = totalClientOperations > 0 ? currentMonthScalable / totalClientOperations : 0;
  const marginalCostPerTxn = totalClientTransactions > 0 ? currentMonthScalable / totalClientTransactions : 0;
  const marginalCostPerSuccess = totalClientSuccessful > 0 ? currentMonthScalable / totalClientSuccessful : 0;
  
  // Fully loaded cost per unit (everything - for profitability)
  const fullyLoadedCostPerOp = totalClientOperations > 0 ? currentMonthTotalWithAnnual / totalClientOperations : 0;
  const fullyLoadedCostPerTxn = totalClientTransactions > 0 ? currentMonthTotalWithAnnual / totalClientTransactions : 0;
  const fullyLoadedCostPerSuccess = totalClientSuccessful > 0 ? currentMonthTotalWithAnnual / totalClientSuccessful : 0;
  
  // Legacy names for compatibility
  const currentMonthCostPerOp = fullyLoadedCostPerOp;
  const currentMonthCostPerTxn = fullyLoadedCostPerTxn;
  const currentMonthCostPerSuccess = fullyLoadedCostPerSuccess;
  
  // YTD calculations (only confirmed months + proportional annual costs)
  const confirmedMonths = monthlyData.filter(m => m.confirmed);
  const confirmedMonthCount = confirmedMonths.length;
  const ytdOperations = totalClientOperations * confirmedMonthCount;
  const ytdTransactions = totalClientTransactions * confirmedMonthCount;
  const ytdSuccessful = totalClientSuccessful * confirmedMonthCount;
  // For YTD, use same operations per month (simplified assumption)
  const ytdMonthlyCosts = confirmedMonths.reduce((sum, m) => sum + calculateCosts(m.costs, false, totalClientOperations).total, 0);
  const ytdMonthlyScalable = confirmedMonths.reduce((sum, m) => sum + calculateCostsSplit(m.costs, totalClientOperations).scalable, 0);
  const ytdAnnualCostsPortion = annualCostsPerMonth.total * confirmedMonthCount;
  const ytdAnnualScalablePortion = annualCostsPerMonth.scalable * confirmedMonthCount;
  const ytdCosts = ytdMonthlyCosts + ytdAnnualCostsPortion;
  const ytdScalableCosts = ytdMonthlyScalable + ytdAnnualScalablePortion;
  
  // YTD marginal (scalable only)
  const ytdMarginalPerOp = ytdOperations > 0 ? ytdScalableCosts / ytdOperations : 0;
  const ytdMarginalPerTxn = ytdTransactions > 0 ? ytdScalableCosts / ytdTransactions : 0;
  const ytdMarginalPerSuccess = ytdSuccessful > 0 ? ytdScalableCosts / ytdSuccessful : 0;
  
  // YTD fully loaded
  const ytdCostPerOp = ytdOperations > 0 ? ytdCosts / ytdOperations : 0;
  const ytdCostPerTxn = ytdTransactions > 0 ? ytdCosts / ytdTransactions : 0;
  const ytdCostPerSuccess = ytdSuccessful > 0 ? ytdCosts / ytdSuccessful : 0;

  // Effective cost per unit (YTD if available, otherwise current month projection)
  const effectiveMarginalPerOp = confirmedMonthCount > 0 ? ytdMarginalPerOp : marginalCostPerOp;
  const effectiveMarginalPerTxn = confirmedMonthCount > 0 ? ytdMarginalPerTxn : marginalCostPerTxn;
  const effectiveMarginalPerSuccess = confirmedMonthCount > 0 ? ytdMarginalPerSuccess : marginalCostPerSuccess;
  const effectiveFullyLoadedPerOp = confirmedMonthCount > 0 ? ytdCostPerOp : fullyLoadedCostPerOp;
  const effectiveCostPerOp = effectiveFullyLoadedPerOp; // for client calculations
  const effectiveCostPerTxn = confirmedMonthCount > 0 ? ytdCostPerTxn : currentMonthCostPerTxn;
  const effectiveCostPerSuccess = confirmedMonthCount > 0 ? ytdCostPerSuccess : currentMonthCostPerSuccess;
  
  // CLIENT METRICS
  const clientMetrics = clients.map((client) => {
    const monthlyOps = num(client.monthlyOperations);
    const monthlyTxn = num(client.monthlyTransactions);
    const approval = num(client.approvalRate);
    const price = num(client.price);
    const fixedFeePerTxn = num(client.fixedFeePerTxn);
    const oneTimeFee = num(client.oneTimeFee);
    const monthlyFee = num(client.monthlyFee);
    const margin = num(targetMargin);
    
    // Get proration factor for selected month
    const proratedData = selectedMonthVolume.clientDetails.find(c => c.id === client.id);
    const factor = proratedData?.factor || 0;
    const proratedOps = proratedData?.activeOps || 0;
    const proratedTxn = proratedData?.activeTxn || 0;
    const proratedSuccessful = proratedData?.activeSuccessful || 0;
    
    const filterRate = monthlyOps > 0 ? (monthlyTxn / monthlyOps) * 100 : 0;
    const monthlySuccessful = Math.round(monthlyTxn * approval / 100);
    
    const marginalCostPerOperation = effectiveCostPerOp;
    
    // Revenue calculation
    // 1. Variable fee based on pricing model
    let variableRevenue = 0;
    if (client.pricingModel === 'perOperation') variableRevenue = price * proratedOps;
    else if (client.pricingModel === 'perTransaction') variableRevenue = price * proratedTxn;
    else if (client.pricingModel === 'perSuccessful') variableRevenue = price * proratedSuccessful;
    
    // 2. Fixed fee per transaction (charged on successful transactions)
    const txnFeeRevenue = fixedFeePerTxn * proratedSuccessful;
    
    // 3. One-time fee (only in start month, prorated if partial)
    const startDate = client.startDate ? new Date(client.startDate) : null;
    const isStartMonth = startDate && startDate.getMonth() === selectedMonth && startDate.getFullYear() === 2026;
    const oneTimeRevenue = isStartMonth ? oneTimeFee * factor : 0;
    
    // 4. Monthly fee (prorated for partial months)
    const monthlyFeeRevenue = monthlyFee * factor;
    
    const revenue = variableRevenue + txnFeeRevenue + oneTimeRevenue + monthlyFeeRevenue;
    
    const cost = marginalCostPerOperation * proratedOps;
    const profit = revenue - cost;
    const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    const targetPricePerOperation = marginalCostPerOperation / (1 - margin / 100);
    const targetPricePerTransaction = monthlyTxn > 0 ? (marginalCostPerOperation * monthlyOps) / (monthlyTxn * (1 - margin / 100)) : 0;
    const targetPricePerSuccessful = monthlySuccessful > 0 ? (marginalCostPerOperation * monthlyOps) / (monthlySuccessful * (1 - margin / 100)) : 0;
    
    return { 
      ...client, 
      filterRate,
      monthlySuccessful,
      proratedOps,
      proratedTxn,
      proratedSuccessful,
      factor,
      isActive: factor > 0,
      marginalCostPerOperation,
      variableRevenue,
      txnFeeRevenue,
      oneTimeRevenue,
      monthlyFeeRevenue,
      revenue, 
      cost, 
      profit, 
      margin: marginPct, 
      targetPricePerOperation,
      targetPricePerTransaction,
      targetPricePerSuccessful
    };
  });

  const totalNewVolume = clients.reduce((sum, c) => sum + num(c.monthlyOperations), 0);
  const totalRevenue = clientMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalCost = clientMetrics.reduce((sum, m) => sum + m.cost, 0);
  const totalProfit = clientMetrics.reduce((sum, m) => sum + m.profit, 0);
  const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const addClient = () => setClients([...clients, { id: Date.now(), name: `Client ${String.fromCharCode(65 + clients.length)}`, monthlyOperations: '2000000', monthlyTransactions: '1900000', approvalRate: '79', price: '0.01', pricingModel: 'perTransaction', fixedFeePerTxn: '0', oneTimeFee: '0', monthlyFee: '0', startDate: '2026-01-01', analyticsUrl: '', showAnalytics: false, providerAnalyticsUrl: '', showProviderAnalytics: false, customDevRevenue: '0', customDevCost: '0' }]);
  const updateClient = (id, field, value) => setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  const removeClient = (id) => { if (clients.length > 1) setClients(clients.filter(c => c.id !== id)); };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Unit Economics Calculator</h1>
            <p className="text-xs text-gray-500">Payment Gateway Cost Analysis</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b rounded-t-xl overflow-hidden border-gray-200 bg-white text-xs">
          <button 
            onClick={() => setActiveTab('costs')}
            className={`flex-1 px-3 py-2 font-medium transition-colors ${activeTab === 'costs' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📊 Costs & Coverage
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex-1 px-3 py-2 font-medium transition-colors ${activeTab === 'clients' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            👥 Client Pricing
          </button>
          <button 
            onClick={() => setActiveTab('profitability')}
            className={`flex-1 px-3 py-2 font-medium transition-colors ${activeTab === 'profitability' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            💰 Profitability
          </button>
        </div>

        {/* Content */}
        <div className="rounded-b-xl p-4 bg-white space-y-4">
          {/* Auto-save bar */}
          <div className="rounded-xl px-3 py-2 shadow-sm border flex items-center justify-between bg-white border-gray-200">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600">All changes saved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">EUR/USD:</span>
              <input type="number" step="0.01" value={eurToUsd} onChange={(e) => setEurToUsd(e.target.value)} className="w-14 px-2 py-1 border rounded text-center text-xs bg-white border-gray-200" />
            </div>
          </div>

          {/* COSTS & COVERAGE TAB */}
          {activeTab === 'costs' && (
          <>
          {/* 2025 COSTS - Collapsible */}
          <div className="rounded-xl shadow-sm border bg-white border-gray-200">
            <button 
              onClick={() => setShow2025Section(!show2025Section)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-100">
                  <span className="font-bold text-violet-600 text-sm">⚡</span>
                </div>
                <div className="text-left">
                  <h2 className="text-sm font-bold text-gray-800">{baselineYear} Marginal Costs</h2>
                  <p className="text-xs text-gray-500">Infrastructure only (scales with volume)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-violet-100 rounded-lg text-center font-bold text-xs text-violet-600">€{fmtNum(baselineYearly.total)}/yr</div>
                {show2025Section ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            
            {show2025Section && (
            <div className="p-4 pt-0 border-t border-gray-100">
            
            {/* Volume inputs - locked */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs mb-1 text-gray-500">Annual Operations</label>
                <div className="w-full px-2 py-1 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-600">{fmtNum(baselineAnnualOperations)}</div>
                <div className="text-xs text-gray-400 mt-0.5">{fmtM(baselineMonthlyOperations)}/mo</div>
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-500">Annual Transactions</label>
                <div className="w-full px-2 py-1 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-600">{fmtNum(baselineAnnualTransactions)}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-indigo-500">{fmt(baselineFilterRate, 0)}% of operations</span>
                  <button 
                    onClick={() => setShowBaselineAnalytics(!showBaselineAnalytics)}
                    className="text-gray-400 hover:text-indigo-500 transition-colors"
                    title="Decline analytics"
                  >
                    {showBaselineAnalytics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
                {showBaselineAnalytics && (
                  <div className="mt-1 p-2 bg-red-50 rounded border border-red-100">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs text-red-600 font-medium">{fmt(100 - baselineFilterRate, 0)}% filtered</span>
                      <ExternalLink className="w-3 h-3 text-red-400" />
                    </div>
                    <input 
                      type="url" 
                      value={baselineAnalyticsUrl} 
                      onChange={(e) => setBaselineAnalyticsUrl(e.target.value)}
                      placeholder="Analytics report URL..."
                      className="w-full px-2 py-1 text-xs border rounded bg-white border-red-200 placeholder-gray-400"
                    />
                    {baselineAnalyticsUrl && (
                      <a href={baselineAnalyticsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-1">
                        View decline report <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-500">Provider Approval Rate %</label>
                <div className="w-full px-2 py-1 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-600">{baselineApprovalRate}%</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-amber-500">{fmt(100 - num(baselineApprovalRate), 0)}% declined</span>
                  <button 
                    onClick={() => setShowBaselineProviderAnalytics(!showBaselineProviderAnalytics)}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                    title="Provider decline analytics"
                  >
                    {showBaselineProviderAnalytics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
                {showBaselineProviderAnalytics && (
                  <div className="mt-1 p-2 bg-amber-50 rounded border border-amber-100">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs text-amber-600 font-medium">{fmt(100 - num(baselineApprovalRate), 0)}% provider declined</span>
                      <ExternalLink className="w-3 h-3 text-amber-400" />
                    </div>
                    <input 
                      type="url" 
                      value={baselineProviderAnalyticsUrl} 
                      onChange={(e) => setBaselineProviderAnalyticsUrl(e.target.value)}
                      placeholder="Provider analytics URL..."
                      className="w-full px-2 py-1 text-xs border rounded bg-white border-amber-200 placeholder-gray-400"
                    />
                    {baselineProviderAnalyticsUrl && (
                      <a href={baselineProviderAnalyticsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline flex items-center gap-1 mt-1">
                        View provider report <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="rounded-lg p-2 flex flex-col justify-center bg-emerald-50">
                <div className="text-xs text-emerald-600">Successful</div>
                <div className="font-bold text-emerald-700 text-lg">{fmtM(baselineMonthlySuccessful)}/mo</div>
              </div>
            </div>

            {/* Flow visualization */}
            <FlowVisualization 
              operations={baselineMonthlyOperations}
              filterRate={baselineFilterRate}
              approvalRate={num(baselineApprovalRate)}
              transactions={baselineMonthlyTransactions}
              successful={baselineMonthlySuccessful}
              colorScheme="indigo"
            />

            <div className="mt-4">
              <CostTable costs={baselineCosts} setCosts={setBaselineCosts} newCost={newBaselineCost} setNewCost={setNewBaselineCost} color="bg-indigo-600" isLocked={baselineLocked} simple={true} yearly={true} />
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div><div className="text-xs text-gray-500">⚡ Infra (marginal)</div><div className="font-bold text-violet-600 text-sm">€{fmtNum(baselineYearly.total)}/yr</div><div className="text-xs text-gray-400">€{fmtNum(baselineMonthly.total)}/mo</div></div>
              </div>
              
              <div className="bg-violet-600 rounded-lg p-3 text-white">
                <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">Marginal Cost Per Unit</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75 mb-1">Per Operation</div>
                    <div className="text-lg font-bold">€{fmt(baselineCostPerOperation, 4)}</div>
                    <div className="text-xs opacity-75">all merchant requests</div>
                  </div>
                  <div className="bg-white/15 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75 mb-1">Per Transaction</div>
                    <div className="text-lg font-bold">€{fmt(baselineCostPerTransaction, 4)}</div>
                    <div className="text-xs opacity-75">sent to provider</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75 mb-1">Per Successful</div>
                    <div className="text-lg font-bold">€{fmt(baselineCostPerSuccessful, 4)}</div>
                    <div className="text-xs opacity-75">approved transactions</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            )}
          </div>

          {show2025Section && <div className="flex justify-center"><ArrowRight className="w-5 h-5 rotate-90 text-gray-400" /></div>}

          {/* 2026 MONTHLY TRACKING */}
          <div className="rounded-xl p-4 shadow-sm border bg-white border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                  <span className="font-bold text-purple-600 text-sm">📊</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">{projectedYear} Monthly Tracking</h2>
                  <p className="text-xs text-gray-500">
                    {confirmedMonths.length === 0 ? 'No months confirmed yet' : `${confirmedMonths.length} month${confirmedMonths.length > 1 ? 's' : ''} confirmed`}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-purple-100 rounded-lg text-center font-bold text-xs text-purple-600">{projectedYear}</div>
            </div>

            {/* Annual Costs Section */}
            <div className="mb-4 p-3 rounded-lg border bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-indigo-700">📅 Annual Costs (spread as /12)</div>
                <div className="text-xs text-indigo-500">
                  ⚡ €{fmtNum(annualCostsPerMonth.scalable)}/mo | 🏢 €{fmtNum(annualCostsPerMonth.overhead)}/mo
                </div>
              </div>
              <div className="space-y-1">
                {annualCosts.map((cost) => (
                  <div key={cost.id} className={`grid grid-cols-12 gap-2 items-center rounded p-1.5 ${cost.scalable ? 'bg-violet-50' : 'bg-white/60'}`}>
                    <div className="col-span-3">
                      <input type="text" value={cost.name} onChange={(e) => updateAnnualCost(cost.id, 'name', e.target.value)} className="w-full px-2 py-1 border rounded text-xs bg-white border-gray-200" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" value={cost.amount} onChange={(e) => updateAnnualCost(cost.id, 'amount', e.target.value)} className="w-full px-2 py-1 border rounded text-right text-xs bg-white border-gray-200" />
                    </div>
                    <div className="col-span-1">
                      <select value={cost.currency} onChange={(e) => updateAnnualCost(cost.id, 'currency', e.target.value)} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200">
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <button 
                        onClick={() => updateAnnualCost(cost.id, 'scalable', !cost.scalable)}
                        className={`w-full px-1 py-1 border rounded text-xs font-medium text-center ${cost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                      >
                        {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                      </button>
                    </div>
                    <div className="col-span-3 text-xs text-indigo-600 text-right">
                      →€{fmtNum(toEur(cost.amount, cost.currency) / 12)}/mo
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => deleteAnnualCost(cost.id)} className="p-0.5 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-12 gap-2 items-center border-t border-dashed pt-2 mt-1 border-indigo-200">
                  <div className="col-span-3"><input type="text" placeholder="New annual cost..." value={newAnnualCost.name} onChange={(e) => setNewAnnualCost({...newAnnualCost, name: e.target.value})} className="w-full px-2 py-1 border rounded text-xs bg-white border-gray-200" /></div>
                  <div className="col-span-2"><input type="number" placeholder="0" value={newAnnualCost.amount} onChange={(e) => setNewAnnualCost({...newAnnualCost, amount: e.target.value})} className="w-full px-2 py-1 border rounded text-right text-xs bg-white border-gray-200" /></div>
                  <div className="col-span-1"><select value={newAnnualCost.currency} onChange={(e) => setNewAnnualCost({...newAnnualCost, currency: e.target.value})} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200"><option value="EUR">EUR</option><option value="USD">USD</option></select></div>
                  <div className="col-span-2">
                    <button 
                      onClick={() => setNewAnnualCost({...newAnnualCost, scalable: !newAnnualCost.scalable})}
                      className={`w-full px-1 py-1 border rounded text-xs font-medium text-center ${newAnnualCost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                    >
                      {newAnnualCost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                    </button>
                  </div>
                  <div className="col-span-3"></div>
                  <div className="col-span-1"><button onClick={addAnnualCost} className="p-1 text-white rounded hover:opacity-80 bg-indigo-600"><Plus className="w-3 h-3" /></button></div>
                </div>
              </div>
            </div>

            {/* Month tabs */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
              {MONTHS.map((month, i) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(i)}
                  className={`px-2 py-1 text-xs rounded-lg flex-shrink-0 transition-colors ${
                    selectedMonth === i 
                      ? 'bg-purple-600 text-white' 
                      : monthlyData[i].confirmed 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {month} {monthlyData[i].confirmed && '✓'}
                </button>
              ))}
            </div>

            {/* Selected month details */}
            <div className={`rounded-lg p-3 mb-3 ${currentMonth.confirmed ? 'bg-emerald-50 border border-emerald-200' : 'bg-purple-50 border border-purple-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{MONTHS[selectedMonth]} {projectedYear}</span>
                  {currentMonth.confirmed && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded">✓ Confirmed</span>}
                </div>
                {!currentMonth.confirmed && (
                  <button 
                    onClick={() => confirmMonth(selectedMonth)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition-colors"
                  >
                    Confirm Month
                  </button>
                )}
              </div>

              {/* Volume from Clients - 2025 style header */}
              {activeClients.length > 0 ? (
              <div className="mb-3">
                {/* Input row style header */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Monthly Operations</div>
                    <div className="w-full px-2 py-1 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-600">{fmtNum(totalClientOperations)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{fmtM(totalClientOperations)}/mo</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Monthly Transactions</div>
                    <div className="w-full px-2 py-1 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-600">{fmtNum(totalClientTransactions)}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-indigo-500">{fmt(avgFilterRate, 0)}% of operations</span>
                      <button 
                        onClick={() => setShow2026Analytics(!show2026Analytics)}
                        className="text-gray-400 hover:text-indigo-500 transition-colors"
                        title="Decline analytics"
                      >
                        {show2026Analytics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                    {show2026Analytics && (
                      <div className="mt-1 p-2 bg-red-50 rounded border border-red-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-red-600 font-medium">{fmt(100 - avgFilterRate, 0)}% filtered</span>
                          <ExternalLink className="w-3 h-3 text-red-400" />
                        </div>
                        <input 
                          type="url" 
                          value={analytics2026Url} 
                          onChange={(e) => setAnalytics2026Url(e.target.value)}
                          placeholder="Analytics report URL..."
                          className="w-full px-2 py-1 text-xs border rounded bg-white border-red-200 placeholder-gray-400"
                        />
                        {analytics2026Url && (
                          <a href={analytics2026Url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-1">
                            View decline report <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Avg Provider Approval %</div>
                    <div className="w-full px-2 py-1 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-600">{fmt(avgApprovalRate, 0)}%</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-amber-500">{fmt(100 - avgApprovalRate, 0)}% declined</span>
                      <button 
                        onClick={() => setShow2026ProviderAnalytics(!show2026ProviderAnalytics)}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                        title="Provider decline analytics"
                      >
                        {show2026ProviderAnalytics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                    {show2026ProviderAnalytics && (
                      <div className="mt-1 p-2 bg-amber-50 rounded border border-amber-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-amber-600 font-medium">{fmt(100 - avgApprovalRate, 0)}% provider declined</span>
                          <ExternalLink className="w-3 h-3 text-amber-400" />
                        </div>
                        <input 
                          type="url" 
                          value={providerAnalytics2026Url} 
                          onChange={(e) => setProviderAnalytics2026Url(e.target.value)}
                          placeholder="Provider analytics URL..."
                          className="w-full px-2 py-1 text-xs border rounded bg-white border-amber-200 placeholder-gray-400"
                        />
                        {providerAnalytics2026Url && (
                          <a href={providerAnalytics2026Url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline flex items-center gap-1 mt-1">
                            View provider report <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg p-2 flex flex-col justify-center bg-emerald-50">
                    <div className="text-xs text-emerald-600">Successful</div>
                    <div className="font-bold text-emerald-700 text-lg">{fmtM(totalClientSuccessful)}/mo</div>
                  </div>
                </div>
                
                {/* Flow Visualization */}
                <FlowVisualization 
                  operations={totalClientOperations}
                  filterRate={avgFilterRate}
                  approvalRate={avgApprovalRate}
                  transactions={totalClientTransactions}
                  successful={totalClientSuccessful}
                  colorScheme="indigo"
                />
                
                {/* Client breakdown */}
                <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 mb-2">👥 {activeClients.length} of {clients.length} clients active in {MONTHS[selectedMonth]}</div>
                  <div className="space-y-1">
                    {selectedMonthVolume.clientDetails.map(c => {
                      const daysActive = c.isPartial ? Math.round(c.factor * getDaysInMonth(2026, selectedMonth)) : 0;
                      return (
                      <div key={c.id} className={`flex items-center justify-between text-xs ${c.isActive ? '' : 'opacity-40'}`}>
                        <div className="flex items-center gap-2">
                          <span className={c.isActive ? 'text-gray-700' : 'text-gray-400'}>{c.name}</span>
                          {c.isPartial && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                              {fmt(c.factor * 100, 0)}% ({daysActive}d)
                            </span>
                          )}
                          {!c.isActive && (
                            <span className="text-gray-400">starts {c.startDate}</span>
                          )}
                        </div>
                        <span className={c.isActive ? 'font-medium text-gray-700' : 'text-gray-400'}>
                          {c.isActive ? `${fmtNum(c.activeOps)} ops` : '—'}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              ) : (
              <div className="mb-3 p-3 rounded-lg border bg-amber-50 border-amber-200">
                <div className="text-xs font-semibold text-amber-700 mb-1">⚠️ No clients active in {MONTHS[selectedMonth]}</div>
                <div className="text-xs text-amber-600">
                  Check client start dates in the Clients tab.
                </div>
              </div>
              )}

              {/* Costs for this month */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-gray-600">Monthly Costs</div>
                  <div className="text-xs text-gray-400">⚡ = scales with volume</div>
                </div>
                <div className="space-y-1">
                  {currentMonth.costs.map((cost) => {
                    const isTiered = cost.tipiered && cost.tiers && cost.tiers.length > 0;
                    const tieredAmount = isTiered ? calculateTieredCost(cost.tiers, totalClientOperations) : 0;
                    const displayAmount = isTiered ? tieredAmount : cost.amount;
                    
                    return (
                    <div key={cost.id}>
                      <div className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${cost.scalable ? 'bg-violet-50' : 'bg-gray-50'}`}>
                        <div className="col-span-4 flex items-center gap-1">
                          {currentMonth.confirmed ? (
                            <div className="w-full px-2 py-1 border rounded text-sm bg-gray-100 text-gray-600 border-gray-200">{cost.name}</div>
                          ) : (
                            <input 
                              type="text" 
                              value={cost.name} 
                              onChange={(e) => updateMonthCost(selectedMonth, cost.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200" 
                            />
                          )}
                          {isTiered && (
                            <button 
                              onClick={() => setExpandedTiers(expandedTiers === cost.id ? null : cost.id)}
                              className="text-violet-400 hover:text-violet-600 transition-colors flex-shrink-0"
                              title="View tier breakdown"
                            >
                              {expandedTiers === cost.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        <div className="col-span-2">
                          {isTiered ? (
                            <div className="w-full px-2 py-1 border rounded text-right text-sm bg-violet-100 text-violet-700 border-violet-200 font-medium">
                              {fmtNum(displayAmount)}
                              <span className="text-xs ml-1">📊</span>
                            </div>
                          ) : currentMonth.confirmed ? (
                            <div className="w-full px-2 py-1 border rounded text-right text-sm bg-gray-100 text-gray-600 border-gray-200">{fmtNum(cost.amount)}</div>
                          ) : (
                            <input 
                              type="number" 
                              value={cost.amount} 
                              onChange={(e) => updateMonthCost(selectedMonth, cost.id, 'amount', e.target.value)}
                              className="w-full px-2 py-1 border rounded text-right text-sm bg-white border-gray-200" 
                            />
                          )}
                        </div>
                        <div className="col-span-2">
                          {currentMonth.confirmed ? (
                            <div className="w-full px-2 py-1 border rounded text-sm bg-gray-100 text-gray-600 border-gray-200">{cost.currency}</div>
                          ) : (
                            <select 
                              value={cost.currency} 
                              onChange={(e) => updateMonthCost(selectedMonth, cost.id, 'currency', e.target.value)}
                              className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200"
                            >
                              <option value="EUR">EUR</option>
                              <option value="USD">USD</option>
                            </select>
                          )}
                        </div>
                        <div className="col-span-3">
                          {currentMonth.confirmed ? (
                            <div className={`w-full px-2 py-1 border rounded text-sm font-medium text-center ${cost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                              {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                            </div>
                          ) : (
                            <button 
                              onClick={() => updateMonthCost(selectedMonth, cost.id, 'scalable', !cost.scalable)}
                              className={`w-full px-2 py-1 border rounded text-sm font-medium text-center transition-colors ${cost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-200' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                            </button>
                          )}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {!currentMonth.confirmed && !isTiered && (
                            <button onClick={() => deleteMonthCost(selectedMonth, cost.id)} className="p-1 text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Tier breakdown */}
                      {isTiered && expandedTiers === cost.id && (
                        <div className="ml-4 mt-1 p-3 bg-violet-50/70 rounded-lg border border-violet-200">
                          <div className="text-xs font-medium text-violet-600 mb-2">📊 Tiered Pricing (based on {fmtM(totalClientOperations)} operations)</div>
                          <div className="space-y-1">
                            {cost.tiers.map((tier, idx) => {
                              const prevCap = idx === 0 ? 0 : cost.tiers[idx - 1].upTo;
                              const tierCap = tier.upTo || Infinity;
                              const tierRange = tierCap - prevCap;
                              const opsInTier = Math.max(0, Math.min(totalClientOperations - prevCap, tierRange));
                              const tierCost = opsInTier * tier.rate;
                              const isActive = opsInTier > 0;
                              
                              return (
                                <div key={idx} className={`flex items-center justify-between text-xs p-2 rounded ${isActive ? 'bg-white border border-violet-200' : 'bg-gray-50 text-gray-400'}`}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{tier.upTo ? `${fmtM(prevCap)} - ${fmtM(tier.upTo)}` : `${fmtM(prevCap)}+`}</span>
                                    <span className="text-gray-400">@</span>
                                    <span className="font-mono">${tier.rate.toFixed(5)}/op</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-500">{fmtM(opsInTier)} ops</span>
                                    <span className={`font-medium ${isActive ? 'text-violet-600' : ''}`}>${fmtNum(tierCost)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-2 pt-2 border-t border-violet-200 flex justify-between text-xs">
                            <span className="text-violet-600 font-medium">Total:</span>
                            <span className="font-bold text-violet-700">${fmtNum(tieredAmount)} ({cost.currency})</span>
                          </div>
                          {!currentMonth.confirmed && (
                            <div className="mt-2 pt-2 border-t border-violet-200">
                              <div className="text-xs text-gray-500 mb-2">Edit tiers:</div>
                              <div className="space-y-1">
                                {cost.tiers.map((tier, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400 w-12">Tier {idx + 1}:</span>
                                    <span className="text-gray-500">up to</span>
                                    <input 
                                      type="number" 
                                      value={tier.upTo || ''} 
                                      onChange={(e) => {
                                        const newTiers = [...cost.tiers];
                                        newTiers[idx] = { ...tier, upTo: e.target.value ? Number(e.target.value) : null };
                                        updateMonthCost(selectedMonth, cost.id, 'tiers', newTiers);
                                      }}
                                      placeholder="∞"
                                      className="w-24 px-2 py-1 border rounded text-right border-violet-200 bg-white"
                                    />
                                    <span className="text-gray-500">ops @</span>
                                    <input 
                                      type="number" 
                                      step="0.00001"
                                      value={tier.rate} 
                                      onChange={(e) => {
                                        const newTiers = [...cost.tiers];
                                        newTiers[idx] = { ...tier, rate: Number(e.target.value) || 0 };
                                        updateMonthCost(selectedMonth, cost.id, 'tiers', newTiers);
                                      }}
                                      className="w-24 px-2 py-1 border rounded text-right border-violet-200 bg-white"
                                    />
                                    <span className="text-gray-500">/op</span>
                                  </div>
                                ))}
                              </div>
                              <button 
                                onClick={() => {
                                  const newTiers = [...cost.tiers, { upTo: null, rate: 0.0001 }];
                                  updateMonthCost(selectedMonth, cost.id, 'tiers', newTiers);
                                }}
                                className="mt-2 text-xs text-violet-600 hover:text-violet-800"
                              >
                                + Add tier
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    );
                  })}
                  {!currentMonth.confirmed && (
                    <div className="grid grid-cols-12 gap-2 items-center border-t border-dashed pt-2 mt-2 border-gray-300">
                      <div className="col-span-4"><input type="text" placeholder="New cost..." value={newProjectedCost.name} onChange={(e) => setNewProjectedCost({...newProjectedCost, name: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200" /></div>
                      <div className="col-span-2"><input type="number" placeholder="0" value={newProjectedCost.amount} onChange={(e) => setNewProjectedCost({...newProjectedCost, amount: e.target.value})} className="w-full px-2 py-1 border rounded text-right text-sm bg-white border-gray-200" /></div>
                      <div className="col-span-2"><select value={newProjectedCost.currency} onChange={(e) => setNewProjectedCost({...newProjectedCost, currency: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200"><option value="EUR">EUR</option><option value="USD">USD</option></select></div>
                      <div className="col-span-3">
                        <button 
                          onClick={() => setNewProjectedCost({...newProjectedCost, scalable: !newProjectedCost.scalable})}
                          className={`w-full px-2 py-1 border rounded text-sm font-medium text-center ${newProjectedCost.scalable ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                        >
                          {newProjectedCost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                        </button>
                      </div>
                      <div className="col-span-1"><button onClick={() => addMonthCost(selectedMonth)} className="p-1 text-white rounded hover:opacity-80 bg-purple-600"><Plus className="w-4 h-4" /></button></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Month summary */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600 mb-1">Cost Breakdown</div>
                    <div className="flex justify-between"><span className="text-violet-600">⚡ Infra (scales):</span><span className="font-medium text-violet-700">€{fmtNum(currentMonthScalable)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">🏢 Overhead (fixed):</span><span className="font-medium">€{fmtNum(currentMonthOverhead)}</span></div>
                    <div className="flex justify-between border-t pt-1 border-gray-300"><span className="text-gray-700 font-medium">Total:</span><span className="font-bold text-gray-800">€{fmtNum(currentMonthTotalWithAnnual)}</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600 mb-1">Cost Per Operation</div>
                    <div className="flex justify-between"><span className="text-violet-600">Marginal (infra):</span><span className="font-bold text-violet-700">€{fmt(marginalCostPerOp, 4)}</span></div>
                    <div className="flex justify-between"><span className="text-indigo-500">Fully loaded:</span><span className="font-bold text-indigo-700">€{fmt(fullyLoadedCostPerOp, 4)}</span></div>
                    <div className="text-xs text-gray-400 mt-1">Marginal = price floor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* YTD Summary - only show if at least one month confirmed */}
            {confirmedMonthCount > 0 && (
              <div className="bg-indigo-600 rounded-lg p-3 text-white">
                <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">
                  YTD Cost Per Unit ({confirmedMonthCount} month{confirmedMonthCount > 1 ? 's' : ''})
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-violet-500/40 rounded-lg p-2">
                    <div className="text-xs opacity-75 mb-1">⚡ Marginal (infra only)</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><div className="text-xs opacity-60">Per Op</div><div className="font-bold">€{fmt(ytdMarginalPerOp, 4)}</div></div>
                      <div><div className="text-xs opacity-60">Per Txn</div><div className="font-bold">€{fmt(ytdMarginalPerTxn, 4)}</div></div>
                      <div><div className="text-xs opacity-60">Per Success</div><div className="font-bold">€{fmt(ytdMarginalPerSuccess, 4)}</div></div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <div className="text-xs opacity-75 mb-1">💰 Fully Loaded (all costs)</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><div className="text-xs opacity-60">Per Op</div><div className="font-bold">€{fmt(ytdCostPerOp, 4)}</div></div>
                      <div><div className="text-xs opacity-60">Per Txn</div><div className="font-bold">€{fmt(ytdCostPerTxn, 4)}</div></div>
                      <div><div className="text-xs opacity-60">Per Success</div><div className="font-bold">€{fmt(ytdCostPerSuccess, 4)}</div></div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20 text-center text-xs">
                  <span className="opacity-75">YTD Infra: €{fmtNum(ytdScalableCosts)} | Total: €{fmtNum(ytdCosts)}</span>
                </div>
              </div>
            )}

            {/* Show current month cost per unit if no months confirmed yet */}
            {confirmedMonthCount === 0 && (
              <div className="rounded-lg overflow-hidden">
                <div className="bg-violet-600 p-3 text-white">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">
                    ⚡ Marginal Cost (infra only) - price floor
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-75 mb-1">Per Operation</div>
                      <div className="text-lg font-bold">€{fmt(marginalCostPerOp, 4)}</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-75 mb-1">Per Transaction</div>
                      <div className="text-lg font-bold">€{fmt(marginalCostPerTxn, 4)}</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-75 mb-1">Per Successful</div>
                      <div className="text-lg font-bold">€{fmt(marginalCostPerSuccess, 4)}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-600 p-3 text-white">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">
                    💰 Fully Loaded (all costs) - break even
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-75 mb-1">Per Operation</div>
                      <div className="text-lg font-bold">€{fmt(fullyLoadedCostPerOp, 4)}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-75 mb-1">Per Transaction</div>
                      <div className="text-lg font-bold">€{fmt(fullyLoadedCostPerTxn, 4)}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-75 mb-1">Per Successful</div>
                      <div className="text-lg font-bold">€{fmt(fullyLoadedCostPerSuccess, 4)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COVERAGE SUMMARY */}
          {(() => {
            const monthCustomDevTotal = clients.reduce((sum, c) => sum + num(getCustomDev(c.id, selectedMonth).revenue), 0);
            const monthCustomCostTotal = clients.reduce((sum, c) => sum + num(getCustomDev(c.id, selectedMonth).cost), 0);
            const totalRevenueWithCustom = totalRevenue + monthCustomDevTotal;
            const totalCostsWithCustom = currentMonthTotalWithAnnual + monthCustomCostTotal;
            
            return (
          <div className="rounded-xl p-4 shadow-sm border bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100">
                <span className="font-bold text-emerald-600 text-sm">💰</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Coverage Summary</h2>
                <p className="text-xs text-gray-500">{MONTHS[selectedMonth]} revenue vs. costs</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total monthly costs:</span>
                  <span className="font-bold text-gray-800">€{fmtNum(totalCostsWithCustom)}</span>
                </div>
                {monthCustomCostTotal > 0 && (
                  <div className="text-xs text-gray-400 text-right">incl. €{fmtNum(monthCustomCostTotal)} dev cost</div>
                )}
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  {clients.map((client, i) => {
                    const txnRev = clientMetrics[i]?.revenue || 0;
                    const customRev = num(getCustomDev(client.id, selectedMonth).revenue);
                    const totalClientRev = txnRev + customRev;
                    return (
                    <div key={client.id} className="flex justify-between text-xs">
                      <span className="text-emerald-600">{client.name} revenue:</span>
                      <span className="font-medium text-emerald-700">
                        €{fmtNum(totalClientRev)}
                        {customRev > 0 && (
                          <span className="text-gray-400 font-normal"> (€{fmtNum(txnRev)} txn + €{fmtNum(customRev)} dev)</span>
                        )}
                      </span>
                    </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
                  <span className="text-gray-700 font-medium">Total revenue:</span>
                  <span className="font-bold text-emerald-700">€{fmtNum(totalRevenueWithCustom)}</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center p-3 rounded-lg bg-white border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Coverage</div>
                <div className={`text-3xl font-bold ${totalRevenueWithCustom >= totalCostsWithCustom ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {totalCostsWithCustom > 0 ? fmt((totalRevenueWithCustom / totalCostsWithCustom) * 100, 0) : 0}%
                </div>
                {totalRevenueWithCustom < totalCostsWithCustom ? (
                  <div className="text-xs text-amber-600 mt-1">
                    Gap: €{fmtNum(totalCostsWithCustom - totalRevenueWithCustom)}
                  </div>
                ) : (
                  <div className="text-xs text-emerald-600 mt-1">
                    Profit: €{fmtNum(totalRevenueWithCustom - totalCostsWithCustom)}
                  </div>
                )}
                <button 
                  onClick={() => setActiveTab('clients')}
                  className="mt-2 text-xs text-indigo-600 hover:underline"
                >
                  → Configure client pricing
                </button>
              </div>
            </div>
          </div>
            );
          })()}
          </>
          )}

          {/* CLIENT PRICING TAB */}
          {activeTab === 'clients' && (
          <>
          {/* Company Break-even Summary */}
          <div className="rounded-xl p-4 shadow-sm border bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100">
                <Target className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Break-even Analysis</h2>
                <p className="text-xs text-gray-500">How much volume to cover all costs?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500">Monthly Costs</div>
                <div className="text-lg font-bold text-gray-800">€{fmtNum(currentMonthTotalWithAnnual)}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500">Current Revenue</div>
                <div className="text-lg font-bold text-emerald-600">€{fmtNum(totalRevenue)}</div>
              </div>
              <div className={`rounded-lg p-3 border ${totalRevenue >= currentMonthTotalWithAnnual ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="text-xs text-gray-500">{totalRevenue >= currentMonthTotalWithAnnual ? 'Surplus' : 'Gap to Break-even'}</div>
                <div className={`text-lg font-bold ${totalRevenue >= currentMonthTotalWithAnnual ? 'text-emerald-600' : 'text-red-600'}`}>
                  €{fmtNum(Math.abs(totalRevenue - currentMonthTotalWithAnnual))}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Revenue vs Costs</span>
                <span>{totalRevenue > 0 ? fmt((totalRevenue / currentMonthTotalWithAnnual) * 100, 1) : '0'}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${totalRevenue >= currentMonthTotalWithAnnual ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min((totalRevenue / currentMonthTotalWithAnnual) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            {/* Break-even requirements */}
            {totalRevenue < currentMonthTotalWithAnnual && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-3">To break even, you need:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <div className="text-xs text-gray-500 mb-2">Set target price per txn:</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">€</span>
                      <input 
                        type="number" 
                        step="0.001" 
                        value={breakEvenPrice} 
                        onChange={(e) => setBreakEvenPrice(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-sm font-bold bg-white border-indigo-300 text-indigo-700"
                      />
                      <span className="text-xs text-gray-400">/txn</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Current avg: €{fmt(totalClientTransactions > 0 ? totalRevenue / totalClientTransactions : 0, 4)}/txn
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <div className="text-xs text-gray-500 mb-2">Transactions needed:</div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {num(breakEvenPrice) > 0 ? fmtM(Math.ceil(currentMonthTotalWithAnnual / num(breakEvenPrice))) : '∞'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Current: {fmtM(totalClientTransactions)} txn
                      {num(breakEvenPrice) > 0 && totalClientTransactions > 0 && (
                        <span className={num(breakEvenPrice) * totalClientTransactions >= currentMonthTotalWithAnnual ? ' text-emerald-600' : ' text-amber-600'}>
                          {' '}({num(breakEvenPrice) * totalClientTransactions >= currentMonthTotalWithAnnual ? '✓ covers costs' : `need +${fmtM(Math.ceil(currentMonthTotalWithAnnual / num(breakEvenPrice)) - totalClientTransactions)} more`})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Quick price presets */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Quick set:</span>
                  <button onClick={() => setBreakEvenPrice(fmt(effectiveMarginalPerTxn, 4))} className="px-2 py-1 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded text-xs">Marginal €{fmt(effectiveMarginalPerTxn, 4)}</button>
                  <button onClick={() => setBreakEvenPrice(fmt(currentMonthTotalWithAnnual / totalClientTransactions, 4))} className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-xs">Break-even €{fmt(totalClientTransactions > 0 ? currentMonthTotalWithAnnual / totalClientTransactions : 0, 4)}</button>
                  <button onClick={() => setBreakEvenPrice(fmt((currentMonthTotalWithAnnual / totalClientTransactions) * 1.3, 4))} className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded text-xs">+30% margin €{fmt(totalClientTransactions > 0 ? (currentMonthTotalWithAnnual / totalClientTransactions) * 1.3 : 0, 4)}</button>
                </div>
              </div>
            )}
            
            {totalRevenue >= currentMonthTotalWithAnnual && (
              <div className="bg-emerald-100 rounded-lg p-3 border border-emerald-200 text-center">
                <span className="text-emerald-700 font-medium">✓ You're above break-even!</span>
                <span className="text-emerald-600 text-sm ml-2">Margin: {fmt(((totalRevenue - currentMonthTotalWithAnnual) / totalRevenue) * 100, 1)}%</span>
              </div>
            )}
          </div>

          {/* CLIENTS */}
          <div className="rounded-xl p-4 shadow-sm border bg-white border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Client Portfolio</h2>
                  <p className="text-xs text-gray-500">
                    {activeClients.length} of {clients.length} active in {MONTHS[selectedMonth]} • {fmtNum(totalClientOperations)} ops
                  </p>
                </div>
              </div>
              <button onClick={addClient} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs">
                <Plus className="w-3 h-3" /> Add Client
              </button>
            </div>

            {/* Client Cards */}
            {clients.map((client, index) => {
              const metrics = clientMetrics[index] || {};
              const isActive = metrics.isActive !== false;
              const isPartial = isActive && (metrics.factor || 1) < 1;
              const isExpanded = expandedClients.includes(client.id);
              
              // Calculate summary values for collapsed view
              const clientOps = metrics.proratedOps || num(client.monthlyOperations);
              const clientShare = totalClientOperations > 0 ? clientOps / totalClientOperations : 0;
              const clientCost = clientShare * currentMonthTotalWithAnnual;
              const clientProfit = (metrics.revenue || 0) - clientCost;
              const clientMargin = (metrics.revenue || 0) > 0 ? (clientProfit / (metrics.revenue || 1)) * 100 : 0;
              
              // Border color based on status
              const borderColor = isActive 
                ? (isPartial ? 'border-l-amber-400' : 'border-l-emerald-500')
                : 'border-l-gray-300';
              
              return (
                <div key={client.id} className={`rounded-lg border mb-3 overflow-hidden border-l-4 ${borderColor} border-gray-200 bg-white`}>
                  {/* Collapsed Header - Always Visible */}
                  <div 
                    className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleClientExpanded(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        <Users className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                        <span className="font-medium text-sm">{client.name}</span>
                        {isActive ? (
                          isPartial ? (
                            <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-xs font-medium">
                              ⏳ {fmt((metrics.factor || 1) * 100, 0)}% in {MONTHS[selectedMonth]}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-medium">
                              ✓ {totalClientOperations > 0 ? fmt(((metrics.proratedOps || 0) / totalClientOperations) * 100, 0) : 0}% of volume
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-500 text-white rounded text-xs font-medium">
                            📅 Starts {client.startDate || '2026-01-01'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{fmtM(clientOps)} ops</span>
                          <span className="text-emerald-600 font-medium">€{fmtNum(metrics.revenue || 0)} rev</span>
                          <span className={`font-bold ${clientProfit >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>€{fmtNum(clientProfit)} profit</span>
                          <span className={`font-bold ${clientMargin >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{fmt(clientMargin, 1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-200">
                      {/* Header row with date and delete */}
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Name:</span>
                          <input type="text" value={client.name} onChange={(e) => updateClient(client.id, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="px-2 py-1 border rounded font-medium w-28 text-xs bg-white border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">Start:</span>
                            <input 
                              type="date" 
                              value={client.startDate || '2026-01-01'} 
                              onChange={(e) => updateClient(client.id, 'startDate', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="px-1 py-0.5 border rounded text-xs bg-white border-gray-200"
                            />
                          </div>
                          {clients.length > 1 && <button onClick={(e) => { e.stopPropagation(); removeClient(client.id); }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>}
                        </div>
                      </div>
                  
                  {/* Client Volume - Input Row */}
                  <div className="mb-2">
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Monthly Operations</div>
                        <input type="number" value={client.monthlyOperations} onChange={(e) => updateClient(client.id, 'monthlyOperations', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 border-gray-200" />
                        <div className="text-xs text-gray-400 mt-1">{fmtM(num(client.monthlyOperations))}/mo</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Monthly Transactions</div>
                        <input type="number" value={client.monthlyTransactions} onChange={(e) => updateClient(client.id, 'monthlyTransactions', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 border-gray-200" />
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-blue-500">{fmt(metrics.filterRate || 0, 0)}% of operations</span>
                          <button 
                            onClick={() => updateClient(client.id, 'showAnalytics', !client.showAnalytics)}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Decline analytics"
                          >
                            {client.showAnalytics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                        {client.showAnalytics && (
                          <div className="mt-1 p-2 bg-red-50 rounded border border-red-100">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs text-red-600 font-medium">{fmt(100 - (metrics.filterRate || 0), 0)}% filtered</span>
                              <ExternalLink className="w-3 h-3 text-red-400" />
                            </div>
                            <input 
                              type="url" 
                              value={client.analyticsUrl || ''} 
                              onChange={(e) => updateClient(client.id, 'analyticsUrl', e.target.value)}
                              placeholder="Analytics report URL..."
                              className="w-full px-2 py-1 text-xs border rounded bg-white border-red-200 placeholder-gray-400"
                            />
                            {client.analyticsUrl && (
                              <a href={client.analyticsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-1">
                                View decline report <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Provider Approval Rate %</div>
                        <input type="number" value={client.approvalRate} onChange={(e) => updateClient(client.id, 'approvalRate', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 border-gray-200" />
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-amber-500">{fmt(100 - num(client.approvalRate), 0)}% declined</span>
                          <button 
                            onClick={() => updateClient(client.id, 'showProviderAnalytics', !client.showProviderAnalytics)}
                            className="text-gray-400 hover:text-amber-500 transition-colors"
                            title="Provider decline analytics"
                          >
                            {client.showProviderAnalytics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                        {client.showProviderAnalytics && (
                          <div className="mt-1 p-2 bg-amber-50 rounded border border-amber-100">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs text-amber-600 font-medium">{fmt(100 - num(client.approvalRate), 0)}% provider declined</span>
                              <ExternalLink className="w-3 h-3 text-amber-400" />
                            </div>
                            <input 
                              type="url" 
                              value={client.providerAnalyticsUrl || ''} 
                              onChange={(e) => updateClient(client.id, 'providerAnalyticsUrl', e.target.value)}
                              placeholder="Provider analytics URL..."
                              className="w-full px-2 py-1 text-xs border rounded bg-white border-amber-200 placeholder-gray-400"
                            />
                            {client.providerAnalyticsUrl && (
                              <a href={client.providerAnalyticsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline flex items-center gap-1 mt-1">
                                View provider report <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <div className="text-xs text-emerald-600 font-medium">Successful</div>
                        <div className="text-xl font-bold text-emerald-600">{fmtM(metrics.monthlySuccessful || 0)}/mo</div>
                      </div>
                    </div>
                    
                    {/* Flow Visualization */}
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-xs text-indigo-600 mb-1">
                            <CreditCard className="w-3 h-3" />
                            <span>Operations</span>
                          </div>
                          <div className="text-2xl font-bold text-indigo-700">{fmtM(num(client.monthlyOperations))}</div>
                          <div className="text-xs text-gray-500">all merchant requests</div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <ArrowRight className="w-5 h-5 text-gray-300" />
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-medium">
                            {fmt(100 - (metrics.filterRate || 0), 0)}% filtered
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-xs text-indigo-600 mb-1">
                            <Filter className="w-3 h-3" />
                            <span>Transactions</span>
                          </div>
                          <div className="text-2xl font-bold text-indigo-700">{fmtM(num(client.monthlyTransactions))}</div>
                          <div className="text-xs text-gray-500">sent to provider</div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <ArrowRight className="w-5 h-5 text-gray-300" />
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-xs font-medium">
                            {fmt(num(client.approvalRate), 0)}% approved
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 mb-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Successful</span>
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">{fmtM(metrics.monthlySuccessful || 0)}</div>
                          <div className="text-xs text-gray-500">approved transactions</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="mb-2 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">💰 Pricing</div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Left column - Variable pricing */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <select value={client.pricingModel} onChange={(e) => updateClient(client.id, 'pricingModel', e.target.value)} className="px-2 py-1 border rounded text-xs bg-white border-gray-200">
                            <option value="perTransaction">Per Transaction</option>
                            <option value="perSuccessful">Per Successful</option>
                          </select>
                          <span className="text-xs text-gray-400">€</span>
                          <input type="number" step="0.0001" value={client.price} onChange={(e) => updateClient(client.id, 'price', e.target.value)} className="w-20 px-2 py-1 border rounded text-xs bg-white border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-28">+ Fixed/success:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input type="number" step="0.01" value={client.fixedFeePerTxn} onChange={(e) => updateClient(client.id, 'fixedFeePerTxn', e.target.value)} className="w-20 px-2 py-1 border rounded text-xs bg-white border-gray-200" />
                        </div>
                      </div>
                      {/* Right column - Fixed fees */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">Monthly fee:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input type="number" step="1" value={client.monthlyFee} onChange={(e) => updateClient(client.id, 'monthlyFee', e.target.value)} className="w-24 px-2 py-1 border rounded text-xs bg-white border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">One-time fee:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input type="number" step="1" value={client.oneTimeFee} onChange={(e) => updateClient(client.id, 'oneTimeFee', e.target.value)} className="w-24 px-2 py-1 border rounded text-xs bg-white border-gray-200" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Marginal Cost Comparison */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2">⚡ Marginal Cost (infra only) - price floor</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded-lg ${client.pricingModel === 'perTransaction' ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'}`}>
                          <div className="text-xs text-gray-500">Per Transaction</div>
                          <div className="text-sm font-bold text-violet-700">€{fmt(effectiveMarginalPerTxn, 4)}</div>
                          {client.pricingModel === 'perTransaction' && (
                            <div className={`text-xs mt-1 ${num(client.price) >= effectiveMarginalPerTxn ? 'text-emerald-600' : 'text-red-500'}`}>
                              {num(client.price) >= effectiveMarginalPerTxn ? '✓' : '⚠'} Your price: €{fmt(num(client.price), 4)}
                            </div>
                          )}
                        </div>
                        <div className={`p-2 rounded-lg ${client.pricingModel === 'perSuccessful' ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'}`}>
                          <div className="text-xs text-gray-500">Per Successful</div>
                          <div className="text-sm font-bold text-violet-700">€{fmt(effectiveMarginalPerSuccess, 4)}</div>
                          {client.pricingModel === 'perSuccessful' && (
                            <div className={`text-xs mt-1 ${num(client.price) >= effectiveMarginalPerSuccess ? 'text-emerald-600' : 'text-red-500'}`}>
                              {num(client.price) >= effectiveMarginalPerSuccess ? '✓' : '⚠'} Your price: €{fmt(num(client.price), 4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Marginal Contribution (toward company break-even) */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2">📊 Contribution to Company Break-even</div>
                      {(() => {
                        const clientTxn = metrics.proratedTxn || num(client.monthlyTransactions);
                        const clientSuccessful = metrics.proratedSuccessful || metrics.monthlySuccessful || 0;
                        // Client's marginal cost = their volume × marginal cost per unit
                        const clientMarginalCost = clientTxn * effectiveMarginalPerTxn;
                        // Contribution = revenue - marginal cost (goes toward fixed costs)
                        const contribution = (metrics.revenue || 0) - clientMarginalCost;
                        // What price would cover just marginal cost (floor)
                        const minPricePerTxn = effectiveMarginalPerTxn;
                        const minPricePerSuccess = effectiveMarginalPerSuccess;
                        return (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-lg bg-gray-50">
                            <div className="text-xs text-gray-500">Revenue</div>
                            <div className="text-sm font-bold text-emerald-600">€{fmtNum(metrics.revenue || 0)}</div>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-50">
                            <div className="text-xs text-gray-500">Marginal Cost</div>
                            <div className="text-sm font-bold text-violet-600">€{fmtNum(clientMarginalCost)}</div>
                            <div className="text-xs text-gray-400">{fmtM(clientTxn)} × €{fmt(effectiveMarginalPerTxn, 4)}</div>
                          </div>
                          <div className={`p-2 rounded-lg ${contribution >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="text-xs text-gray-500">Contribution</div>
                            <div className={`text-sm font-bold ${contribution >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>€{fmtNum(contribution)}</div>
                            <div className="text-xs text-gray-400">toward fixed costs</div>
                          </div>
                        </div>
                        
                        <div className={`p-2 rounded-lg text-xs ${contribution >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {contribution >= 0 ? (
                            <span>✓ This client contributes <strong>€{fmtNum(contribution)}/mo</strong> toward covering fixed costs</span>
                          ) : (
                            <span>⚠ This client doesn't cover their marginal cost. Losing <strong>€{fmtNum(Math.abs(contribution))}/mo</strong></span>
                          )}
                        </div>
                        
                        {/* Min price to be worth it */}
                        <div className="p-2 rounded-lg bg-gray-50 text-xs">
                          <div className="text-gray-500 mb-1">Minimum price to contribute (cover marginal cost):</div>
                          <div className="flex gap-4">
                            <span className={client.pricingModel === 'perTransaction' ? 'font-bold text-violet-700' : 'text-gray-600'}>
                              Per Txn: €{fmt(minPricePerTxn, 4)}
                            </span>
                            <span className={client.pricingModel === 'perSuccessful' ? 'font-bold text-violet-700' : 'text-gray-600'}>
                              Per Success: €{fmt(minPricePerSuccess, 4)}
                            </span>
                          </div>
                        </div>
                      </div>
                        );
                      })()}
                    </div>
                    
                    {/* Revenue breakdown */}
                    {(metrics.revenue || 0) > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <span>Revenue: </span>
                        {(metrics.variableRevenue || 0) > 0 && <span className="text-emerald-600">€{fmtNum(metrics.variableRevenue)} variable</span>}
                        {(metrics.txnFeeRevenue || 0) > 0 && <span className="text-emerald-600"> + €{fmtNum(metrics.txnFeeRevenue)} txn fees</span>}
                        {(metrics.monthlyFeeRevenue || 0) > 0 && <span className="text-emerald-600"> + €{fmtNum(metrics.monthlyFeeRevenue)} monthly</span>}
                        {(metrics.oneTimeRevenue || 0) > 0 && <span className="text-blue-600"> + €{fmtNum(metrics.oneTimeRevenue)} one-time</span>}
                        <span className="font-medium text-gray-700"> = €{fmtNum(metrics.revenue)}</span>
                      </div>
                    )}
                  </div>

                  {/* Client Summary Bar */}
                  <div className={`rounded-lg p-3 ${clientProfit >= 0 ? 'bg-emerald-600' : 'bg-emerald-700'}`}>
                    <div className="grid grid-cols-5 gap-2 text-center text-white">
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xs opacity-75">Operations</div>
                        <div className="text-sm font-bold">{fmtM(clientOps)}/mo</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xs opacity-75">Revenue</div>
                        <div className="text-sm font-bold">€{fmtNum(metrics.revenue || 0)}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xs opacity-75">Cost</div>
                        <div className="text-sm font-bold">€{fmtNum(clientCost)}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xs opacity-75">Profit</div>
                        <div className={`text-sm font-bold ${clientProfit >= 0 ? '' : 'text-amber-300'}`}>€{fmtNum(clientProfit)}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xs opacity-75">Margin</div>
                        <div className={`text-sm font-bold ${clientMargin >= 0 ? '' : 'text-amber-300'}`}>{fmt(clientMargin, 1)}%</div>
                      </div>
                    </div>
                  </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Combined Summary */}
            <div className="mt-4 bg-emerald-600 rounded-lg p-3 text-white">
              <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">Combined: {clients.length} Client{clients.length > 1 ? 's' : ''}</div>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Operations</div>
                  <div className="text-sm font-bold">{fmtM(totalClientOperations)}/mo</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Revenue</div>
                  <div className="text-sm font-bold">€{fmtNum(totalRevenue)}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Cost</div>
                  <div className="text-sm font-bold">€{fmtNum(currentMonthTotalWithAnnual)}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Profit</div>
                  <div className={`text-lg font-bold ${(totalRevenue - currentMonthTotalWithAnnual) >= 0 ? '' : 'text-amber-300'}`}>€{fmtNum(totalRevenue - currentMonthTotalWithAnnual)}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Margin</div>
                  <div className={`text-lg font-bold ${(totalRevenue - currentMonthTotalWithAnnual) >= 0 ? '' : 'text-amber-300'}`}>{totalRevenue > 0 ? fmt(((totalRevenue - currentMonthTotalWithAnnual) / totalRevenue) * 100, 1) : '0.0'}%</div>
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* PROFITABILITY TAB */}
          {activeTab === 'profitability' && (
          <>
          {/* Month tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {MONTHS.map((month, i) => {
              // Check if month has any custom dev entries
              const hasCustomDev = clients.some(c => {
                const dev = getCustomDev(c.id, i);
                return num(dev.revenue) > 0 || num(dev.cost) > 0;
              });
              return (
                <button
                  key={month}
                  onClick={() => setProfitabilityMonth(i)}
                  className={`px-2 py-1 text-xs rounded-lg flex-shrink-0 transition-colors ${
                    profitabilityMonth === i 
                      ? 'bg-purple-600 text-white' 
                      : hasCustomDev
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {month} {hasCustomDev && '💼'}
                </button>
              );
            })}
          </div>

          {(() => {
            // Calculate metrics for profitability month
            const profitMonthVolume = getMonthlyVolume(profitabilityMonth);
            const profitActiveClients = profitMonthVolume.clientDetails.filter(c => c.isActive);
            const profitTotalOps = profitMonthVolume.ops;
            const profitTotalTxn = profitMonthVolume.txn;
            const profitTotalSuccessful = profitMonthVolume.successful;
            
            // Calculate revenue per client for this month
            const profitClientMetrics = clients.map((client, index) => {
              const detail = profitMonthVolume.clientDetails[index];
              if (!detail.isActive) return { revenue: 0, txn: 0, successful: 0 };
              
              const txn = detail.activeTxn;
              const successful = detail.activeSuccessful;
              let revenue = 0;
              
              if (client.pricingModel === 'perTransaction') {
                revenue = txn * num(client.price);
              } else if (client.pricingModel === 'perSuccessful') {
                revenue = successful * num(client.price);
              }
              revenue += txn * num(client.fixedFeePerTxn);
              revenue += num(client.monthlyFee) * (detail.isPartial ? detail.factor : 1);
              
              return { revenue, txn, successful, isActive: detail.isActive, factor: detail.factor };
            });
            
            const profitTotalTxnRevenue = profitClientMetrics.reduce((sum, m) => sum + m.revenue, 0);
            const profitTotalCustomRev = clients.reduce((sum, c) => sum + num(getCustomDev(c.id, profitabilityMonth).revenue), 0);
            const profitTotalCustomCost = clients.reduce((sum, c) => sum + num(getCustomDev(c.id, profitabilityMonth).cost), 0);
            const profitTotalRevenue = profitTotalTxnRevenue + profitTotalCustomRev;
            
            // Get costs for this month (with tiered costs based on operations)
            const profitMonthData = monthlyData[profitabilityMonth];
            const profitMonthCostsSplit = calculateCostsSplit(profitMonthData.costs, profitTotalOps);
            const profitMonthCosts = profitMonthCostsSplit.total;
            const profitMonthTotal = profitMonthCosts + annualCostsPerMonth.total;
            const profitMonthScalable = profitMonthCostsSplit.scalable + annualCostsPerMonth.scalable;
            
            const profitNetProfit = profitTotalRevenue - profitMonthTotal - profitTotalCustomCost;
            
            return (
            <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="rounded-xl p-4 shadow-sm border bg-white border-gray-200">
                <div className="text-xs text-gray-500">Txn Revenue ({MONTHS[profitabilityMonth]})</div>
                <div className="text-xl font-bold text-emerald-600">€{fmtNum(profitTotalTxnRevenue)}</div>
                <div className="text-xs text-gray-400">{fmtM(profitTotalTxn)} txn</div>
              </div>
              <div className="rounded-xl p-4 shadow-sm border bg-white border-gray-200">
                <div className="text-xs text-gray-500">Custom Dev ({MONTHS[profitabilityMonth]})</div>
                <div className="text-xl font-bold text-purple-600">€{fmtNum(profitTotalCustomRev)}</div>
                <div className="text-xs text-gray-400">{profitTotalCustomCost > 0 ? `€${fmtNum(profitTotalCustomCost)} cost` : 'one-time projects'}</div>
              </div>
              <div className="rounded-xl p-4 shadow-sm border bg-white border-gray-200">
                <div className="text-xs text-gray-500">Total Revenue</div>
                <div className="text-xl font-bold text-gray-800">€{fmtNum(profitTotalRevenue)}</div>
                <div className="text-xs text-gray-400">vs €{fmtNum(profitMonthTotal)} costs</div>
              </div>
              <div className={`rounded-xl p-4 shadow-sm border ${profitNetProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="text-xs text-gray-500">Net Profit</div>
                <div className={`text-xl font-bold ${profitNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  €{fmtNum(profitNetProfit)}
                </div>
                <div className="text-xs text-gray-400">{profitTotalRevenue > 0 ? `${fmt((profitNetProfit / profitTotalRevenue) * 100, 0)}% margin` : 'after all costs'}</div>
              </div>
            </div>

            {/* Client Profitability Table */}
            <div className="rounded-xl shadow-sm border bg-white border-purple-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-800">{MONTHS[profitabilityMonth]} {projectedYear} Profitability</h2>
                      <p className="text-xs text-gray-500">{profitActiveClients.length} of {clients.length} clients active</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-10 gap-2 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                <div className="col-span-2">Client</div>
                <div className="col-span-2 text-right">Txn Revenue</div>
                <div className="col-span-3 text-right">Custom Development</div>
                <div className="col-span-1 text-right">Total</div>
                <div className="col-span-2 text-right">Contribution</div>
              </div>
              
              {/* Client Rows */}
              {clients.map((client, index) => {
                const metrics = profitClientMetrics[index];
                const txnRevenue = metrics.revenue || 0;
                const customDev = getCustomDev(client.id, profitabilityMonth);
                const customDevRev = num(customDev.revenue);
                const customDevCost = num(customDev.cost);
                const totalClientRevenue = txnRevenue + customDevRev;
                const clientTxn = metrics.txn || 0;
                const clientMarginalCost = clientTxn * effectiveMarginalPerTxn;
                const contribution = totalClientRevenue - clientMarginalCost - customDevCost;
                const detail = profitMonthVolume.clientDetails[index];
                
                return (
                  <div key={client.id} className={`grid grid-cols-10 gap-2 p-3 border-b border-gray-100 hover:bg-gray-50 text-sm items-center ${!detail.isActive ? 'opacity-50' : ''}`}>
                    <div className="col-span-2">
                      <div className="font-medium text-gray-800">{client.name}</div>
                      <div className="text-xs text-gray-400">
                        {detail.isActive ? (
                          <>
                            {fmtM(clientTxn)} txn
                            {detail.isPartial && <span className="ml-1 text-amber-600">({fmt(detail.factor * 100, 0)}%)</span>}
                          </>
                        ) : (
                          <span className="text-gray-400">inactive</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className={`font-medium ${txnRevenue > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>€{fmtNum(txnRevenue)}</div>
                    </div>
                    <div className="col-span-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Rev:</span>
                          <input 
                            type="number" 
                            value={customDev.revenue} 
                            onChange={(e) => setCustomDev(client.id, profitabilityMonth, 'revenue', e.target.value)}
                            className="w-24 px-2 py-1 border rounded text-xs text-right bg-white border-gray-200"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Cost:</span>
                          <input 
                            type="number" 
                            value={customDev.cost} 
                            onChange={(e) => setCustomDev(client.id, profitabilityMonth, 'cost', e.target.value)}
                            className="w-24 px-2 py-1 border rounded text-xs text-right bg-gray-50 border-gray-200 text-gray-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="font-bold text-gray-800">€{fmtNum(totalClientRevenue)}</div>
                    </div>
                    <div className="col-span-2 text-right">
                      {detail.isActive ? (
                        <>
                          <div className={`font-bold ${contribution >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            €{fmtNum(contribution)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {contribution >= 0 ? '✓' : '⚠'} after marginal
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400">—</div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Totals Row */}
              <div className="grid grid-cols-10 gap-2 p-3 bg-purple-50 text-sm font-bold">
                <div className="col-span-2 text-gray-700">Total</div>
                <div className="col-span-2 text-right text-emerald-600">€{fmtNum(profitTotalTxnRevenue)}</div>
                <div className="col-span-3 text-right text-purple-600">€{fmtNum(profitTotalCustomRev)} rev / €{fmtNum(profitTotalCustomCost)} cost</div>
                <div className="col-span-1 text-right text-gray-800">€{fmtNum(profitTotalRevenue)}</div>
                <div className="col-span-2 text-right text-emerald-600">
                  €{fmtNum(clients.reduce((sum, c, i) => {
                    const m = profitClientMetrics[i];
                    const dev = getCustomDev(c.id, profitabilityMonth);
                    const marginalCost = (m.txn || 0) * effectiveMarginalPerTxn;
                    return sum + ((m.revenue || 0) + num(dev.revenue) - marginalCost - num(dev.cost));
                  }, 0))}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="rounded-xl p-4 shadow-sm border bg-white border-gray-200">
              <div className="text-xs font-semibold text-gray-600 mb-3">📊 {MONTHS[profitabilityMonth]} Profit Waterfall</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 p-3 rounded-lg bg-emerald-50 text-center">
                  <div className="text-xs text-gray-500">Total Revenue</div>
                  <div className="font-bold text-emerald-600">€{fmtNum(profitTotalRevenue)}</div>
                </div>
                <div className="text-gray-400">−</div>
                <div className="flex-1 p-3 rounded-lg bg-violet-50 text-center">
                  <div className="text-xs text-gray-500">Marginal Costs</div>
                  <div className="font-bold text-violet-600">€{fmtNum(profitTotalTxn * effectiveMarginalPerTxn)}</div>
                </div>
                <div className="text-gray-400">−</div>
                <div className="flex-1 p-3 rounded-lg bg-blue-50 text-center">
                  <div className="text-xs text-gray-500">Fixed Costs</div>
                  <div className="font-bold text-blue-600">€{fmtNum(profitMonthTotal - profitMonthScalable)}</div>
                </div>
                <div className="text-gray-400">−</div>
                <div className="flex-1 p-3 rounded-lg bg-purple-50 text-center">
                  <div className="text-xs text-gray-500">Dev Cost</div>
                  <div className="font-bold text-purple-600">€{fmtNum(profitTotalCustomCost)}</div>
                </div>
                <div className="text-gray-400">=</div>
                <div className={`flex-1 p-3 rounded-lg text-center ${profitNetProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  <div className="text-xs text-gray-500">Net Profit</div>
                  <div className={`font-bold ${profitNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    €{fmtNum(profitNetProfit)}
                  </div>
                </div>
              </div>
            </div>
            </>
            );
          })()}
          </>
          )}
        </div>
      </div>
    </div>
  );
}
