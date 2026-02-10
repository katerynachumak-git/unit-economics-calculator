import { useState } from 'react';
import { Trash2, Plus, Cloud, ArrowRight, Copy, Users, Target, Filter, CreditCard, CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

// Helper functions (outside component to avoid recreation)
const fmt = (val, dec = 2) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);
const fmtNum = (val) => new Intl.NumberFormat('en-US').format(Math.round(val));
const fmtM = (val) => {
  if (val >= 1000000) return fmt(val / 1000000, 1) + 'M';
  if (val >= 1000) return fmt(val / 1000, 0) + 'K';
  return fmtNum(val);
};

// Cost Table Component (outside main component)
function CostTable({ costs, setCosts, newCost, setNewCost, color, isLocked = false }) {
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
      setNewCost({ name: '', amount: '', currency: 'EUR', type: 'fixed' });
    }
  };

  const isTeamCost = (cost) => cost.name.toLowerCase().includes('team') || cost.name.toLowerCase().includes('salar');
  const isSubscriptionCost = (cost) => cost.name.toLowerCase().includes('subscription') || cost.name.toLowerCase().includes('saas') || cost.name.toLowerCase().includes('license');

  const lockedInputClass = "bg-gray-100 text-gray-600 cursor-not-allowed";
  const editableInputClass = "bg-white";

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 text-xs font-medium px-1 text-gray-500">
        <div className="col-span-4">Service</div>
        <div className="col-span-2">{isLocked ? 'Amount /year' : 'Amount'}</div>
        <div className="col-span-2">Currency</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-1"></div>
      </div>
      {costs.map((cost) => (
        <div key={cost.id}>
          <div className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${cost.type === 'fixed' ? 'bg-blue-50' : cost.type === 'variable' ? 'bg-amber-50' : 'bg-purple-50'} ${isLocked ? 'opacity-90' : ''}`}>
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
              <select 
                value={cost.type} 
                onChange={(e) => updateCost(cost.id, 'type', e.target.value)} 
                disabled={isLocked}
                className={`w-full px-2 py-1 border rounded text-sm font-medium ${cost.type === 'fixed' ? 'bg-blue-100 border-blue-300 text-blue-700' : cost.type === 'variable' ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-purple-100 border-purple-300 text-purple-700'} ${isLocked ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
                <option value="tiered">Tiered</option>
              </select>
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
          <div className="col-span-3"><select value={newCost.type} onChange={(e) => setNewCost({...newCost, type: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200"><option value="fixed">Fixed</option><option value="variable">Variable</option><option value="tiered">Tiered</option></select></div>
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
          <div className="text-xs text-gray-500">all requests</div>
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
          <div className="text-xs text-gray-500">approved</div>
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
  const [baselineAnnualOperations, setBaselineAnnualOperations] = useState('48000000');
  const [baselineAnnualTransactions, setBaselineAnnualTransactions] = useState('45600000');
  const [baselineApprovalRate, setBaselineApprovalRate] = useState('79');
  const [baselineCosts, setBaselineCosts] = useState([
    { id: 1, name: 'AWS (base servers)', amount: 96000, currency: 'USD', type: 'fixed' },
    { id: 2, name: 'Team (salaries)', amount: 1920839, currency: 'EUR', type: 'fixed' },
    { id: 3, name: 'Subscriptions', amount: 300000, currency: 'EUR', type: 'fixed' },
  ]);
  const baselineLocked = true; // 2025 figures are locked
  
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
      { id: 1, name: 'AWS', amount: 1200, currency: 'USD', type: 'fixed', scalable: true },
      { id: 2, name: 'Hetzner', amount: 500, currency: 'EUR', type: 'fixed', scalable: true },
      { id: 3, name: 'Team (salaries)', amount: 160000, currency: 'EUR', type: 'fixed', scalable: false, teamBreakdown: { Product: '', Dev: '', DevOps: '', Security: '' } },
      { id: 4, name: 'Subscriptions', amount: 25000, currency: 'EUR', type: 'fixed', scalable: false, subscriptionsUrl: '' },
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
  
  const [newBaselineCost, setNewBaselineCost] = useState({ name: '', amount: '', currency: 'EUR', type: 'fixed' });
  
  // Analytics URLs (hidden by default) - for baseline only now
  const [baselineAnalyticsUrl, setBaselineAnalyticsUrl] = useState('');
  const [showBaselineAnalytics, setShowBaselineAnalytics] = useState(false);
  const [baselineProviderAnalyticsUrl, setBaselineProviderAnalyticsUrl] = useState('');
  const [showBaselineProviderAnalytics, setShowBaselineProviderAnalytics] = useState(false);
  
  // CLIENTS
  const [clients, setClients] = useState([
    { id: 1, name: 'Client A', monthlyOperations: '4000000', monthlyTransactions: '3800000', approvalRate: '79', price: '0.01', pricingModel: 'perOperation', startDate: '2026-01-01', analyticsUrl: '', showAnalytics: false, providerAnalyticsUrl: '', showProviderAnalytics: false },
    { id: 2, name: 'Client B', monthlyOperations: '1000000', monthlyTransactions: '950000', approvalRate: '82', price: '0.015', pricingModel: 'perOperation', startDate: '2026-02-16', analyticsUrl: '', showAnalytics: false, providerAnalyticsUrl: '', showProviderAnalytics: false },
  ]);
  const [targetMargin, setTargetMargin] = useState('30');

  // Helpers - parse strings to numbers
  const num = (val) => Number(val) || 0;
  const toEur = (amount, currency) => currency === 'USD' ? amount / num(eurToUsd) : amount;

  // Calculations
  const calculateCosts = (costs, isYearly = false) => {
    let fixed = 0, variable = 0, tiered = 0;
    costs.forEach(c => {
      const amountEur = toEur(c.amount, c.currency);
      const monthlyAmount = isYearly ? amountEur / 12 : amountEur;
      if (c.type === 'fixed') fixed += monthlyAmount;
      else if (c.type === 'variable') variable += monthlyAmount;
      else if (c.type === 'tiered') tiered += monthlyAmount;
    });
    return { fixed, variable, tiered, total: fixed + variable + tiered };
  };

  // BASELINE calculations (yearly amounts)
  const baselineMonthlyOperations = num(baselineAnnualOperations) / 12;
  const baselineMonthlyTransactions = num(baselineAnnualTransactions) / 12;
  const baselineFilterRate = num(baselineAnnualOperations) > 0 ? (num(baselineAnnualTransactions) / num(baselineAnnualOperations)) * 100 : 0;
  const baselineMonthlySuccessful = Math.round(baselineMonthlyTransactions * num(baselineApprovalRate) / 100);
  
  const baselineMonthly = calculateCosts(baselineCosts, true); // yearly amounts
  const baselineYearly = { fixed: baselineMonthly.fixed * 12, variable: baselineMonthly.variable * 12, tiered: baselineMonthly.tiered * 12, total: baselineMonthly.total * 12 };
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
  const calculateCostsSplit = (costs) => {
    let scalable = 0, fixed = 0;
    costs.forEach(c => {
      const amountEur = toEur(c.amount, c.currency);
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
  
  // Current month costs split
  const currentMonthCosts = calculateCosts(currentMonth.costs);
  const currentMonthSplit = calculateCostsSplit(currentMonth.costs);
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
  const ytdMonthlyCosts = confirmedMonths.reduce((sum, m) => sum + calculateCosts(m.costs).total, 0);
  const ytdMonthlyScalable = confirmedMonths.reduce((sum, m) => sum + calculateCostsSplit(m.costs).scalable, 0);
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
    
    // Revenue/cost based on prorated volumes for selected month
    let revenue = 0;
    if (client.pricingModel === 'perOperation') revenue = price * proratedOps;
    else if (client.pricingModel === 'perTransaction') revenue = price * proratedTxn;
    else if (client.pricingModel === 'perSuccessful') revenue = price * proratedSuccessful;
    
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

  const addClient = () => setClients([...clients, { id: Date.now(), name: `Client ${String.fromCharCode(65 + clients.length)}`, monthlyOperations: '2000000', monthlyTransactions: '1900000', approvalRate: '79', price: '0.01', pricingModel: 'perOperation', startDate: '2026-01-01', analyticsUrl: '', showAnalytics: false, providerAnalyticsUrl: '', showProviderAnalytics: false }]);
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
          {/* BASELINE */}
          <div className="rounded-xl p-4 shadow-sm border bg-white border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100">
                  <span className="font-bold text-indigo-600 text-sm">1</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Baseline <span className="text-xs font-normal text-gray-400">🔒 Locked</span></h2>
                  <p className="text-xs text-gray-500">Actual yearly costs & volume (read-only)</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-indigo-100 rounded-lg text-center font-bold text-xs text-indigo-600">{baselineYear}</div>
            </div>
            
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
                <div className="text-xs text-emerald-600">{fmt(num(baselineApprovalRate), 0)}% approved</div>
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
              <CostTable costs={baselineCosts} setCosts={setBaselineCosts} newCost={newBaselineCost} setNewCost={setNewBaselineCost} color="bg-indigo-600" isLocked={baselineLocked} />
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div><div className="text-xs text-gray-500">Fixed</div><div className="font-bold text-blue-600 text-sm">€{fmtNum(baselineYearly.fixed)}/yr</div><div className="text-xs text-gray-400">€{fmtNum(baselineMonthly.fixed)}/mo</div></div>
                <div><div className="text-xs text-gray-500">Variable</div><div className="font-bold text-amber-600 text-sm">€{fmtNum(baselineYearly.variable)}/yr</div><div className="text-xs text-gray-400">€{fmtNum(baselineMonthly.variable)}/mo</div></div>
                <div><div className="text-xs text-gray-500">Tiered</div><div className="font-bold text-purple-600 text-sm">€{fmtNum(baselineYearly.tiered)}/yr</div><div className="text-xs text-gray-400">€{fmtNum(baselineMonthly.tiered)}/mo</div></div>
                <div><div className="text-xs text-gray-500">Total</div><div className="font-bold text-gray-800 text-sm">€{fmtNum(baselineYearly.total)}/yr</div><div className="text-xs text-gray-400">€{fmtNum(baselineMonthly.total)}/mo</div></div>
              </div>
              
              <div className="bg-indigo-600 rounded-lg p-3 text-white">
                <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">Cost Per Unit</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75 mb-1">Per Operation</div>
                    <div className="text-lg font-bold">€{fmt(baselineCostPerOperation, 4)}</div>
                    <div className="text-xs opacity-75">all requests</div>
                  </div>
                  <div className="bg-white/15 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75 mb-1">Per Transaction</div>
                    <div className="text-lg font-bold">€{fmt(baselineCostPerTransaction, 4)}</div>
                    <div className="text-xs opacity-75">sent to provider</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75 mb-1">Per Successful</div>
                    <div className="text-lg font-bold">€{fmt(baselineCostPerSuccessful, 4)}</div>
                    <div className="text-xs opacity-75">approved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><ArrowRight className="w-5 h-5 rotate-90 text-gray-400" /></div>

          {/* 2026 MONTHLY TRACKING */}
          <div className="rounded-xl p-4 shadow-sm border bg-white border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                  <span className="font-bold text-purple-600 text-sm">2</span>
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
                  <div key={cost.id} className={`grid grid-cols-12 gap-2 items-center rounded p-1.5 ${cost.scalable ? 'bg-cyan-50' : 'bg-white/60'}`}>
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
                        className={`w-full px-1 py-1 border rounded text-xs font-medium text-center ${cost.scalable ? 'bg-cyan-100 border-cyan-300 text-cyan-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
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
                      className={`w-full px-1 py-1 border rounded text-xs font-medium text-center ${newAnnualCost.scalable ? 'bg-cyan-100 border-cyan-300 text-cyan-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
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

              {/* Volume from Clients */}
              <div className={`mb-3 p-3 rounded-lg border ${activeClients.length > 0 ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-xs font-semibold ${activeClients.length > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    📊 Volume for {MONTHS[selectedMonth]} ({activeClients.length} of {clients.length} client{clients.length !== 1 ? 's' : ''} active)
                  </div>
                  <div className={`text-xs ${activeClients.length > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {activeClients.length > 0 ? '↓ See Clients tab for details' : '⚠️ No clients active yet'}
                  </div>
                </div>
                {activeClients.length > 0 ? (
                  <>
                    <div className="grid grid-cols-4 gap-3 mb-2">
                      <div>
                        <div className="text-xs text-gray-500">Operations</div>
                        <div className="font-bold text-emerald-700">{fmtNum(totalClientOperations)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Transactions</div>
                        <div className="font-bold text-emerald-700">{fmtNum(totalClientTransactions)}</div>
                        <div className="text-xs text-emerald-500">{fmt(avgFilterRate, 0)}% of ops</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Avg Approval</div>
                        <div className="font-bold text-emerald-700">{fmt(avgApprovalRate, 0)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Successful</div>
                        <div className="font-bold text-emerald-700">{fmtNum(totalClientSuccessful)}</div>
                      </div>
                    </div>
                    {/* Client breakdown */}
                    <div className="border-t border-emerald-200 pt-2 space-y-1">
                      {selectedMonthVolume.clientDetails.map(c => {
                        const daysActive = c.isPartial ? Math.round(c.factor * getDaysInMonth(2026, selectedMonth)) : 0;
                        return (
                        <div key={c.id} className={`flex items-center justify-between text-xs ${c.isActive ? '' : 'opacity-40'}`}>
                          <div className="flex items-center gap-2">
                            <span className={c.isActive ? 'text-emerald-700' : 'text-gray-400'}>{c.name}</span>
                            {c.isPartial && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                                {fmt(c.factor * 100, 0)}% ({daysActive}d)
                              </span>
                            )}
                            {!c.isActive && (
                              <span className="text-gray-400">starts {c.startDate}</span>
                            )}
                          </div>
                          <span className={c.isActive ? 'font-medium text-emerald-700' : 'text-gray-400'}>
                            {c.isActive ? `${fmtNum(c.activeOps)} ops` : '—'}
                          </span>
                        </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-amber-600">
                    No clients active in {MONTHS[selectedMonth]}. Check client start dates in the Clients tab.
                  </div>
                )}
              </div>

              {/* Costs for this month */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-gray-600">Monthly Costs</div>
                  <div className="text-xs text-gray-400">⚡ = scales with volume</div>
                </div>
                <div className="space-y-1">
                  {currentMonth.costs.map((cost) => (
                    <div key={cost.id} className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${cost.scalable ? 'bg-cyan-50' : 'bg-gray-50'}`}>
                      <div className="col-span-4">
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
                      </div>
                      <div className="col-span-2">
                        {currentMonth.confirmed ? (
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
                          <div className={`w-full px-2 py-1 border rounded text-sm font-medium text-center ${cost.scalable ? 'bg-cyan-100 border-cyan-300 text-cyan-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                            {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                          </div>
                        ) : (
                          <button 
                            onClick={() => updateMonthCost(selectedMonth, cost.id, 'scalable', !cost.scalable)}
                            className={`w-full px-2 py-1 border rounded text-sm font-medium text-center transition-colors ${cost.scalable ? 'bg-cyan-100 border-cyan-300 text-cyan-700 hover:bg-cyan-200' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
                          >
                            {cost.scalable ? '⚡ Infra' : '🏢 Overhead'}
                          </button>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {!currentMonth.confirmed && (
                          <button onClick={() => deleteMonthCost(selectedMonth, cost.id)} className="p-1 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {!currentMonth.confirmed && (
                    <div className="grid grid-cols-12 gap-2 items-center border-t border-dashed pt-2 mt-2 border-gray-300">
                      <div className="col-span-4"><input type="text" placeholder="New cost..." value={newProjectedCost.name} onChange={(e) => setNewProjectedCost({...newProjectedCost, name: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200" /></div>
                      <div className="col-span-2"><input type="number" placeholder="0" value={newProjectedCost.amount} onChange={(e) => setNewProjectedCost({...newProjectedCost, amount: e.target.value})} className="w-full px-2 py-1 border rounded text-right text-sm bg-white border-gray-200" /></div>
                      <div className="col-span-2"><select value={newProjectedCost.currency} onChange={(e) => setNewProjectedCost({...newProjectedCost, currency: e.target.value})} className="w-full px-2 py-1 border rounded text-sm bg-white border-gray-200"><option value="EUR">EUR</option><option value="USD">USD</option></select></div>
                      <div className="col-span-3">
                        <button 
                          onClick={() => setNewProjectedCost({...newProjectedCost, scalable: !newProjectedCost.scalable})}
                          className={`w-full px-2 py-1 border rounded text-sm font-medium text-center ${newProjectedCost.scalable ? 'bg-cyan-100 border-cyan-300 text-cyan-700' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
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
                    <div className="flex justify-between"><span className="text-cyan-600">⚡ Infra (scales):</span><span className="font-medium text-cyan-700">€{fmtNum(currentMonthScalable)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">🏢 Overhead (fixed):</span><span className="font-medium">€{fmtNum(currentMonthOverhead)}</span></div>
                    <div className="flex justify-between border-t pt-1 border-gray-300"><span className="text-gray-700 font-medium">Total:</span><span className="font-bold text-gray-800">€{fmtNum(currentMonthTotalWithAnnual)}</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600 mb-1">Cost Per Operation</div>
                    <div className="flex justify-between"><span className="text-cyan-600">Marginal (infra):</span><span className="font-bold text-cyan-700">€{fmt(marginalCostPerOp, 4)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Fully loaded:</span><span className="font-bold text-gray-800">€{fmt(fullyLoadedCostPerOp, 4)}</span></div>
                    <div className="text-xs text-gray-400 mt-1">Marginal = price floor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* YTD Summary - only show if at least one month confirmed */}
            {confirmedMonthCount > 0 && (
              <div className="bg-purple-600 rounded-lg p-3 text-white">
                <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">
                  YTD Cost Per Unit ({confirmedMonthCount} month{confirmedMonthCount > 1 ? 's' : ''})
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-cyan-500/30 rounded-lg p-2">
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
                <div className="bg-cyan-600 p-3 text-white">
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
                <div className="bg-gray-700 p-3 text-white">
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
          <div className="rounded-xl p-4 shadow-sm border bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100">
                <span className="font-bold text-emerald-600 text-sm">💰</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Coverage Summary</h2>
                <p className="text-xs text-gray-500">Revenue from clients vs. your costs</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total monthly costs:</span>
                  <span className="font-bold text-gray-800">€{fmtNum(currentMonthTotalWithAnnual)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  {clients.map((client, i) => (
                    <div key={client.id} className="flex justify-between text-xs">
                      <span className="text-emerald-600">{client.name} revenue:</span>
                      <span className="font-medium text-emerald-700">€{fmtNum(clientMetrics[i]?.revenue || 0)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
                  <span className="text-gray-700 font-medium">Total revenue:</span>
                  <span className="font-bold text-emerald-700">€{fmtNum(totalRevenue)}</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center p-3 rounded-lg bg-white border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Coverage</div>
                <div className={`text-3xl font-bold ${totalRevenue >= currentMonthTotalWithAnnual ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {currentMonthTotalWithAnnual > 0 ? fmt((totalRevenue / currentMonthTotalWithAnnual) * 100, 0) : 0}%
                </div>
                {totalRevenue < currentMonthTotalWithAnnual ? (
                  <div className="text-xs text-amber-600 mt-1">
                    Gap: €{fmtNum(currentMonthTotalWithAnnual - totalRevenue)}
                  </div>
                ) : (
                  <div className="text-xs text-emerald-600 mt-1">
                    Profit: €{fmtNum(totalRevenue - currentMonthTotalWithAnnual)}
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
          </>
          )}

          {/* CLIENT PRICING TAB */}
          {activeTab === 'clients' && (
          <>
          {/* Cost context bar */}
          <div className="rounded-xl px-4 py-3 shadow-sm border bg-gradient-to-r from-cyan-50 to-gray-50 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-600">⚡ Marginal:</span>
                  <span className="font-bold text-cyan-700">€{fmt(effectiveMarginalPerOp, 4)}/op</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">💰 Fully loaded:</span>
                  <span className="font-bold text-gray-700">€{fmt(effectiveFullyLoadedPerOp, 4)}/op</span>
                </div>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500">Total: €{fmtNum(currentMonthTotalWithAnnual)}/mo</span>
              </div>
              <button 
                onClick={() => setActiveTab('costs')}
                className="text-xs text-indigo-600 hover:underline"
              >
                ← Edit costs
              </button>
            </div>
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

            {/* Target Margin */}
            <div className="mb-3 p-3 rounded-lg border bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-800">Target Margin</span>
                <input type="number" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} className="w-14 px-2 py-1 border rounded text-center text-xs border-amber-300" />
                <span className="text-xs text-amber-700">%</span>
              </div>
            </div>

            {/* Client Cards */}
            {clients.map((client, index) => {
              const metrics = clientMetrics[index] || {};
              const isActive = metrics.isActive !== false;
              return (
                <div key={client.id} className={`p-3 rounded-lg border mb-3 ${isActive ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-gray-100 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <input type="text" value={client.name} onChange={(e) => updateClient(client.id, 'name', e.target.value)} className="px-2 py-1 border rounded font-medium w-24 text-xs bg-white border-gray-200" />
                      {isActive ? (
                        (metrics.factor || 1) < 1 ? (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                            {fmt((metrics.factor || 1) * 100, 0)}% in {MONTHS[selectedMonth]}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {totalClientOperations > 0 ? fmt(((metrics.proratedOps || 0) / totalClientOperations) * 100, 0) : 0}% of volume
                          </span>
                        )
                      ) : (
                        <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded text-xs">
                          Not active in {MONTHS[selectedMonth]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">Start:</span>
                        <input 
                          type="date" 
                          value={client.startDate || '2026-01-01'} 
                          onChange={(e) => updateClient(client.id, 'startDate', e.target.value)} 
                          className="px-1 py-0.5 border rounded text-xs bg-white border-gray-200"
                        />
                      </div>
                      {clients.length > 1 && <button onClick={() => removeClient(client.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>}
                    </div>
                  </div>
                  
                  {/* Client flow inputs */}
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    <div>
                      <label className="block text-xs mb-1 text-gray-500">Monthly Ops</label>
                      <input type="number" value={client.monthlyOperations} onChange={(e) => updateClient(client.id, 'monthlyOperations', e.target.value)} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-500">Monthly Txn</label>
                      <input type="number" value={client.monthlyTransactions} onChange={(e) => updateClient(client.id, 'monthlyTransactions', e.target.value)} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-500">Approval %</label>
                      <input type="number" value={client.approvalRate} onChange={(e) => updateClient(client.id, 'approvalRate', e.target.value)} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-500">Pricing</label>
                      <select value={client.pricingModel} onChange={(e) => updateClient(client.id, 'pricingModel', e.target.value)} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200">
                        <option value="perOperation">Per Op</option>
                        <option value="perTransaction">Per Txn</option>
                        <option value="perSuccessful">Per Success</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-gray-500">Price €</label>
                      <input type="number" step="0.0001" value={client.price} onChange={(e) => updateClient(client.id, 'price', e.target.value)} className="w-full px-1 py-1 border rounded text-xs bg-white border-gray-200" />
                    </div>
                    <div className="rounded p-1 bg-amber-100">
                      <label className="block text-xs text-amber-700">For {targetMargin}%</label>
                      <div className="text-xs font-bold text-amber-800">
                        €{fmt(
                          client.pricingModel === 'perOperation' ? (metrics.targetPricePerOperation || 0) :
                          client.pricingModel === 'perTransaction' ? (metrics.targetPricePerTransaction || 0) :
                          (metrics.targetPricePerSuccessful || 0), 4
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mini flow */}
                  <div className="bg-white rounded p-2 border border-gray-200 mb-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">Ops</div>
                        <div className="font-bold">{fmtM(num(client.monthlyOperations))}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-3 h-3 text-gray-300" />
                        <button 
                          onClick={() => updateClient(client.id, 'showAnalytics', !client.showAnalytics)}
                          className="text-red-400 hover:text-red-600 text-xs mt-0.5"
                          title="Decline analytics"
                        >
                          {fmt(100 - (metrics.filterRate || 0), 0)}%↓
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Txn</div>
                        <div className="font-bold">{fmtM(num(client.monthlyTransactions))}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-3 h-3 text-gray-300" />
                        <button 
                          onClick={() => updateClient(client.id, 'showProviderAnalytics', !client.showProviderAnalytics)}
                          className="text-amber-400 hover:text-amber-600 text-xs mt-0.5"
                          title="Provider decline analytics"
                        >
                          {fmt(100 - num(client.approvalRate), 0)}%↓
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Success</div>
                        <div className="font-bold text-emerald-600">{fmtM(metrics.monthlySuccessful || 0)}</div>
                      </div>
                      <div className="text-center bg-emerald-50 rounded px-2 py-1">
                        <div className="text-gray-500">Approval</div>
                        <div className="font-bold text-emerald-600">{fmt(num(client.approvalRate), 0)}%</div>
                      </div>
                    </div>
                    {client.showAnalytics && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-500 font-medium">Internal:</span>
                          <input 
                            type="url" 
                            value={client.analyticsUrl || ''} 
                            onChange={(e) => updateClient(client.id, 'analyticsUrl', e.target.value)}
                            placeholder="Internal decline analytics URL..."
                            className="flex-1 px-2 py-1 text-xs border rounded bg-white border-red-200 placeholder-gray-400"
                          />
                          {client.analyticsUrl && (
                            <a href={client.analyticsUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {client.showProviderAnalytics && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-500 font-medium">Provider:</span>
                          <input 
                            type="url" 
                            value={client.providerAnalyticsUrl || ''} 
                            onChange={(e) => updateClient(client.id, 'providerAnalyticsUrl', e.target.value)}
                            placeholder="Provider decline analytics URL..."
                            className="flex-1 px-2 py-1 text-xs border rounded bg-white border-amber-200 placeholder-gray-400"
                          />
                          {client.providerAnalyticsUrl && (
                            <a href={client.providerAnalyticsUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-700">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 pt-2 border-t border-gray-200 text-xs">
                    <div><div className="text-gray-500">Margin</div><div className={`font-bold ${(metrics.margin || 0) >= num(targetMargin) ? 'text-emerald-600' : 'text-amber-600'}`}>{fmt(metrics.margin || 0, 1)}%</div></div>
                    <div><div className="text-gray-500">Revenue</div><div className="font-medium text-emerald-600">€{fmtNum(metrics.revenue || 0)}</div></div>
                    <div><div className="text-gray-500">Cost</div><div className="font-medium text-red-600">€{fmtNum(metrics.cost || 0)}</div></div>
                    <div><div className="text-gray-500">Profit</div><div className={`font-bold ${(metrics.profit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>€{fmtNum(metrics.profit || 0)}</div></div>
                    <div><div className="text-gray-500">Cost/op</div><div className="font-medium">€{fmt(metrics.marginalCostPerOperation || 0, 4)}</div></div>
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            <div className="mt-4 bg-emerald-600 rounded-lg p-3 text-white">
              <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">Combined: {clients.length} Client{clients.length > 1 ? 's' : ''}</div>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Operations</div>
                  <div className="text-sm font-bold">{fmtM(totalNewVolume)}/mo</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Revenue</div>
                  <div className="text-sm font-bold">€{fmtNum(totalRevenue)}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs opacity-75">Cost</div>
                  <div className="text-sm font-bold">€{fmtNum(totalCost)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <div className="text-xs opacity-75">Profit</div>
                  <div className="text-lg font-bold">€{fmtNum(totalProfit)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <div className="text-xs opacity-75">Margin</div>
                  <div className={`text-lg font-bold ${totalMargin >= num(targetMargin) ? '' : 'text-amber-300'}`}>{fmt(totalMargin, 1)}%</div>
                </div>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
