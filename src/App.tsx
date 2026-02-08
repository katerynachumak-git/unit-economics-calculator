import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Calculator, CreditCard, Smartphone, Users, Clock, Code, Save, History, Download, Lock, Eye, EyeOff, Sun, Moon, Upload, FileText, Cloud, CloudOff, TrendingUp, ArrowRight, Copy, FolderOpen, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://eyymiqrxofswwammwffx.supabase.co',
  'sb_publishable_bQTk9wute0V1Kn7PQnID2Q_8srHSTsb'
);

// Login Component with Supabase Auth
function LoginPage({ onSuccess, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        onSuccess(data.session);
      }
    } catch (e) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`rounded-xl shadow-lg p-8 w-full max-w-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
            <Lock className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unit Economics Calculator</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to continue</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-200'
              }`}
              autoFocus
              disabled={loading}
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              className={`w-full px-4 py-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-200'
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
        
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNav({ tabs, activeTab, setActiveTab, darkMode }) {
  return (
    <div className={`flex border-b rounded-t-xl overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
            ${activeTab === tab.id 
              ? darkMode 
                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-700/50' 
                : 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
}

// Transaction Cost Calculator with Baseline/Projected/Clients
function TransactionCostCalculator({ darkMode, supabase, userEmail }) {
  const [eurToUsd, setEurToUsd] = useState(1.08);
  const [scenarioName, setScenarioName] = useState('');
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [currentScenarioId, setCurrentScenarioId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  
  // BASELINE (2025)
  const [baselineYear, setBaselineYear] = useState('2025');
  const [baselineAnnualTxn, setBaselineAnnualTxn] = useState(48000000);
  const [baselineConversionRate, setBaselineConversionRate] = useState(75);
  const [baselineCosts, setBaselineCosts] = useState([
    { id: 1, name: 'AWS (base servers)', amount: 8000, currency: 'USD', type: 'fixed' },
    { id: 2, name: 'AWS (auto-scaling)', amount: 4625, currency: 'USD', type: 'tiered', tiers: [
      { upTo: 6000000, amount: 4625 },
      { upTo: 10000000, amount: 7500 },
      { upTo: 15000000, amount: 11000 },
      { upTo: Infinity, amount: 15000 },
    ]},
    { id: 3, name: 'Hetzner', amount: 485, currency: 'EUR', type: 'fixed' },
    { id: 4, name: 'Grafana', amount: 171, currency: 'USD', type: 'variable' },
    { id: 5, name: 'Mailgun', amount: 32, currency: 'EUR', type: 'variable' },
    { id: 6, name: 'Dev Team (3 devs)', amount: 25000, currency: 'EUR', type: 'fixed' },
  ]);
  
  // PROJECTED (2026)
  const [projectedYear, setProjectedYear] = useState('2026');
  const [projectedConversionRate, setProjectedConversionRate] = useState(78);
  const [projectedCosts, setProjectedCosts] = useState([
    { id: 1, name: 'AWS (base servers)', amount: 10000, currency: 'USD', type: 'fixed' },
    { id: 2, name: 'AWS (auto-scaling)', amount: 4625, currency: 'USD', type: 'tiered', tiers: [
      { upTo: 6000000, amount: 4625 },
      { upTo: 10000000, amount: 7500 },
      { upTo: 15000000, amount: 11000 },
      { upTo: Infinity, amount: 15000 },
    ]},
    { id: 3, name: 'Hetzner', amount: 485, currency: 'EUR', type: 'fixed' },
    { id: 4, name: 'Grafana', amount: 200, currency: 'USD', type: 'variable' },
    { id: 5, name: 'Mailgun', amount: 32, currency: 'EUR', type: 'variable' },
    { id: 6, name: 'Dev Team (5 devs)', amount: 42000, currency: 'EUR', type: 'fixed' },
  ]);
  
  const [newBaselineCost, setNewBaselineCost] = useState({ name: '', amount: '', currency: 'EUR', type: 'fixed' });
  const [newProjectedCost, setNewProjectedCost] = useState({ name: '', amount: '', currency: 'EUR', type: 'fixed' });
  
  // MULTIPLE CLIENTS
  const [clients, setClients] = useState([
    { id: 1, name: 'Client A', monthlyTxn: 4000000, conversionRate: 75, price: 0.01, pricingModel: 'perAttempt' },
  ]);
  
  // TARGET MARGIN CALCULATOR
  const [targetMargin, setTargetMargin] = useState(30);

  // Helper functions
  const toEur = (amount, currency) => currency === 'USD' ? amount / eurToUsd : amount;
  const fmt = (val, dec = 2) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);
  const fmtNum = (val) => new Intl.NumberFormat('en-US').format(Math.round(val));
  const fmtM = (val) => {
    if (val >= 1000000) return fmt(val / 1000000, 1) + 'M';
    if (val >= 1000) return fmt(val / 1000, 0) + 'K';
    return fmtNum(val);
  };

  // Load saved scenarios on mount
  useEffect(() => {
    if (supabase) loadScenarios();
  }, [supabase]);

  const loadScenarios = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('cost_scenarios').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSavedScenarios(data || []);
    } catch (err) {
      console.error('Error loading scenarios:', err);
    }
  };

  const loadHistory = async (scenarioId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('cost_scenario_history').select('*').eq('scenario_id', scenarioId).order('version_number', { ascending: false });
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const generateChangeSummary = (oldData, newData) => {
    const changes = [];
    if (!oldData) return 'Initial version';
    if (oldData.baselineAnnualTxn !== newData.baselineAnnualTxn) changes.push(`Baseline volume: ${fmtM(oldData.baselineAnnualTxn)} → ${fmtM(newData.baselineAnnualTxn)}`);
    if (oldData.baselineConversionRate !== newData.baselineConversionRate) changes.push(`Baseline conversion: ${oldData.baselineConversionRate}% → ${newData.baselineConversionRate}%`);
    if (oldData.projectedConversionRate !== newData.projectedConversionRate) changes.push(`Projected conversion: ${oldData.projectedConversionRate}% → ${newData.projectedConversionRate}%`);
    const oldClientCount = oldData.clients?.length || 0;
    const newClientCount = newData.clients?.length || 0;
    if (oldClientCount !== newClientCount) changes.push(`Clients: ${oldClientCount} → ${newClientCount}`);
    if (oldData.targetMargin !== newData.targetMargin) changes.push(`Target margin: ${oldData.targetMargin}% → ${newData.targetMargin}%`);
    return changes.length > 0 ? changes.join('; ') : 'Minor updates';
  };

  const saveScenario = async () => {
    if (!supabase || !scenarioName.trim()) {
      setSaveStatus('Please enter a scenario name');
      return;
    }
    try {
      setSaveStatus('Saving...');
      const scenarioData = {
        eurToUsd, baselineYear, baselineAnnualTxn, baselineConversionRate,
        baselineCosts: baselineCosts.map(c => ({ ...c, tiers: c.tiers?.map(t => ({ ...t, upTo: t.upTo === Infinity ? 'Infinity' : t.upTo })) })),
        projectedYear, projectedConversionRate,
        projectedCosts: projectedCosts.map(c => ({ ...c, tiers: c.tiers?.map(t => ({ ...t, upTo: t.upTo === Infinity ? 'Infinity' : t.upTo })) })),
        clients, targetMargin,
      };

      const existingScenario = savedScenarios.find(s => s.name === scenarioName);
      
      if (existingScenario) {
        await supabase.from('cost_scenarios').update({ data: scenarioData, updated_at: new Date().toISOString(), updated_by: userEmail || 'Unknown' }).eq('id', existingScenario.id);
        const { data: latestVersion } = await supabase.from('cost_scenario_history').select('version_number').eq('scenario_id', existingScenario.id).order('version_number', { ascending: false }).limit(1);
        const newVersionNumber = (latestVersion?.[0]?.version_number || 0) + 1;
        const changeSummary = generateChangeSummary(existingScenario.data, scenarioData);
        await supabase.from('cost_scenario_history').insert([{ scenario_id: existingScenario.id, version_number: newVersionNumber, data: scenarioData, changed_by: userEmail || 'Unknown', changed_by_email: userEmail, change_summary: changeSummary }]);
        setCurrentScenarioId(existingScenario.id);
        setSaveStatus(`Saved v${newVersionNumber}!`);
      } else {
        const { data: newScenario } = await supabase.from('cost_scenarios').insert([{ name: scenarioName, data: scenarioData, created_by: userEmail || 'Unknown', updated_by: userEmail || 'Unknown' }]).select().single();
        await supabase.from('cost_scenario_history').insert([{ scenario_id: newScenario.id, version_number: 1, data: scenarioData, changed_by: userEmail || 'Unknown', changed_by_email: userEmail, change_summary: 'Initial version' }]);
        setCurrentScenarioId(newScenario.id);
        setSaveStatus('Created!');
      }
      loadScenarios();
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Error saving:', err);
      setSaveStatus('Error saving');
    }
  };

  const loadScenario = (scenario) => {
    const d = scenario.data;
    setEurToUsd(d.eurToUsd); setBaselineYear(d.baselineYear); setBaselineAnnualTxn(d.baselineAnnualTxn); setBaselineConversionRate(d.baselineConversionRate);
    setBaselineCosts(d.baselineCosts.map(c => ({ ...c, tiers: c.tiers?.map(t => ({ ...t, upTo: t.upTo === 'Infinity' ? Infinity : t.upTo })) })));
    setProjectedYear(d.projectedYear); setProjectedConversionRate(d.projectedConversionRate);
    setProjectedCosts(d.projectedCosts.map(c => ({ ...c, tiers: c.tiers?.map(t => ({ ...t, upTo: t.upTo === 'Infinity' ? Infinity : t.upTo })) })));
    setClients(d.clients); setTargetMargin(d.targetMargin); setScenarioName(scenario.name); setCurrentScenarioId(scenario.id);
    loadHistory(scenario.id);
  };

  const loadHistoryVersion = (historyItem) => {
    const d = historyItem.data;
    setEurToUsd(d.eurToUsd); setBaselineYear(d.baselineYear); setBaselineAnnualTxn(d.baselineAnnualTxn); setBaselineConversionRate(d.baselineConversionRate);
    setBaselineCosts(d.baselineCosts.map(c => ({ ...c, tiers: c.tiers?.map(t => ({ ...t, upTo: t.upTo === 'Infinity' ? Infinity : t.upTo })) })));
    setProjectedYear(d.projectedYear); setProjectedConversionRate(d.projectedConversionRate);
    setProjectedCosts(d.projectedCosts.map(c => ({ ...c, tiers: c.tiers?.map(t => ({ ...t, upTo: t.upTo === 'Infinity' ? Infinity : t.upTo })) })));
    setClients(d.clients); setTargetMargin(d.targetMargin);
  };

  const deleteScenario = async (id) => {
    if (!supabase) return;
    try {
      await supabase.from('cost_scenarios').delete().eq('id', id);
      loadScenarios();
      if (currentScenarioId === id) { setCurrentScenarioId(null); setScenarioName(''); setHistory([]); }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  // Cost calculation functions
  const getTieredAmount = (cost, monthlyVolume) => {
    if (cost.type !== 'tiered' || !cost.tiers) return cost.amount;
    const tier = cost.tiers.find(t => monthlyVolume <= t.upTo);
    return tier ? tier.amount : cost.tiers[cost.tiers.length - 1].amount;
  };
  
  const getCurrentTierIndex = (cost, monthlyVolume) => {
    if (cost.type !== 'tiered' || !cost.tiers) return -1;
    return cost.tiers.findIndex(t => monthlyVolume <= t.upTo);
  };
  
  const calculateCosts = (costs, monthlyVolume) => {
    let fixed = 0, variable = 0, tiered = 0;
    costs.forEach(c => {
      const amount = c.type === 'tiered' ? getTieredAmount(c, monthlyVolume) : c.amount;
      const amountEur = toEur(amount, c.currency);
      if (c.type === 'fixed') fixed += amountEur;
      else if (c.type === 'variable') variable += amountEur;
      else if (c.type === 'tiered') tiered += amountEur;
    });
    return { fixed, variable, tiered, total: fixed + variable + tiered };
  };

  // BASELINE calculations
  const baselineMonthlyTxn = baselineAnnualTxn / 12;
  const baselineMonthly = calculateCosts(baselineCosts, baselineMonthlyTxn);
  const baselineSuccessfulTxn = Math.round(baselineMonthlyTxn * baselineConversionRate / 100);
  const baselineCostPerTxn = baselineMonthlyTxn > 0 ? baselineMonthly.total / baselineMonthlyTxn : 0;
  const baselineCostPerSuccess = baselineSuccessfulTxn > 0 ? baselineMonthly.total / baselineSuccessfulTxn : 0;
  const baselineVariableCostPerTxn = baselineMonthlyTxn > 0 ? (baselineMonthly.variable + baselineMonthly.tiered) / baselineMonthlyTxn : 0;
  const baselineVariableCostPerSuccess = baselineSuccessfulTxn > 0 ? (baselineMonthly.variable + baselineMonthly.tiered) / baselineSuccessfulTxn : 0;
  
  // PROJECTED calculations
  const projectedMonthly = calculateCosts(projectedCosts, baselineMonthlyTxn);
  const projectedSuccessfulTxn = Math.round(baselineMonthlyTxn * projectedConversionRate / 100);
  const projectedCostPerTxn = baselineMonthlyTxn > 0 ? projectedMonthly.total / baselineMonthlyTxn : 0;
  const projectedCostPerSuccess = projectedSuccessfulTxn > 0 ? projectedMonthly.total / projectedSuccessfulTxn : 0;
  const projectedVariableCostPerTxn = baselineMonthlyTxn > 0 ? (projectedMonthly.variable + projectedMonthly.tiered) / baselineMonthlyTxn : 0;
  const projectedVariableCostPerSuccess = projectedSuccessfulTxn > 0 ? (projectedMonthly.variable + projectedMonthly.tiered) / projectedSuccessfulTxn : 0;
  
  // MULTIPLE CLIENTS - Calculate cumulative impact
  const calculateClientMetrics = () => {
    let cumulativeVolume = baselineMonthlyTxn;
    return clients.map((client) => {
      const newCumulativeVolume = cumulativeVolume + client.monthlyTxn;
      const newCosts = calculateCosts(projectedCosts, newCumulativeVolume);
      const scaleFactor = newCumulativeVolume / baselineMonthlyTxn;
      const scaledVariableCosts = projectedMonthly.variable * scaleFactor;
      const newTieredCosts = newCosts.tiered;
      const totalCostsAtNewVolume = projectedMonthly.fixed + scaledVariableCosts + newTieredCosts;
      
      const prevScaleFactor = cumulativeVolume / baselineMonthlyTxn;
      const prevScaledVariable = projectedMonthly.variable * prevScaleFactor;
      const prevTiered = calculateCosts(projectedCosts, cumulativeVolume).tiered;
      const prevTotal = projectedMonthly.fixed + prevScaledVariable + prevTiered;
      
      const incrementalVariable = scaledVariableCosts - prevScaledVariable;
      const incrementalTiered = newTieredCosts - prevTiered;
      const incrementalTotal = totalCostsAtNewVolume - prevTotal;
      const marginalCostPerTxn = client.monthlyTxn > 0 ? incrementalTotal / client.monthlyTxn : 0;
      
      const successfulTxn = Math.round(client.monthlyTxn * client.conversionRate / 100);
      const revenue = client.pricingModel === 'perAttempt' ? client.price * client.monthlyTxn : client.price * successfulTxn;
      const cost = marginalCostPerTxn * client.monthlyTxn;
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      
      const targetPricePerAttempt = marginalCostPerTxn / (1 - targetMargin / 100);
      const targetPricePerSuccess = successfulTxn > 0 ? (marginalCostPerTxn * client.monthlyTxn) / (successfulTxn * (1 - targetMargin / 100)) : 0;
      
      const metrics = { ...client, cumulativeVolume: newCumulativeVolume, successfulTxn, marginalCostPerTxn, incrementalVariable, incrementalTiered, incrementalTotal, revenue, cost, profit, margin, targetPricePerAttempt, targetPricePerSuccess, tierJump: incrementalTiered > 0 };
      cumulativeVolume = newCumulativeVolume;
      return metrics;
    });
  };
  
  const clientMetrics = calculateClientMetrics();
  const totalNewVolume = clients.reduce((sum, c) => sum + c.monthlyTxn, 0);
  const totalCumulativeVolume = baselineMonthlyTxn + totalNewVolume;
  const totalRevenue = clientMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalCost = clientMetrics.reduce((sum, m) => sum + m.cost, 0);
  const totalProfit = clientMetrics.reduce((sum, m) => sum + m.profit, 0);
  const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Client management
  const addClient = () => {
    setClients([...clients, { id: Date.now(), name: `Client ${String.fromCharCode(65 + clients.length)}`, monthlyTxn: 2000000, conversionRate: 75, price: 0.01, pricingModel: 'perAttempt' }]);
  };
  const updateClient = (id, field, value) => setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  const removeClient = (id) => { if (clients.length > 1) setClients(clients.filter(c => c.id !== id)); };
  const copyBaselineToProjected = () => setProjectedCosts(baselineCosts.map(c => ({ ...c, id: c.id + 1000 })));

  // Cost table component
  const CostTable = ({ costs, setCosts, newCost, setNewCost, color, monthlyVolume }) => {
    const [expandedTierId, setExpandedTierId] = useState(null);
    const updateCost = (id, field, value) => setCosts(costs.map(c => c.id === id ? { ...c, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : c));
    const updateTier = (costId, tierIndex, field, value) => {
      setCosts(costs.map(c => {
        if (c.id === costId && c.tiers) {
          const newTiers = [...c.tiers];
          newTiers[tierIndex] = { ...newTiers[tierIndex], [field]: field === 'upTo' && value === '' ? Infinity : parseFloat(value) || 0 };
          return { ...c, tiers: newTiers };
        }
        return c;
      }));
    };
    const addTier = (costId) => {
      setCosts(costs.map(c => {
        if (c.id === costId && c.tiers) {
          const newTiers = [...c.tiers];
          newTiers.splice(c.tiers.length - 1, 0, { upTo: 20000000, amount: c.tiers[c.tiers.length - 1].amount + 2000 });
          return { ...c, tiers: newTiers };
        }
        return c;
      }));
    };
    const removeTier = (costId, tierIndex) => setCosts(costs.map(c => (c.id === costId && c.tiers && c.tiers.length > 2) ? { ...c, tiers: c.tiers.filter((_, i) => i !== tierIndex) } : c));
    const deleteCost = (id) => setCosts(costs.filter(c => c.id !== id));
    const addCost = () => {
      if (newCost.name && newCost.amount) {
        const newCostItem = { ...newCost, id: Date.now(), amount: parseFloat(newCost.amount) };
        if (newCost.type === 'tiered') newCostItem.tiers = [{ upTo: 6000000, amount: parseFloat(newCost.amount) }, { upTo: Infinity, amount: parseFloat(newCost.amount) * 1.5 }];
        setCosts([...costs, newCostItem]);
        setNewCost({ name: '', amount: '', currency: 'EUR', type: 'fixed' });
      }
    };

    const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';

    return (
      <div className="space-y-2">
        <div className={`grid grid-cols-12 gap-2 text-xs font-medium px-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="col-span-4">Service</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Currency</div>
          <div className="col-span-3">Type</div>
          <div className="col-span-1"></div>
        </div>
        {costs.map((cost) => {
          const currentTierIndex = getCurrentTierIndex(cost, monthlyVolume);
          const isExpanded = expandedTierId === cost.id;
          return (
            <div key={cost.id}>
              <div className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${cost.type === 'fixed' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') : cost.type === 'variable' ? (darkMode ? 'bg-amber-900/30' : 'bg-amber-50') : (darkMode ? 'bg-purple-900/30' : 'bg-purple-50')}`}>
                <div className="col-span-4">
                  <input type="text" value={cost.name} onChange={(e) => updateCost(cost.id, 'name', e.target.value)} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`} />
                </div>
                <div className="col-span-2">
                  {cost.type === 'tiered' ? (
                    <div className={`text-sm font-medium text-center ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>€{fmtNum(getTieredAmount(cost, monthlyVolume))}</div>
                  ) : (
                    <input type="number" value={cost.amount} onChange={(e) => updateCost(cost.id, 'amount', e.target.value)} className={`w-full px-2 py-1 border rounded text-right text-sm ${inputBg}`} />
                  )}
                </div>
                <div className="col-span-2">
                  <select value={cost.currency} onChange={(e) => updateCost(cost.id, 'currency', e.target.value)} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <select value={cost.type} onChange={(e) => {
                    const newType = e.target.value;
                    if (newType === 'tiered' && !cost.tiers) {
                      setCosts(costs.map(c => c.id === cost.id ? { ...c, type: newType, tiers: [{ upTo: 6000000, amount: cost.amount }, { upTo: Infinity, amount: cost.amount * 1.5 }] } : c));
                    } else {
                      updateCost(cost.id, 'type', newType);
                    }
                  }} className={`w-full px-2 py-1 border rounded text-sm font-medium ${cost.type === 'fixed' ? 'bg-blue-100 border-blue-300 text-blue-700' : cost.type === 'variable' ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-purple-100 border-purple-300 text-purple-700'}`}>
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                    <option value="tiered">Tiered</option>
                  </select>
                </div>
                <div className="col-span-1 flex justify-end gap-1">
                  {cost.type === 'tiered' && (
                    <button onClick={() => setExpandedTierId(isExpanded ? null : cost.id)} className={`p-1 ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-500 hover:text-purple-700'}`}>
                      <TrendingUp className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteCost(cost.id)} className={`p-1 ${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {cost.type === 'tiered' && isExpanded && cost.tiers && (
                <div className={`ml-4 mt-2 p-3 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Volume Tiers (current: {fmtM(monthlyVolume)}/mo)</div>
                  <div className="space-y-2">
                    {cost.tiers.map((tier, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-sm ${currentTierIndex === idx ? 'font-bold' : ''}`}>
                        <span className={darkMode ? 'text-purple-400' : 'text-purple-600'}>Up to</span>
                        <input type="number" value={tier.upTo === Infinity ? '' : tier.upTo} placeholder="∞" onChange={(e) => updateTier(cost.id, idx, 'upTo', e.target.value)} className={`w-24 px-2 py-1 border rounded text-right text-sm ${inputBg}`} />
                        <span className={darkMode ? 'text-purple-400' : 'text-purple-600'}>→ {cost.currency}</span>
                        <input type="number" value={tier.amount} onChange={(e) => updateTier(cost.id, idx, 'amount', e.target.value)} className={`w-24 px-2 py-1 border rounded text-right text-sm ${inputBg}`} />
                        {currentTierIndex === idx && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">active</span>}
                        {cost.tiers.length > 2 && <button onClick={() => removeTier(cost.id, idx)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>}
                      </div>
                    ))}
                    <button onClick={() => addTier(cost.id)} className={`text-xs flex items-center gap-1 ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}>
                      <Plus className="w-3 h-3" /> Add tier
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className={`grid grid-cols-12 gap-2 items-center border-t border-dashed pt-3 mt-4 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <div className="col-span-4"><input type="text" placeholder="New cost..." value={newCost.name} onChange={(e) => setNewCost({...newCost, name: e.target.value})} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`} /></div>
          <div className="col-span-2"><input type="number" placeholder="0" value={newCost.amount} onChange={(e) => setNewCost({...newCost, amount: e.target.value})} className={`w-full px-2 py-1 border rounded text-right text-sm ${inputBg}`} /></div>
          <div className="col-span-2"><select value={newCost.currency} onChange={(e) => setNewCost({...newCost, currency: e.target.value})} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`}><option value="EUR">EUR</option><option value="USD">USD</option></select></div>
          <div className="col-span-3"><select value={newCost.type} onChange={(e) => setNewCost({...newCost, type: e.target.value})} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`}><option value="fixed">Fixed</option><option value="variable">Variable</option><option value="tiered">Tiered</option></select></div>
          <div className="col-span-1"><button onClick={addCost} className={`p-1 text-white rounded hover:opacity-80 ${color}`}><Plus className="w-4 h-4" /></button></div>
        </div>
      </div>
    );
  };

  // Styling
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const cardText = darkMode ? 'text-white' : 'text-gray-800';
  const labelText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6">
      {/* SAVE/LOAD SCENARIOS */}
      <div className={`rounded-xl p-4 shadow-sm border ${cardBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Save className={`w-5 h-5 ${labelText}`} />
            <input type="text" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} placeholder="Scenario name..." className={`px-3 py-2 border rounded-lg w-48 ${inputBg}`} />
            <button onClick={saveScenario} disabled={!supabase} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            {saveStatus && <span className={`text-sm ${labelText}`}>{saveStatus}</span>}
            {currentScenarioId && (
              <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${showHistory ? 'bg-amber-100 text-amber-700' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <History className="w-4 h-4" /> History {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${labelText}`}>EUR/USD:</span>
            <input type="number" step="0.01" value={eurToUsd} onChange={(e) => setEurToUsd(parseFloat(e.target.value) || 1)} className={`w-16 px-2 py-1 border rounded text-center ${inputBg}`} />
          </div>
        </div>
        
        {savedScenarios.length > 0 && (
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 flex-wrap">
              <FolderOpen className={`w-4 h-4 ${labelText}`} />
              <span className={`text-sm ${labelText}`}>Load:</span>
              {savedScenarios.map(s => (
                <div key={s.id} className="flex items-center gap-1">
                  <button onClick={() => loadScenario(s)} className={`px-2 py-1 text-sm rounded ${currentScenarioId === s.id ? 'bg-indigo-100 text-indigo-700 font-medium' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}>{s.name}</button>
                  <button onClick={() => deleteScenario(s.id)} className={`p-1 ${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showHistory && currentScenarioId && (
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-amber-600" />
              <span className={`text-sm font-medium ${cardText}`}>Version History</span>
            </div>
            {history.length === 0 ? (
              <div className={`text-sm italic ${labelText}`}>No history available</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((h, idx) => (
                  <div key={h.id} className={`p-3 rounded-lg border ${idx === 0 ? 'bg-amber-50 border-amber-200' : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${idx === 0 ? 'text-amber-700' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>v{h.version_number}</span>
                        {idx === 0 && <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">current</span>}
                      </div>
                      <button onClick={() => loadHistoryVersion(h)} className="text-xs text-indigo-600 hover:text-indigo-800">Restore</button>
                    </div>
                    <div className={`mt-1 flex items-center gap-2 text-xs ${labelText}`}>
                      <Clock className="w-3 h-3" />
                      {new Date(h.created_at).toLocaleString()}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className={labelText}>by</span>
                      <span className={`font-medium ${cardText}`}>{h.changed_by_email || h.changed_by}</span>
                    </div>
                    <div className={`mt-2 text-xs p-2 rounded border ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-100 text-gray-600'}`}>{h.change_summary}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!supabase && <div className="mt-2 text-sm text-amber-600">⚠️ Supabase not connected. Saving disabled.</div>}
      </div>

      {/* SECTION 1: BASELINE */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
              <span className={`font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>1</span>
            </div>
            <div>
              <h2 className={`text-lg font-bold ${cardText}`}>Baseline</h2>
              <p className={`text-sm ${labelText}`}>Your actual costs & volume</p>
            </div>
          </div>
          <input type="text" value={baselineYear} onChange={(e) => setBaselineYear(e.target.value)} className={`px-3 py-1 border rounded-lg text-center font-bold w-20 ${darkMode ? 'border-indigo-700 bg-indigo-900/30 text-indigo-400' : 'border-indigo-200 text-indigo-600'}`} />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className={`block text-sm mb-1 ${labelText}`}>Annual Transactions (attempts)</label>
            <input type="number" value={baselineAnnualTxn} onChange={(e) => setBaselineAnnualTxn(parseInt(e.target.value) || 0)} className={`w-full px-3 py-2 border rounded-lg ${inputBg}`} />
          </div>
          <div>
            <label className={`block text-sm mb-1 ${labelText}`}>Conversion Rate %</label>
            <input type="number" step="0.1" value={baselineConversionRate} onChange={(e) => setBaselineConversionRate(parseFloat(e.target.value) || 0)} className={`w-full px-3 py-2 border rounded-lg ${inputBg}`} />
          </div>
          <div className={`rounded-lg p-2 flex flex-col justify-center ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
            <div className={`text-xs ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Monthly: {fmtM(baselineMonthlyTxn)} attempts</div>
            <div className={`font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{fmtM(baselineSuccessfulTxn)} successful</div>
          </div>
        </div>

        <CostTable costs={baselineCosts} setCosts={setBaselineCosts} newCost={newBaselineCost} setNewCost={setNewBaselineCost} color="bg-indigo-600" monthlyVolume={baselineMonthlyTxn} />

        <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><div className={`text-xs ${labelText}`}>Fixed</div><div className="font-bold text-blue-600">€{fmtNum(baselineMonthly.fixed)}/mo</div></div>
            <div><div className={`text-xs ${labelText}`}>Variable</div><div className="font-bold text-amber-600">€{fmtNum(baselineMonthly.variable)}/mo</div></div>
            <div><div className={`text-xs ${labelText}`}>Tiered</div><div className="font-bold text-purple-600">€{fmtNum(baselineMonthly.tiered)}/mo</div></div>
            <div><div className={`text-xs ${labelText}`}>Total</div><div className={`font-bold ${cardText}`}>€{fmtNum(baselineMonthly.total)}/mo</div></div>
          </div>
          
          <div className="bg-indigo-600 rounded-lg p-4 text-white">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-3">Cost Per Transaction</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs opacity-75 mb-2 text-center">Per Attempt</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-lg font-bold">€{fmt(baselineCostPerTxn, 4)}</div><div className="text-xs opacity-75">average</div></div>
                  <div><div className="text-lg font-bold">€{fmt(baselineMonthly.fixed / baselineMonthlyTxn, 4)}</div><div className="text-xs opacity-75">fixed</div></div>
                  <div><div className="text-lg font-bold">€{fmt(baselineVariableCostPerTxn, 4)}</div><div className="text-xs opacity-75">variable</div></div>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-xs opacity-75 mb-2 text-center">Per Successful ({fmt(baselineConversionRate, 0)}%)</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-lg font-bold">€{fmt(baselineCostPerSuccess, 4)}</div><div className="text-xs opacity-75">average</div></div>
                  <div><div className="text-lg font-bold">€{fmt(baselineMonthly.fixed / baselineSuccessfulTxn, 4)}</div><div className="text-xs opacity-75">fixed</div></div>
                  <div><div className="text-lg font-bold">€{fmt(baselineVariableCostPerSuccess, 4)}</div><div className="text-xs opacity-75">variable</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center"><ArrowRight className={`w-6 h-6 rotate-90 ${labelText}`} /></div>

      {/* SECTION 2: PROJECTED */}
      <div className={`rounded-xl p-6 shadow-sm border ${darkMode ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
              <span className={`font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>2</span>
            </div>
            <div>
              <h2 className={`text-lg font-bold ${cardText}`}>Projected</h2>
              <p className={`text-sm ${labelText}`}>Planned cost changes (same volume)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyBaselineToProjected} className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg ${darkMode ? 'text-purple-400 hover:bg-purple-900/30' : 'text-purple-600 hover:bg-purple-50'}`}>
              <Copy className="w-4 h-4" /> Copy from baseline
            </button>
            <input type="text" value={projectedYear} onChange={(e) => setProjectedYear(e.target.value)} className={`px-3 py-1 border rounded-lg text-center font-bold w-20 ${darkMode ? 'border-purple-700 bg-purple-900/30 text-purple-400' : 'border-purple-200 text-purple-600'}`} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className={`rounded-lg p-2 flex flex-col justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className={`text-xs ${labelText}`}>Attempts / month (same)</div>
            <div className={`font-bold ${cardText}`}>{fmtM(baselineMonthlyTxn)}</div>
          </div>
          <div>
            <label className={`block text-sm mb-1 ${labelText}`}>Conversion Rate %</label>
            <input type="number" step="0.1" value={projectedConversionRate} onChange={(e) => setProjectedConversionRate(parseFloat(e.target.value) || 0)} className={`w-full px-3 py-2 border rounded-lg ${inputBg}`} />
          </div>
          <div className={`rounded-lg p-2 flex flex-col justify-center ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
            <div className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Successful / month</div>
            <div className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>{fmtM(projectedSuccessfulTxn)}</div>
          </div>
        </div>

        <CostTable costs={projectedCosts} setCosts={setProjectedCosts} newCost={newProjectedCost} setNewCost={setNewProjectedCost} color="bg-purple-600" monthlyVolume={baselineMonthlyTxn} />

        <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><div className={`text-xs ${labelText}`}>Fixed</div><div className="font-bold text-blue-600">€{fmtNum(projectedMonthly.fixed)}/mo</div></div>
            <div><div className={`text-xs ${labelText}`}>Variable</div><div className="font-bold text-amber-600">€{fmtNum(projectedMonthly.variable)}/mo</div></div>
            <div><div className={`text-xs ${labelText}`}>Tiered</div><div className="font-bold text-purple-600">€{fmtNum(projectedMonthly.tiered)}/mo</div></div>
            <div><div className={`text-xs ${labelText}`}>Total</div><div className={`font-bold ${cardText}`}>€{fmtNum(projectedMonthly.total)}/mo</div></div>
          </div>
          
          <div className="bg-purple-600 rounded-lg p-4 text-white">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-3">Cost Per Transaction</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs opacity-75 mb-2 text-center">Per Attempt</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-lg font-bold">€{fmt(projectedCostPerTxn, 4)}</div><div className="text-xs opacity-75">average</div></div>
                  <div><div className="text-lg font-bold">€{fmt(projectedMonthly.fixed / baselineMonthlyTxn, 4)}</div><div className="text-xs opacity-75">fixed</div></div>
                  <div><div className="text-lg font-bold">€{fmt(projectedVariableCostPerTxn, 4)}</div><div className="text-xs opacity-75">variable</div></div>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-xs opacity-75 mb-2 text-center">Per Successful ({fmt(projectedConversionRate, 0)}%)</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-lg font-bold">€{fmt(projectedCostPerSuccess, 4)}</div><div className="text-xs opacity-75">average</div></div>
                  <div><div className="text-lg font-bold">€{fmt(projectedMonthly.fixed / projectedSuccessfulTxn, 4)}</div><div className="text-xs opacity-75">fixed</div></div>
                  <div><div className="text-lg font-bold">€{fmt(projectedVariableCostPerSuccess, 4)}</div><div className="text-xs opacity-75">variable</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center"><ArrowRight className={`w-6 h-6 rotate-90 ${labelText}`} /></div>

      {/* SECTION 3: MULTIPLE CLIENTS */}
      <div className={`rounded-xl p-6 shadow-sm border ${darkMode ? 'bg-gray-800 border-emerald-700' : 'bg-white border-emerald-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
              <span className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>3</span>
            </div>
            <div>
              <h2 className={`text-lg font-bold ${cardText}`}>New Clients</h2>
              <p className={`text-sm ${labelText}`}>Model multiple clients with cumulative impact</p>
            </div>
          </div>
          <button onClick={addClient} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>

        {/* Target Margin Calculator */}
        <div className={`mb-4 p-4 rounded-lg border ${darkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'}`}>
          <div className="flex items-center gap-4">
            <Target className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>Target Margin Calculator</span>
            <input type="number" value={targetMargin} onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)} className={`w-20 px-2 py-1 border rounded text-center ${darkMode ? 'bg-gray-700 border-amber-600 text-white' : 'border-amber-300'}`} />
            <span className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>%</span>
            <span className={`text-xs ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>→ Shows required price for each client below</span>
          </div>
        </div>

        {/* Client Cards */}
        <div className="space-y-4">
          {clients.map((client, index) => {
            const metrics = clientMetrics[index];
            return (
              <div key={client.id} className={`p-4 rounded-lg border ${metrics.tierJump ? (darkMode ? 'border-purple-600 bg-purple-900/20' : 'border-purple-300 bg-purple-50') : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Users className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <input type="text" value={client.name} onChange={(e) => updateClient(client.id, 'name', e.target.value)} className={`px-2 py-1 border rounded font-medium w-32 ${inputBg}`} />
                    {metrics.tierJump && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">⬆ Tier Jump</span>}
                  </div>
                  {clients.length > 1 && <button onClick={() => removeClient(client.id)} className={`p-1 ${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}><Trash2 className="w-4 h-4" /></button>}
                </div>
                
                <div className="grid grid-cols-5 gap-3 mb-3">
                  <div>
                    <label className={`block text-xs mb-1 ${labelText}`}>Monthly Txn</label>
                    <input type="number" value={client.monthlyTxn} onChange={(e) => updateClient(client.id, 'monthlyTxn', parseInt(e.target.value) || 0)} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`} />
                    <div className={`text-xs ${labelText}`}>{fmtM(client.monthlyTxn)}/mo</div>
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${labelText}`}>Conversion %</label>
                    <input type="number" value={client.conversionRate} onChange={(e) => updateClient(client.id, 'conversionRate', parseFloat(e.target.value) || 0)} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`} />
                    <div className={`text-xs ${labelText}`}>{fmtM(metrics.successfulTxn)} success</div>
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${labelText}`}>Pricing</label>
                    <select value={client.pricingModel} onChange={(e) => updateClient(client.id, 'pricingModel', e.target.value)} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`}>
                      <option value="perAttempt">Per Attempt</option>
                      <option value="perSuccess">Per Success</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${labelText}`}>Your Price €</label>
                    <input type="number" step="0.0001" value={client.price} onChange={(e) => updateClient(client.id, 'price', parseFloat(e.target.value) || 0)} className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`} />
                  </div>
                  <div className={`rounded p-2 ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                    <label className={`block text-xs mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>For {targetMargin}% margin</label>
                    <div className={`text-sm font-bold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>€{fmt(client.pricingModel === 'perAttempt' ? metrics.targetPricePerAttempt : metrics.targetPricePerSuccess, 4)}</div>
                    <div className={`text-xs ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>per {client.pricingModel === 'perAttempt' ? 'attempt' : 'success'}</div>
                  </div>
                </div>
                
                <div className={`grid grid-cols-5 gap-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div><div className={`text-xs ${labelText}`}>Marginal Cost</div><div className={`font-medium ${cardText}`}>€{fmt(metrics.marginalCostPerTxn, 4)}/txn</div></div>
                  <div><div className={`text-xs ${labelText}`}>Revenue</div><div className="font-medium text-emerald-600">€{fmtNum(metrics.revenue)}/mo</div></div>
                  <div><div className={`text-xs ${labelText}`}>Cost</div><div className="font-medium text-red-600">€{fmtNum(metrics.cost)}/mo</div></div>
                  <div><div className={`text-xs ${labelText}`}>Profit</div><div className={`font-bold ${metrics.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>€{fmtNum(metrics.profit)}/mo</div></div>
                  <div><div className={`text-xs ${labelText}`}>Margin</div><div className={`font-bold ${metrics.margin >= targetMargin ? 'text-emerald-600' : 'text-amber-600'}`}>{fmt(metrics.margin, 1)}%</div></div>
                </div>
                
                {metrics.tierJump && <div className={`mt-2 text-xs ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>⚠️ This client triggers tier jump: +€{fmtNum(metrics.incrementalTiered)}/mo in auto-scaling</div>}
              </div>
            );
          })}
        </div>

        {/* Cumulative Summary */}
        <div className="mt-6 bg-emerald-600 rounded-lg p-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-3">Combined Impact: All {clients.length} Client{clients.length > 1 ? 's' : ''}</div>
          
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xs opacity-75">Total New Volume</div>
              <div className="text-xl font-bold">{fmtM(totalNewVolume)}/mo</div>
              <div className="text-xs opacity-75">Cumulative: {fmtM(totalCumulativeVolume)}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xs opacity-75">Total Revenue</div>
              <div className="text-xl font-bold">€{fmtNum(totalRevenue)}</div>
              <div className="text-xs opacity-75">/month</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xs opacity-75">Total Cost</div>
              <div className="text-xl font-bold">€{fmtNum(totalCost)}</div>
              <div className="text-xs opacity-75">/month</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-75">Total Profit</div>
              <div className={`text-2xl font-bold ${totalProfit >= 0 ? '' : 'text-red-300'}`}>€{fmtNum(totalProfit)}</div>
              <div className="text-xs opacity-75">/month</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-75">Blended Margin</div>
              <div className={`text-2xl font-bold ${totalMargin >= targetMargin ? '' : 'text-amber-300'}`}>{fmt(totalMargin, 1)}%</div>
              <div className="text-xs opacity-75">target: {targetMargin}%</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg text-sm">
            <strong>📊 Summary:</strong> Adding {clients.length} client{clients.length > 1 ? 's' : ''} brings {fmtM(totalNewVolume)} new txn/month, generating €{fmtNum(totalProfit)}/month profit at {fmt(totalMargin, 1)}% blended margin.
            {clientMetrics.some(m => m.tierJump) && ` Includes tier jump costs.`}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Development Cost Calculator
function FeatureCostCalculator({ darkMode }) {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, role: 'Backend Developer', monthlySalary: 5000, allocation: 100 },
    { id: 2, role: 'Frontend Developer', monthlySalary: 4500, allocation: 50 },
    { id: 3, role: 'QA Engineer', monthlySalary: 3500, allocation: 30 },
    { id: 4, role: 'Product Manager', monthlySalary: 5500, allocation: 20 },
  ]);

  const [durationWeeks, setDurationWeeks] = useState(4);
  const [contingencyPct, setContingencyPct] = useState(20);
  const [newMember, setNewMember] = useState({ role: '', monthlySalary: '', allocation: 100 });

  const workingDaysPerMonth = 22;
  const workingDaysPerWeek = 5;

  const membersWithCalcs = teamMembers.map(member => {
    const dailyRate = member.monthlySalary / workingDaysPerMonth;
    const daysWorked = (durationWeeks * workingDaysPerWeek * member.allocation) / 100;
    const cost = dailyRate * daysWorked;
    return { ...member, dailyRate, daysWorked, cost };
  });

  const subtotal = membersWithCalcs.reduce((sum, m) => sum + m.cost, 0);
  const contingency = subtotal * (contingencyPct / 100);
  const total = subtotal + contingency;

  const updateMember = (id, field, value) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, [field]: field === 'role' ? value : parseFloat(value) || 0 } : m
    ));
  };

  const deleteMember = (id) => setTeamMembers(teamMembers.filter(m => m.id !== id));

  const addMember = () => {
    if (newMember.role && newMember.monthlySalary) {
      setTeamMembers([...teamMembers, { 
        ...newMember, 
        id: Date.now(), 
        monthlySalary: parseFloat(newMember.monthlySalary),
        allocation: parseFloat(newMember.allocation) || 100
      }]);
      setNewMember({ role: '', monthlySalary: '', allocation: 100 });
    }
  };

  const fmt = (val, dec = 0) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const cardText = darkMode ? 'text-white' : 'text-gray-800';
  const labelText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6">
      {/* Duration */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${labelText}`}>Feature Timeline</h2>
        <div className="flex items-center gap-4">
          <div>
            <label className={`block text-sm mb-1 ${labelText}`}>Duration (weeks)</label>
            <input
              type="number"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 0)}
              className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
            />
          </div>
          <div className={labelText}>=</div>
          <div className={`rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <span className={`text-lg font-semibold ${cardText}`}>{durationWeeks * workingDaysPerWeek}</span>
            <span className={`ml-1 ${labelText}`}>working days</span>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${labelText}`}>Team Allocation</h2>
        
        <div className="space-y-3">
          <div className={`grid grid-cols-12 gap-2 text-xs font-medium px-1 ${labelText}`}>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Monthly Salary €</div>
            <div className="col-span-2">Allocation %</div>
            <div className="col-span-2 text-right">Days</div>
            <div className="col-span-2 text-right">Cost €</div>
            <div className="col-span-1"></div>
          </div>

          {membersWithCalcs.map((member) => (
            <div key={member.id} className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="col-span-3">
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                  className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={member.monthlySalary}
                  onChange={(e) => updateMember(member.id, 'monthlySalary', e.target.value)}
                  className={`w-full px-2 py-1 border rounded text-right text-sm ${inputBg}`}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={member.allocation}
                  onChange={(e) => updateMember(member.id, 'allocation', e.target.value)}
                  className={`w-full px-2 py-1 border rounded text-center text-sm ${inputBg}`}
                />
              </div>
              <div className={`col-span-2 text-right text-sm ${labelText}`}>
                {fmt(member.daysWorked, 1)}
              </div>
              <div className={`col-span-2 text-right text-sm font-medium ${cardText}`}>
                €{fmt(member.cost)}
              </div>
              <div className="col-span-1 text-right">
                <button onClick={() => deleteMember(member.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add new */}
          <div className={`grid grid-cols-12 gap-2 items-center border-t border-dashed pt-3 mt-4 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <div className="col-span-3">
              <input
                type="text"
                placeholder="Role..."
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className={`w-full px-2 py-1 border rounded text-sm ${inputBg}`}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="Salary"
                value={newMember.monthlySalary}
                onChange={(e) => setNewMember({...newMember, monthlySalary: e.target.value})}
                className={`w-full px-2 py-1 border rounded text-right text-sm ${inputBg}`}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="100"
                value={newMember.allocation}
                onChange={(e) => setNewMember({...newMember, allocation: e.target.value})}
                className={`w-full px-2 py-1 border rounded text-center text-sm ${inputBg}`}
              />
            </div>
            <div className="col-span-4"></div>
            <div className="col-span-1">
              <button onClick={addMember} className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-4 pt-4 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <span className={`font-medium ${cardText}`}>Subtotal (team cost)</span>
          <span className={`text-xl font-bold ${cardText}`}>€{fmt(subtotal)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-emerald-600 rounded-xl p-6 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-75 mb-4">Feature Development Cost</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="opacity-75">Team cost</span>
            <span className="font-medium">€{fmt(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="opacity-75">Contingency</span>
              <input
                type="number"
                value={contingencyPct}
                onChange={(e) => setContingencyPct(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white/20 text-white text-center text-sm"
              />
              <span className="opacity-75">%</span>
            </div>
            <span className="font-medium">€{fmt(contingency)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-white/20">
            <span className="font-bold text-lg">Total</span>
            <span className="text-3xl font-bold">€{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${labelText}`}>Quick Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${cardText}`}>€{fmt(total / (durationWeeks * workingDaysPerWeek))}</div>
            <div className={`text-sm ${labelText}`}>Cost per day</div>
          </div>
          <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${cardText}`}>€{fmt(total / durationWeeks)}</div>
            <div className={`text-sm ${labelText}`}>Cost per week</div>
          </div>
          <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${cardText}`}>{fmt(membersWithCalcs.reduce((sum, m) => sum + m.daysWorked, 0), 0)}</div>
            <div className={`text-sm ${labelText}`}>Total person-days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Story Points Calculator with Teams
function StoryPointsCalculator({ darkMode }) {
  const [costPerSP, setCostPerSP] = useState(300);
  const [sprintName, setSprintName] = useState('Sprint 14');
  const fileInputRef = useRef(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importError, setImportError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSprintPreview, setShowSprintPreview] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'synced', 'error'
  const [sprintId, setSprintId] = useState(null);
  
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const cardText = darkMode ? 'text-white' : 'text-gray-800';
  const labelText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';
  
  const [teams, setTeams] = useState([
    { 
      id: 'red', 
      name: 'Red', 
      color: 'bg-red-500',
      colorLight: 'bg-red-50',
      colorText: 'text-red-500',
      features: [
        { id: 1, name: 'Payment retry logic', issueKey: '', storyPoints: 5, billable: false },
        { id: 2, name: 'Client ABC custom flow', issueKey: '', storyPoints: 3, billable: true },
      ]
    },
    { 
      id: 'green', 
      name: 'Green', 
      color: 'bg-green-500',
      colorLight: 'bg-green-50',
      colorText: 'text-green-500',
      features: [
        { id: 1, name: 'Merchant dashboard', issueKey: '', storyPoints: 8, billable: false },
        { id: 2, name: 'Export reports', issueKey: '', storyPoints: 5, billable: false },
      ]
    },
    { 
      id: 'blue', 
      name: 'Blue', 
      color: 'bg-blue-500',
      colorLight: 'bg-blue-50',
      colorText: 'text-blue-500',
      features: [
        { id: 1, name: 'API rate limiting', issueKey: '', storyPoints: 8, billable: false },
      ]
    },
    { 
      id: 'yellow', 
      name: 'Yellow', 
      color: 'bg-yellow-500',
      colorLight: 'bg-yellow-50',
      colorText: 'text-yellow-500',
      features: [
        { id: 1, name: 'Client XYZ integration', issueKey: '', storyPoints: 3, billable: true },
        { id: 2, name: 'Grafana dashboards', issueKey: '', storyPoints: 5, billable: false },
      ]
    },
  ]);

  const [sprintHistory, setSprintHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [newFeatures, setNewFeatures] = useState({
    red: { name: '', storyPoints: '' },
    green: { name: '', storyPoints: '' },
    blue: { name: '', storyPoints: '' },
    yellow: { name: '', storyPoints: '' },
  });

  // Load from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        setSyncStatus('syncing');
        const { data, error } = await supabase
          .from('sprints')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const sprint = data[0];
          setSprintId(sprint.id);
          if (sprint.name) setSprintName(sprint.name);
          if (sprint.cost_per_sp) setCostPerSP(sprint.cost_per_sp);
          if (sprint.teams) setTeams(sprint.teams);
          setLastSaved(new Date(sprint.created_at));
        }
        setSyncStatus('synced');
      } catch (e) {
        console.error('Failed to load from Supabase:', e);
        setSyncStatus('error');
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem('sprintCalculatorDraft');
          if (saved) {
            const localData = JSON.parse(saved);
            if (localData.teams) setTeams(localData.teams);
            if (localData.sprintName) setSprintName(localData.sprintName);
            if (localData.costPerSP) setCostPerSP(localData.costPerSP);
          }
        } catch (le) {
          console.error('Failed to load local draft:', le);
        }
      }
    };
    loadFromSupabase();
  }, []);

  // Save to Supabase
  const saveDraft = async () => {
    try {
      setSyncStatus('syncing');
      const sprintData = {
        name: sprintName,
        cost_per_sp: costPerSP,
        teams: teams,
      };
      
      let result;
      if (sprintId) {
        // Update existing
        result = await supabase
          .from('sprints')
          .update(sprintData)
          .eq('id', sprintId)
          .select();
      } else {
        // Insert new
        result = await supabase
          .from('sprints')
          .insert(sprintData)
          .select();
      }
      
      if (result.error) throw result.error;
      
      if (result.data && result.data[0]) {
        setSprintId(result.data[0].id);
      }
      
      // Also save to localStorage as backup
      localStorage.setItem('sprintCalculatorDraft', JSON.stringify({
        teams, sprintName, costPerSP, sprintHistory, savedAt: new Date().toISOString()
      }));
      
      setLastSaved(new Date());
      setSyncStatus('synced');
      setShowSaveConfirm(true);
      setTimeout(() => setShowSaveConfirm(false), 2000);
    } catch (e) {
      console.error('Failed to save to Supabase:', e);
      setSyncStatus('error');
      // Save to localStorage as fallback
      try {
        localStorage.setItem('sprintCalculatorDraft', JSON.stringify({
          teams, sprintName, costPerSP, sprintHistory, savedAt: new Date().toISOString()
        }));
        setLastSaved(new Date());
        setShowSaveConfirm(true);
        setTimeout(() => setShowSaveConfirm(false), 2000);
      } catch (le) {
        console.error('Failed to save locally:', le);
      }
    }
  };

  // Clear draft function
  const clearDraft = async () => {
    if (confirm('Clear all saved data? This cannot be undone.')) {
      try {
        if (sprintId) {
          await supabase.from('sprints').delete().eq('id', sprintId);
        }
        localStorage.removeItem('sprintCalculatorDraft');
        setSprintId(null);
        setLastSaved(null);
        // Reset to defaults
        setTeams([
          { id: 'red', name: 'Red', color: 'bg-red-500', colorLight: 'bg-red-50', colorText: 'text-red-500', features: [] },
          { id: 'green', name: 'Green', color: 'bg-green-500', colorLight: 'bg-green-50', colorText: 'text-green-500', features: [] },
          { id: 'blue', name: 'Blue', color: 'bg-blue-500', colorLight: 'bg-blue-50', colorText: 'text-blue-500', features: [] },
          { id: 'yellow', name: 'Yellow', color: 'bg-yellow-500', colorLight: 'bg-yellow-50', colorText: 'text-yellow-500', features: [] },
        ]);
        setSprintHistory([]);
        setSprintName('Sprint 1');
        setSyncStatus('idle');
      } catch (e) {
        console.error('Failed to clear:', e);
      }
    }
  };

  const teamsWithCalcs = teams.map(team => {
    const totalSP = team.features.reduce((sum, f) => sum + f.storyPoints, 0);
    const totalCost = totalSP * costPerSP;
    const billableSP = team.features.filter(f => f.billable).reduce((sum, f) => sum + f.storyPoints, 0);
    const billableCost = billableSP * costPerSP;
    const internalSP = totalSP - billableSP;
    const internalCost = totalCost - billableCost;
    return { ...team, totalSP, totalCost, billableSP, billableCost, internalSP, internalCost };
  });

  const grandTotalSP = teamsWithCalcs.reduce((sum, t) => sum + t.totalSP, 0);
  const grandTotalCost = grandTotalSP * costPerSP;
  const grandBillableSP = teamsWithCalcs.reduce((sum, t) => sum + t.billableSP, 0);
  const grandBillableCost = grandBillableSP * costPerSP;
  const grandInternalSP = grandTotalSP - grandBillableSP;
  const grandInternalCost = grandTotalCost - grandBillableCost;

  const updateFeature = (teamId, featureId, field, value) => {
    setTeams(teams.map(team => {
      if (team.id !== teamId) return team;
      return {
        ...team,
        features: team.features.map(f => 
          f.id === featureId ? { ...f, [field]: field === 'name' ? value : field === 'billable' ? value : parseFloat(value) || 0 } : f
        )
      };
    }));
  };

  const deleteFeature = (teamId, featureId) => {
    setTeams(teams.map(team => {
      if (team.id !== teamId) return team;
      return { ...team, features: team.features.filter(f => f.id !== featureId) };
    }));
  };

  const addFeature = (teamId) => {
    const newFeature = newFeatures[teamId];
    if (newFeature.name && newFeature.storyPoints) {
      setTeams(teams.map(team => {
        if (team.id !== teamId) return team;
        return {
          ...team,
          features: [...team.features, { 
            id: Date.now(), 
            name: newFeature.name,
            issueKey: '',
            storyPoints: parseFloat(newFeature.storyPoints),
            billable: false
          }]
        };
      }));
      setNewFeatures({ ...newFeatures, [teamId]: { name: '', storyPoints: '' } });
    }
  };

  const clearTeam = (teamId) => {
    setTeams(teams.map(team => {
      if (team.id !== teamId) return team;
      return { ...team, features: [] };
    }));
  };

  const saveSprint = () => {
    const sprintData = {
      id: Date.now(),
      name: sprintName,
      date: new Date().toLocaleDateString(),
      costPerSP,
      teams: teamsWithCalcs.map(t => ({
        id: t.id,
        name: t.name,
        totalSP: t.totalSP,
        totalCost: t.totalCost,
        billableSP: t.billableSP,
        billableCost: t.billableCost,
        internalSP: t.internalSP,
        internalCost: t.internalCost,
        features: t.features.map(f => ({ name: f.name, issueKey: f.issueKey, storyPoints: f.storyPoints, billable: f.billable }))
      })),
      grandTotalSP,
      grandTotalCost,
      grandBillableSP,
      grandBillableCost,
      grandInternalSP,
      grandInternalCost
    };
    setSprintHistory([sprintData, ...sprintHistory]);
    
    // Clear current sprint and increment name
    const sprintNum = parseInt(sprintName.match(/\d+/)?.[0] || '0') + 1;
    setSprintName(`Sprint ${sprintNum}`);
    setTeams(teams.map(team => ({ ...team, features: [] })));
  };

  const deleteSprint = (sprintId) => {
    setSprintHistory(sprintHistory.filter(s => s.id !== sprintId));
  };

  const exportToCSV = () => {
    let csv = 'Sprint,Team,Issue Key,Feature,Story Points,Cost (€),Billable\n';
    
    // Current sprint
    teamsWithCalcs.forEach(team => {
      team.features.forEach(feature => {
        csv += `"${sprintName}","${team.name}","${feature.issueKey || ''}","${feature.name}",${feature.storyPoints},${feature.storyPoints * costPerSP},${feature.billable ? 'Yes' : 'No'}\n`;
      });
    });
    
    // History
    sprintHistory.forEach(sprint => {
      sprint.teams.forEach(team => {
        team.features.forEach(feature => {
          csv += `"${sprint.name}","${team.name}","${feature.issueKey || ''}","${feature.name}",${feature.storyPoints},${feature.storyPoints * sprint.costPerSP},${feature.billable ? 'Yes' : 'No'}\n`;
        });
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-costs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSummaryCSV = () => {
    let csv = 'Sprint,Date,Total SP,Total Cost,Billable SP,Billable Cost,Internal SP,Internal Cost\n';
    
    // Current sprint
    csv += `"${sprintName}","${new Date().toLocaleDateString()}",${grandTotalSP},${grandTotalCost},${grandBillableSP},${grandBillableCost},${grandInternalSP},${grandInternalCost}\n`;
    
    // History
    sprintHistory.forEach(sprint => {
      csv += `"${sprint.name}","${sprint.date}",${sprint.grandTotalSP},${sprint.grandTotalCost},${sprint.grandBillableSP || 0},${sprint.grandBillableCost || 0},${sprint.grandInternalSP || sprint.grandTotalSP},${sprint.grandInternalCost || sprint.grandTotalCost}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmt = (val, dec = 0) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);

  // CSV Import functions
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;
    
    // Parse header - handle quoted values
    const parseRow = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };
    
    const header = parseRow(lines[0]).map(h => h.toLowerCase());
    
    // Find column indices - flexible matching for Jira exports
    const summaryIdx = header.findIndex(h => h === 'summary' || h.includes('title'));
    const teamIdx = header.findIndex(h => h === 'team name' || h === 'team');
    const spIdx = header.findIndex(h => h.includes('story point'));
    const clientIdx = header.findIndex(h => h.includes('client'));
    const issueKeyIdx = header.findIndex(h => h === 'issue key' || h === 'key');
    
    console.log('Headers found:', header);
    console.log('Column indices - Summary:', summaryIdx, 'Team:', teamIdx, 'SP:', spIdx, 'Client:', clientIdx, 'Issue Key:', issueKeyIdx);
    
    if (summaryIdx === -1) {
      return { error: `Missing "Summary" column. Found columns: ${header.slice(0, 10).join(', ')}...` };
    }
    if (teamIdx === -1) {
      return { error: `Missing "Team Name" column. Found columns: ${header.slice(0, 10).join(', ')}...` };
    }
    if (spIdx === -1) {
      return { error: `Missing "Story Points" column. Found columns: ${header.slice(0, 10).join(', ')}...` };
    }
    
    // Parse rows
    const features = [];
    const skipped = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseRow(lines[i]);
      
      const name = values[summaryIdx] || '';
      const teamName = (values[teamIdx] || '').toLowerCase();
      const spRaw = values[spIdx] || '';
      const sp = parseFloat(spRaw) || 0;
      const client = clientIdx !== -1 ? (values[clientIdx] || '') : '';
      const issueKey = issueKeyIdx !== -1 ? (values[issueKeyIdx] || '') : '';
      
      // Map team name to team id
      let teamId = null;
      if (teamName.includes('red')) teamId = 'red';
      else if (teamName.includes('green')) teamId = 'green';
      else if (teamName.includes('blue')) teamId = 'blue';
      else if (teamName.includes('yellow')) teamId = 'yellow';
      
      if (!name) continue; // Skip empty rows
      
      if (sp === 0) {
        skipped.push({ name, issueKey, reason: 'No Story Points', teamId, teamName });
        continue;
      }
      
      if (!teamId) {
        skipped.push({ name, issueKey, reason: `Unknown team: "${teamName}"`, teamId: null, teamName });
        continue;
      }
      
      features.push({
        id: Date.now() + i,
        name,
        issueKey,
        storyPoints: sp,
        billable: client && client.trim() !== '',
        teamId,
        client: client || null
      });
    }
    
    return { features, skipped, hasClientColumn: clientIdx !== -1 };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const result = parseCSV(text);
      
      if (result?.error) {
        setImportError(result.error);
        setImportPreview(null);
      } else if (result?.features?.length > 0) {
        setImportPreview(result);
        setImportError(null);
      } else {
        setImportError('No valid features found in CSV');
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const confirmImport = () => {
    if (!importPreview?.features) return;
    
    setTeams(teams.map(team => ({
      ...team,
      features: [
        ...team.features,
        ...importPreview.features
          .filter(f => f.teamId === team.id)
          .map(f => ({ id: f.id, name: f.name, issueKey: f.issueKey, storyPoints: f.storyPoints, billable: f.billable }))
      ]
    })));
    
    setImportPreview(null);
  };

  const cancelImport = () => {
    setImportPreview(null);
    setImportError(null);
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />

      {/* Import Preview Modal */}
      {(importPreview || importError) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-4 ${cardText}`}>
              {importError ? 'Import Error' : 'Import Preview'}
            </h3>
            
            {importError && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                {importError}
              </div>
            )}
            
            {importPreview && (
              <>
                <p className={`mb-4 ${labelText}`}>
                  Found {importPreview.features.length} features to import:
                </p>
                
                <div className="space-y-2 mb-4 max-h-60 overflow-auto">
                  {['red', 'green', 'blue', 'yellow'].map(teamId => {
                    const teamFeatures = importPreview.features.filter(f => f.teamId === teamId);
                    if (teamFeatures.length === 0) return null;
                    return (
                      <div key={teamId} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`font-semibold capitalize mb-2 ${cardText}`}>{teamId} Team ({teamFeatures.length})</div>
                        {teamFeatures.map(f => (
                          <div key={f.id} className={`flex items-center gap-2 text-sm py-1 ${labelText}`}>
                            <span className={`px-1 rounded text-xs ${f.billable ? 'bg-emerald-500 text-white' : darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              {f.billable ? '€' : '—'}
                            </span>
                            {f.issueKey && (
                              <span className={`text-xs font-mono ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{f.issueKey}</span>
                            )}
                            <span className="flex-1 truncate">{f.name}</span>
                            <span>{f.storyPoints} SP</span>
                            {f.client && <span className="text-emerald-500">({f.client})</span>}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                
                {importPreview.skipped && importPreview.skipped.length > 0 && (
                  <div className="bg-amber-100 text-amber-800 p-4 rounded-lg mb-4">
                    <div className="font-semibold mb-2">⚠️ {importPreview.skipped.length} item(s) will be skipped:</div>
                    <div className="space-y-1 text-sm max-h-32 overflow-auto">
                      {importPreview.skipped.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-amber-600">•</span>
                          {item.issueKey && (
                            <span className="text-xs font-mono text-amber-700">{item.issueKey}</span>
                          )}
                          <span className="flex-1 truncate">{item.name}</span>
                          <span className="text-amber-600 text-xs">({item.reason})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!importPreview.hasClientColumn && (
                  <p className={`text-sm mb-4 ${labelText}`}>
                    ⚠️ No "Client" column found - all features will be marked as internal. You can toggle billable status manually after import.
                  </p>
                )}
              </>
            )}
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelImport}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
              >
                Cancel
              </button>
              {importPreview && (
                <button
                  onClick={confirmImport}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Import {importPreview.features.length} Features
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sprint Preview Modal */}
      {showSprintPreview && (
        <>
          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              #sprint-modal, #sprint-modal * { visibility: visible !important; }
              #sprint-modal { 
                position: absolute !important; 
                left: 0 !important; 
                top: 0 !important; 
                width: 100% !important;
                padding: 20px !important;
                background: white !important;
              }
              .print-hide { display: none !important; }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .bg-violet-600 { background-color: #7c3aed !important; }
              .bg-emerald-600 { background-color: #059669 !important; }
              .bg-gray-600 { background-color: #4b5563 !important; }
              .bg-red-500 { background-color: #ef4444 !important; }
              .bg-green-500 { background-color: #22c55e !important; }
              .bg-blue-500 { background-color: #3b82f6 !important; }
              .bg-yellow-500 { background-color: #eab308 !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
              .bg-emerald-100 { background-color: #d1fae5 !important; }
              .text-violet-600 { color: #7c3aed !important; }
              .text-emerald-600 { color: #059669 !important; }
              .text-emerald-700 { color: #047857 !important; }
              .text-indigo-600 { color: #4f46e5 !important; }
              .border-violet-600 { border-color: #7c3aed !important; }
            }
          `}</style>
          <div id="sprint-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:block">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto print:max-h-none print:shadow-none print:rounded-none print:max-w-none print:overflow-visible">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center print-hide">
                <h2 className="font-bold text-lg text-gray-800">Sprint Report Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                  >
                    Print / PDF
                  </button>
                  <button
                    onClick={() => setShowSprintPreview(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            
            {/* Modal Content */}
            <div className="p-6 print:p-8">
              {/* Header */}
              <div className="border-b-2 border-violet-600 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-violet-600">{sprintName}</h1>
                <div className="text-gray-500 text-sm mt-1">
                  Generated: {new Date().toLocaleDateString()} • Cost per SP: €{costPerSP}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-violet-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xs uppercase opacity-75">Total Story Points</div>
                  <div className="text-3xl font-bold">{grandTotalSP}</div>
                </div>
                <div className="bg-violet-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xs uppercase opacity-75">Total Cost</div>
                  <div className="text-3xl font-bold">€{grandTotalCost.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xs uppercase opacity-75">Billable (Client)</div>
                  <div className="text-3xl font-bold">€{grandBillableCost.toLocaleString()}</div>
                  <div className="text-xs opacity-75">{grandBillableSP} SP</div>
                </div>
                <div className="bg-gray-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xs uppercase opacity-75">Internal (Gateway)</div>
                  <div className="text-3xl font-bold">€{grandInternalCost.toLocaleString()}</div>
                  <div className="text-xs opacity-75">{grandInternalSP} SP</div>
                </div>
              </div>

              {/* Teams Grid */}
              <h2 className="text-lg font-semibold text-violet-600 mb-4 pb-2 border-b">Team Breakdown</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {teamsWithCalcs.map(team => (
                  <div key={team.id} className="border rounded-xl overflow-hidden">
                    <div className={`${team.color} px-4 py-2 text-white font-bold flex justify-between`}>
                      <span>{team.name} Team</span>
                      <span>{team.totalSP} SP • €{team.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="p-4">
                      {team.features.length === 0 ? (
                        <div className="text-gray-400 text-sm italic">No features</div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-500 text-xs">
                              <th className="text-left pb-2">Feature</th>
                              <th className="text-right pb-2">SP</th>
                              <th className="text-right pb-2">Cost</th>
                              <th className="text-center pb-2">Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {team.features.map(f => (
                              <tr key={f.id} className="border-t">
                                <td className="py-2 pr-2">
                                  {f.issueKey && <span className="text-indigo-600 font-mono text-xs mr-1">{f.issueKey}</span>}
                                  {f.name}
                                </td>
                                <td className="py-2 text-right font-medium">{f.storyPoints}</td>
                                <td className="py-2 text-right">€{(f.storyPoints * costPerSP).toLocaleString()}</td>
                                <td className="py-2 text-center">
                                  {f.billable 
                                    ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Client</span>
                                    : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Internal</span>
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 font-semibold">
                              <td className="pt-2">Subtotal</td>
                              <td className="pt-2 text-right">{team.totalSP}</td>
                              <td className="pt-2 text-right">€{team.totalCost.toLocaleString()}</td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      )}
                      {team.billableSP > 0 && (
                        <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex justify-between">
                          <span>Billable: {team.billableSP} SP (€{team.billableCost.toLocaleString()})</span>
                          <span>Internal: {team.internalSP} SP (€{team.internalCost.toLocaleString()})</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-gray-500 text-sm text-center">
                {sprintName} Report • Generated {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Save Confirmation Toast */}
      {showSaveConfirm && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Draft saved!
        </div>
      )}

      {/* Sprint Header */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className={`block text-xs mb-1 ${labelText}`}>Sprint</label>
              <input
                type="text"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                className={`text-xl font-bold border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none bg-transparent ${cardText}`}
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
            >
              <Upload className="w-4 h-4" />
              Import Jira
            </button>
            <button
              onClick={saveDraft}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            {syncStatus === 'syncing' && (
              <span className="flex items-center gap-1 text-xs text-blue-500">
                <Cloud className="w-4 h-4 animate-pulse" />
                Syncing...
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Cloud className="w-4 h-4" />
                Synced
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <CloudOff className="w-4 h-4" />
                Offline
              </span>
            )}
            {lastSaved && (
              <span className={`text-xs ${labelText}`}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={clearDraft}
              className={`text-xs ${labelText} hover:text-red-500`}
            >
              Clear all
            </button>
            <div className="text-right">
              <label className={`block text-xs mb-1 ${labelText}`}>Cost per SP</label>
              <div className="flex items-center gap-1">
                <span className={labelText}>€</span>
                <input
                  type="number"
                  value={costPerSP}
                  onChange={(e) => setCostPerSP(parseFloat(e.target.value) || 0)}
                  className={`w-20 text-lg font-semibold border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none text-right bg-transparent ${cardText}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billable Legend */}
      <div className={`rounded-xl p-4 shadow-sm border ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-sm ${labelText}`}>Feature type:</span>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded text-xs font-bold bg-emerald-500 text-white min-w-6 text-center">€</span>
              <span className={`text-sm ${cardText}`}>Billable (client work)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`p-1 rounded text-xs font-bold min-w-6 text-center ${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'}`}>—</span>
              <span className={`text-sm ${cardText}`}>Internal (gateway)</span>
            </div>
          </div>
          <span className={`text-xs ${labelText}`}>Click to toggle</span>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamsWithCalcs.map((team) => (
          <div key={team.id} className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Team Header */}
            <div className={`${team.color} px-4 py-3 flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{team.name} Team</span>
              </div>
              <div className="text-white text-sm">
                <span className="opacity-75">{team.totalSP} SP</span>
                <span className="mx-2">•</span>
                <span className="font-bold">€{fmt(team.totalCost)}</span>
              </div>
            </div>

            {/* Features List */}
            <div className={`p-4 space-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {team.features.length === 0 && (
                <div className={`text-center py-4 text-sm ${labelText}`}>No features yet</div>
              )}
              
              {team.features.map((feature) => (
                <div key={feature.id} className={`flex items-center gap-2 rounded-lg p-2 ${darkMode ? 'bg-gray-700' : team.colorLight}`}>
                  <button
                    onClick={() => updateFeature(team.id, feature.id, 'billable', !feature.billable)}
                    className={`shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${feature.billable ? 'bg-emerald-500 text-white' : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'}`}
                    title={feature.billable ? 'Billable (click to change)' : 'Internal (click to change)'}
                  >
                    {feature.billable ? '€' : '—'}
                  </button>
                  {feature.issueKey && (
                    <span className={`shrink-0 text-xs font-mono px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      {feature.issueKey}
                    </span>
                  )}
                  <input
                    type="text"
                    value={feature.name}
                    onChange={(e) => updateFeature(team.id, feature.id, 'name', e.target.value)}
                    className={`flex-1 min-w-0 px-2 py-1 text-sm border rounded ${inputBg}`}
                  />
                  <input
                    type="number"
                    value={feature.storyPoints}
                    onChange={(e) => updateFeature(team.id, feature.id, 'storyPoints', e.target.value)}
                    className={`shrink-0 w-14 px-2 py-1 text-sm border rounded text-center ${inputBg}`}
                  />
                  <span className={`shrink-0 w-14 text-xs text-right ${labelText}`}>€{fmt(feature.storyPoints * costPerSP)}</span>
                  <button 
                    onClick={() => deleteFeature(team.id, feature.id)} 
                    className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add new feature */}
              <div className={`flex items-center gap-2 border-t border-dashed pt-2 mt-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <input
                  type="text"
                  placeholder="Feature..."
                  value={newFeatures[team.id].name}
                  onChange={(e) => setNewFeatures({
                    ...newFeatures, 
                    [team.id]: { ...newFeatures[team.id], name: e.target.value }
                  })}
                  className={`flex-1 px-2 py-1 text-sm border rounded ${inputBg}`}
                />
                <input
                  type="number"
                  placeholder="SP"
                  value={newFeatures[team.id].storyPoints}
                  onChange={(e) => setNewFeatures({
                    ...newFeatures, 
                    [team.id]: { ...newFeatures[team.id], storyPoints: e.target.value }
                  })}
                  className={`w-16 px-2 py-1 text-sm border rounded text-center ${inputBg}`}
                />
                <button 
                  onClick={() => addFeature(team.id)} 
                  className={`p-1 ${team.color} text-white rounded hover:opacity-80`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Team Footer */}
            {team.features.length > 0 && (
              <div className={`px-4 py-2 border-t flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <button 
                  onClick={() => clearTeam(team.id)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Clear all
                </button>
                <div className={`text-sm font-semibold ${team.colorText}`}>
                  {team.totalSP} SP = €{fmt(team.totalCost)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sprint Summary */}
      <div className="bg-violet-600 rounded-xl p-6 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-75 mb-4">{sprintName} Summary</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          {teamsWithCalcs.map((team) => (
            <div key={team.id} className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xs opacity-75">{team.name}</div>
              <div className="text-lg font-bold">{team.totalSP} SP</div>
              <div className="text-sm opacity-75">€{fmt(team.totalCost)}</div>
              {team.billableSP > 0 && (
                <div className="text-xs text-emerald-300 mt-1">€{fmt(team.billableCost)} billable</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <div>
            <span className="font-bold text-lg">Sprint Total</span>
            <span className="ml-2 opacity-75">({grandTotalSP} SP)</span>
          </div>
          <span className="text-3xl font-bold">€{fmt(grandTotalCost)}</span>
        </div>

        {/* Billable Breakdown */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
          <div className="bg-emerald-500/30 rounded-lg p-3">
            <div className="text-xs opacity-75">Billable (Client Work)</div>
            <div className="text-xl font-bold">€{fmt(grandBillableCost)}</div>
            <div className="text-sm opacity-75">{grandBillableSP} SP</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-75">Internal (Gateway)</div>
            <div className="text-xl font-bold">€{fmt(grandInternalCost)}</div>
            <div className="text-sm opacity-75">{grandInternalSP} SP</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`rounded-xl p-4 shadow-sm border ${cardBg}`}>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={saveSprint}
              disabled={grandTotalSP === 0}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Sprint & Start New
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <History className="w-4 h-4" />
              History ({sprintHistory.length})
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSprintPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FileText className="w-4 h-4" />
              Preview Report
            </button>
          </div>
        </div>
      </div>

      {/* Sprint History */}
      {showHistory && (
        <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wide ${labelText}`}>Sprint History</h2>
          </div>
          
          {sprintHistory.length === 0 ? (
            <div className={`p-8 text-center ${labelText} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              No saved sprints yet. Complete a sprint and click "Save Sprint" to add it here.
            </div>
          ) : (
            <div className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
              {sprintHistory.map((sprint) => (
                <div key={sprint.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`font-bold ${cardText}`}>{sprint.name}</h3>
                      <p className={`text-sm ${labelText}`}>{sprint.date} • €{sprint.costPerSP}/SP</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-violet-500">€{fmt(sprint.grandTotalCost)}</div>
                        <div className={`text-sm ${labelText}`}>{sprint.grandTotalSP} SP</div>
                      </div>
                      <button
                        onClick={() => deleteSprint(sprint.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {sprint.teams.map((team) => (
                      <div key={team.id} className={`rounded-lg p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-medium ${labelText}`}>{team.name}</span>
                          <span className={`text-xs ${labelText}`}>{team.totalSP} SP</span>
                        </div>
                        <div className={`text-sm font-semibold ${cardText}`}>€{fmt(team.totalCost)}</div>
                        {team.features.length > 0 && (
                          <div className={`mt-1 text-xs ${labelText}`}>
                            {team.features.slice(0, 2).map(f => f.name).join(', ')}
                            {team.features.length > 2 && ` +${team.features.length - 2} more`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* History Summary */}
          {sprintHistory.length > 0 && (
            <div className={`px-6 py-4 border-t ${darkMode ? 'bg-violet-900/30 border-gray-700' : 'bg-violet-50 border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${darkMode ? 'text-violet-300' : 'text-violet-800'}`}>
                  Total across {sprintHistory.length} sprint{sprintHistory.length > 1 ? 's' : ''}
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold text-violet-500">
                    €{fmt(sprintHistory.reduce((sum, s) => sum + s.grandTotalCost, 0))}
                  </span>
                  <span className={`text-sm ml-2 ${darkMode ? 'text-violet-400' : 'text-violet-400'}`}>
                    ({sprintHistory.reduce((sum, s) => sum + s.grandTotalSP, 0)} SP)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cost Distribution */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${labelText}`}>Cost Distribution</h2>
        <div className="space-y-3">
          {teamsWithCalcs.map((team) => {
            const pct = grandTotalCost > 0 ? (team.totalCost / grandTotalCost) * 100 : 0;
            return (
              <div key={team.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={cardText}>{team.name} Team</span>
                  <span className={labelText}>{fmt(pct, 1)}% • €{fmt(team.totalCost)}</span>
                </div>
                <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className={`${team.color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Commercial Offer Calculator for Client Quotes
function CommercialOfferCalculator({ darkMode }) {
  const [projectName, setProjectName] = useState('Client Feature Request');
  const [clientName, setClientName] = useState('');
  const [margin, setMargin] = useState(20);
  
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const cardText = darkMode ? 'text-white' : 'text-gray-800';
  const labelText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Backend Developer', hourlyRate: 75, hours: 40 },
    { id: 2, name: 'Frontend Developer', hourlyRate: 55, hours: 24 },
    { id: 3, name: 'QA Engineer', hourlyRate: 45, hours: 16 },
    { id: 4, name: 'DevOps', hourlyRate: 70, hours: 8 },
    { id: 5, name: 'Project Manager', hourlyRate: 60, hours: 12 },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Requirements & Planning', description: 'Gathering requirements, technical planning' },
    { id: 2, name: 'Development', description: 'Core implementation' },
    { id: 3, name: 'Testing & QA', description: 'Testing, bug fixes' },
    { id: 4, name: 'Deployment', description: 'Production deployment, documentation' },
  ]);

  const [newMember, setNewMember] = useState({ name: '', hourlyRate: 50, hours: 0 });

  const totalHours = teamMembers.reduce((sum, m) => sum + m.hours, 0);
  const totalCost = teamMembers.reduce((sum, m) => sum + (m.hours * m.hourlyRate), 0);
  const marginAmount = totalCost * (margin / 100);
  const finalPrice = totalCost + marginAmount;

  const updateMember = (id, field, value) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, [field]: field === 'name' ? value : parseFloat(value) || 0 } : m
    ));
  };

  const deleteMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const addMember = () => {
    if (newMember.name) {
      setTeamMembers([...teamMembers, { ...newMember, id: Date.now() }]);
      setNewMember({ name: '', role: 'Middle', hourlyRate: 50, hours: 0 });
    }
  };

  const fmt = (val, dec = 0) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);

  const exportQuote = () => {
    let csv = 'Commercial Offer\n\n';
    csv += `Project,${projectName}\n`;
    csv += `Client,${clientName}\n`;
    csv += `Date,${new Date().toLocaleDateString()}\n\n`;
    csv += 'Team Member,Hourly Rate (€),Hours,Cost (€)\n';
    
    teamMembers.forEach(m => {
      csv += `"${m.name}",${m.hourlyRate},${m.hours},${m.hours * m.hourlyRate}\n`;
    });
    
    csv += `\nSubtotal,,${totalHours},€${fmt(totalCost)}\n`;
    csv += `Margin (${margin}%),,,"€${fmt(marginAmount)}"\n`;
    csv += `Total,,,"€${fmt(finalPrice)}"\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${clientName || 'client'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={`block text-xs mb-1 ${labelText}`}>Project / Feature Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={`w-full text-xl font-bold border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none bg-transparent ${cardText}`}
              placeholder="Feature name..."
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${labelText}`}>Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
              placeholder="Client name..."
            />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${cardBg}`}>
        <div className="bg-indigo-600 px-4 py-3">
          <h2 className="font-bold text-white">Team & Hours Allocation</h2>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className={`grid grid-cols-12 gap-2 text-xs font-medium px-2 ${labelText}`}>
            <div className="col-span-5">Team Member</div>
            <div className="col-span-2 text-right">Rate/hr</div>
            <div className="col-span-2 text-right">Hours</div>
            <div className="col-span-3 text-right">Cost</div>
          </div>

          {/* Members */}
          {teamMembers.map((member) => (
            <div key={member.id} className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="col-span-5">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputBg}`}
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-end gap-1">
                  <span className={`text-xs ${labelText}`}>€</span>
                  <input
                    type="number"
                    value={member.hourlyRate}
                    onChange={(e) => updateMember(member.id, 'hourlyRate', e.target.value)}
                    className={`w-16 px-2 py-1 text-sm border rounded text-right ${inputBg}`}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={member.hours}
                  onChange={(e) => updateMember(member.id, 'hours', e.target.value)}
                  className={`w-full px-2 py-1 text-sm border rounded text-right ${inputBg}`}
                />
              </div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <span className={`text-sm font-medium ${cardText}`}>€{fmt(member.hours * member.hourlyRate)}</span>
                <button 
                  onClick={() => deleteMember(member.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add new member */}
          <div className={`grid grid-cols-12 gap-2 items-center border-t border-dashed pt-3 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <div className="col-span-5">
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Add team member..."
                className={`w-full px-2 py-1 text-sm border rounded ${inputBg}`}
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-end gap-1">
                <span className={`text-xs ${labelText}`}>€</span>
                <input
                  type="number"
                  value={newMember.hourlyRate}
                  onChange={(e) => setNewMember({ ...newMember, hourlyRate: parseFloat(e.target.value) || 0 })}
                  className={`w-16 px-2 py-1 text-sm border rounded text-right ${inputBg}`}
                />
              </div>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={newMember.hours || ''}
                onChange={(e) => setNewMember({ ...newMember, hours: parseFloat(e.target.value) || 0 })}
                placeholder="Hrs"
                className={`w-full px-2 py-1 text-sm border rounded text-right ${inputBg}`}
              />
            </div>
            <div className="col-span-3 flex justify-end">
              <button
                onClick={addMember}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-emerald-600 rounded-xl p-6 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-75 mb-4">Quote Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Total Hours</div>
            <div className="text-2xl font-bold">{fmt(totalHours)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Base Cost</div>
            <div className="text-2xl font-bold">€{fmt(totalCost)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Margin</div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                className="w-14 px-2 py-1 text-lg font-bold text-center bg-white/20 border border-white/30 rounded text-white"
              />
              <span className="text-lg font-bold">%</span>
            </div>
            <div className="text-xs opacity-75 mt-1">€{fmt(marginAmount)}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Client Price</div>
            <div className="text-3xl font-bold">€{fmt(finalPrice)}</div>
          </div>
        </div>

        {/* Per-hour breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-xs opacity-75">Avg Internal Rate</div>
            <div className="text-lg font-semibold">€{totalHours > 0 ? fmt(totalCost / totalHours, 2) : '0'}/hr</div>
          </div>
          <div className="text-center">
            <div className="text-xs opacity-75">Client Rate (with margin)</div>
            <div className="text-lg font-semibold">€{totalHours > 0 ? fmt(finalPrice / totalHours, 2) : '0'}/hr</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`rounded-xl p-4 shadow-sm border ${cardBg}`}>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className={`text-sm ${labelText}`}>
            {clientName && <span>Quote for <strong className={cardText}>{clientName}</strong> • </span>}
            {teamMembers.length} team members • {fmt(totalHours)} hours
          </div>
          <button
            onClick={exportQuote}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" />
            Export Quote (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}

// Client Proposal Calculator - Multi-feature proposals with deliverables
function ClientProposalCalculator({ darkMode }) {
  const [clientName, setClientName] = useState('');
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const [margin, setMargin] = useState(20);
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [proposalId, setProposalId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const cardText = darkMode ? 'text-white' : 'text-gray-800';
  const labelText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';

  const [features, setFeatures] = useState([
    {
      id: 1,
      name: 'API Integration',
      description: 'Integrate with client payment system',
      deliverables: [
        'REST API endpoints for payment processing',
        'Webhook notifications for status updates',
        'API documentation and examples',
      ],
      team: [
        { id: 1, name: 'Backend Developer', rate: 75, hours: 40 },
        { id: 2, name: 'QA Engineer', rate: 45, hours: 8 },
      ],
      expanded: true
    },
  ]);

  const [expandedFeature, setExpandedFeature] = useState(1);

  // Load from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        setSyncStatus('syncing');
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const proposal = data[0];
          setProposalId(proposal.id);
          if (proposal.client_name) setClientName(proposal.client_name);
          if (proposal.valid_until) setValidUntil(proposal.valid_until);
          if (proposal.margin) setMargin(proposal.margin);
          if (proposal.features) setFeatures(proposal.features);
          if (proposal.notes) setNotes(proposal.notes);
          setLastSaved(new Date(proposal.created_at));
        }
        setSyncStatus('synced');
      } catch (e) {
        console.error('Failed to load from Supabase:', e);
        setSyncStatus('error');
      }
    };
    loadFromSupabase();
  }, []);

  // Save to Supabase
  const saveProposal = async () => {
    try {
      setSyncStatus('syncing');
      const proposalData = {
        client_name: clientName,
        valid_until: validUntil,
        margin: margin,
        features: features,
        notes: notes,
      };
      
      let result;
      if (proposalId) {
        result = await supabase
          .from('proposals')
          .update(proposalData)
          .eq('id', proposalId)
          .select();
      } else {
        result = await supabase
          .from('proposals')
          .insert(proposalData)
          .select();
      }
      
      if (result.error) throw result.error;
      
      if (result.data && result.data[0]) {
        setProposalId(result.data[0].id);
      }
      
      setLastSaved(new Date());
      setSyncStatus('synced');
    } catch (e) {
      console.error('Failed to save to Supabase:', e);
      setSyncStatus('error');
    }
  };

  // Auto-save on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (clientName || features.length > 0) {
        saveProposal();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [clientName, validUntil, margin, features, notes]);

  const calculateFeatureCost = (feature) => {
    return feature.team.reduce((sum, m) => sum + (m.hours * m.rate), 0);
  };

  const calculateFeatureHours = (feature) => {
    return feature.team.reduce((sum, m) => sum + m.hours, 0);
  };

  const totalBaseCost = features.reduce((sum, f) => sum + calculateFeatureCost(f), 0);
  const totalHours = features.reduce((sum, f) => sum + calculateFeatureHours(f), 0);
  const marginAmount = totalBaseCost * (margin / 100);
  const totalPrice = totalBaseCost + marginAmount;

  const fmt = (val, dec = 0) => new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(val);

  const copyToClipboard = () => {
    const text = features.map((f, i) => {
      const deliverables = f.deliverables.filter(d => d.trim()).map(d => '  ✓ ' + d).join('\n');
      const team = f.team.filter(m => m.name && m.hours > 0).map(m => 
        '  - ' + m.name + ': ' + m.hours + 'h = €' + fmt(m.hours * m.rate * (1 + margin/100))
      ).join('\n');
      return '--- Feature #' + (i+1) + ': ' + f.name + ' ---\n' +
        (f.description ? f.description + '\n' : '') +
        '\nDeliverables:\n' + deliverables +
        '\n\nTeam:\n' + team +
        '\nSubtotal: €' + fmt(calculateFeatureCost(f) * (1 + margin/100));
    }).join('\n\n');
    
    const summary = '\n\n=== SUMMARY ===\n' +
      'Features: ' + features.length + '\n' +
      'Total Hours: ' + fmt(totalHours) + '\n' +
      'Total: €' + fmt(totalPrice);
    
    navigator.clipboard.writeText('PROPOSAL' + (clientName ? ' for ' + clientName : '') + '\n\n' + text + summary);
    alert('Copied to clipboard!');
  };

  const addFeature = () => {
    const newId = Date.now();
    setFeatures([...features, {
      id: newId,
      name: 'New Feature',
      description: '',
      deliverables: [''],
      team: [{ id: 1, name: 'Developer', rate: 60, hours: 0 }],
      expanded: true
    }]);
    setExpandedFeature(newId);
  };

  const deleteFeature = (featureId) => {
    if (features.length > 1) {
      setFeatures(features.filter(f => f.id !== featureId));
    }
  };

  const updateFeature = (featureId, field, value) => {
    setFeatures(features.map(f => 
      f.id === featureId ? { ...f, [field]: value } : f
    ));
  };

  const addDeliverable = (featureId) => {
    setFeatures(features.map(f => 
      f.id === featureId ? { ...f, deliverables: [...f.deliverables, ''] } : f
    ));
  };

  const updateDeliverable = (featureId, index, value) => {
    setFeatures(features.map(f => {
      if (f.id !== featureId) return f;
      const newDeliverables = [...f.deliverables];
      newDeliverables[index] = value;
      return { ...f, deliverables: newDeliverables };
    }));
  };

  const deleteDeliverable = (featureId, index) => {
    setFeatures(features.map(f => {
      if (f.id !== featureId) return f;
      return { ...f, deliverables: f.deliverables.filter((_, i) => i !== index) };
    }));
  };

  const addTeamMember = (featureId) => {
    setFeatures(features.map(f => {
      if (f.id !== featureId) return f;
      return { ...f, team: [...f.team, { id: Date.now(), name: '', rate: 60, hours: 0 }] };
    }));
  };

  const updateTeamMember = (featureId, memberId, field, value) => {
    setFeatures(features.map(f => {
      if (f.id !== featureId) return f;
      return {
        ...f,
        team: f.team.map(m => 
          m.id === memberId ? { ...m, [field]: field === 'name' ? value : parseFloat(value) || 0 } : m
        )
      };
    }));
  };

  const deleteTeamMember = (featureId, memberId) => {
    setFeatures(features.map(f => {
      if (f.id !== featureId) return f;
      return { ...f, team: f.team.filter(m => m.id !== memberId) };
    }));
  };

  return (
    <div className="space-y-6">
      {/* Preview Modal */}
      {showPreview && (
        <>
          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              #proposal-modal, #proposal-modal * { visibility: visible !important; }
              #proposal-modal { 
                position: absolute !important; 
                left: 0 !important; 
                top: 0 !important; 
                width: 100% !important;
                padding: 20px !important;
                background: white !important;
              }
              .print-hide { display: none !important; }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .bg-gradient-to-r { background: linear-gradient(to right, #4f46e5, #7c3aed) !important; }
              .from-indigo-600 { --tw-gradient-from: #4f46e5 !important; }
              .to-violet-600 { --tw-gradient-to: #7c3aed !important; }
              .bg-gray-50 { background-color: #f9fafb !important; }
              .bg-emerald-100 { background-color: #d1fae5 !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
              .bg-gray-200 { background-color: #e5e7eb !important; }
              .bg-amber-50 { background-color: #fffbeb !important; }
              .text-emerald-500 { color: #10b981 !important; }
              .text-emerald-600 { color: #059669 !important; }
              .text-emerald-700 { color: #047857 !important; }
              .text-indigo-600 { color: #4f46e5 !important; }
              .text-amber-800 { color: #92400e !important; }
              .text-amber-900 { color: #78350f !important; }
              .border-indigo-600 { border-color: #4f46e5 !important; }
              .border-amber-300 { border-color: #fcd34d !important; }
            }
          `}</style>
          <div id="proposal-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:block">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto print:max-h-none print:shadow-none print:rounded-none print:max-w-none print:overflow-visible">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center print-hide">
                <h2 className="font-bold text-lg text-gray-800">Proposal Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                  >
                    Print / PDF
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 print:p-8">
                <div className="border-b-2 border-indigo-600 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    {clientName ? 'Proposal for ' + clientName : 'Proposal'}
                  </h1>
                  <div className="text-gray-500 text-sm mt-1">
                    <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                    <div><strong>Valid Until:</strong> {new Date(validUntil).toLocaleDateString()}</div>
                  </div>
              </div>

              <h2 className="text-lg font-semibold text-indigo-600 mb-4 pb-2 border-b">Scope of Work</h2>
              
              {features.map((f, i) => (
                <div key={f.id} className="bg-gray-50 rounded-lg p-4 mb-4 border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-800">{f.name}</div>
                      {f.description && <div className="text-gray-500 text-sm">{f.description}</div>}
                    </div>
                    <div className="text-lg font-bold text-emerald-600">
                      €{fmt(calculateFeatureCost(f) * (1 + margin/100))}
                    </div>
                  </div>
                  
                  {f.deliverables.filter(d => d.trim()).length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-600 mb-2">Deliverables & Acceptance Criteria</div>
                      {f.deliverables.filter(d => d.trim()).map((d, di) => (
                        <div key={di} className="flex gap-2 text-sm mb-1">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 font-semibold">Resource</th>
                        <th className="text-right p-2 font-semibold">Hours</th>
                        <th className="text-right p-2 font-semibold">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {f.team.filter(m => m.name && m.hours > 0).map(m => (
                        <tr key={m.id} className="border-b">
                          <td className="p-2">{m.name}</td>
                          <td className="p-2 text-right">{m.hours}h</td>
                          <td className="p-2 text-right">€{fmt(m.hours * m.rate * (1 + margin/100))}</td>
                        </tr>
                      ))}
                      <tr className="font-semibold bg-gray-100">
                        <td className="p-2">Subtotal</td>
                        <td className="p-2 text-right">{calculateFeatureHours(f)}h</td>
                        <td className="p-2 text-right">€{fmt(calculateFeatureCost(f) * (1 + margin/100))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Summary */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white mt-6">
                <div className="text-sm uppercase tracking-wide opacity-75 mb-4">Investment Summary</div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs opacity-75">Features</div>
                    <div className="text-2xl font-bold">{features.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-75">Total Hours</div>
                    <div className="text-2xl font-bold">{fmt(totalHours)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-75">Timeline</div>
                    <div className="text-2xl font-bold">{Math.ceil(totalHours / 40)}w</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-75">Avg Rate</div>
                    <div className="text-2xl font-bold">€{totalHours > 0 ? fmt(totalPrice / totalHours) : 0}/h</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <div className="text-lg">Total Investment</div>
                  <div className="text-3xl font-bold">€{fmt(totalPrice)}</div>
                </div>
              </div>

              {notes && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mt-4">
                  <div className="font-semibold text-amber-800 mb-1">Additional Notes</div>
                  <div className="text-amber-900 text-sm whitespace-pre-wrap">{notes}</div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t text-gray-500 text-sm">
                This proposal is valid until {new Date(validUntil).toLocaleDateString()}. Prices are in EUR and exclude applicable taxes.
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Project Header */}
      <div className={`rounded-xl p-6 shadow-sm border ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs mb-1 ${labelText}`}>Client</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
              placeholder="Client name..."
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${labelText}`}>Valid Until</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      {features.map((feature, fIndex) => (
        <div key={feature.id} className={`rounded-xl shadow-sm border overflow-hidden ${cardBg}`}>
          {/* Feature Header */}
          <div 
            className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
              fIndex % 2 === 0 ? 'bg-indigo-600' : 'bg-violet-600'
            }`}
            onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm font-mono">#{fIndex + 1}</span>
              <input
                type="text"
                value={feature.name}
                onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-white bg-transparent border-b border-transparent hover:border-white/50 focus:border-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">
                <span className="text-white/60 text-sm">{calculateFeatureHours(feature)}h</span>
                <span className="mx-2">•</span>
                <span className="font-bold">€{fmt(calculateFeatureCost(feature) * (1 + margin/100))}</span>
              </span>
              {features.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFeature(feature.id); }}
                  className="text-white/60 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Feature Content */}
          {expandedFeature === feature.id && (
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <label className={`block text-xs mb-1 ${labelText}`}>Description</label>
                <input
                  type="text"
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${inputBg}`}
                  placeholder="Brief description of this feature..."
                />
              </div>

              {/* Deliverables */}
              <div>
                <label className={`block text-xs mb-2 ${labelText}`}>Deliverables / Acceptance Criteria</label>
                <div className="space-y-2">
                  {feature.deliverables.map((deliverable, dIndex) => (
                    <div key={dIndex} className="flex items-center gap-2">
                      <span className={`text-emerald-500 font-bold`}>✓</span>
                      <input
                        type="text"
                        value={deliverable}
                        onChange={(e) => updateDeliverable(feature.id, dIndex, e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm ${inputBg}`}
                        placeholder="What will be delivered..."
                      />
                      <button
                        onClick={() => deleteDeliverable(feature.id, dIndex)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addDeliverable(feature.id)}
                    className={`text-sm flex items-center gap-1 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                  >
                    <Plus className="w-4 h-4" />
                    Add deliverable
                  </button>
                </div>
              </div>

              {/* Team Allocation */}
              <div>
                <label className={`block text-xs mb-2 ${labelText}`}>Team & Hours</label>
                <div className="space-y-2">
                  <div className={`grid grid-cols-12 gap-2 text-xs font-medium px-2 ${labelText}`}>
                    <div className="col-span-5">Resource</div>
                    <div className="col-span-2 text-right">Rate/hr</div>
                    <div className="col-span-2 text-right">Hours</div>
                    <div className="col-span-3 text-right">Cost</div>
                  </div>
                  
                  {feature.team.map((member) => (
                    <div key={member.id} className={`grid grid-cols-12 gap-2 items-center rounded-lg p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(feature.id, member.id, 'name', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded ${inputBg}`}
                          placeholder="Role..."
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center justify-end gap-1">
                          <span className={`text-xs ${labelText}`}>€</span>
                          <input
                            type="number"
                            value={member.rate}
                            onChange={(e) => updateTeamMember(feature.id, member.id, 'rate', e.target.value)}
                            className={`w-14 px-2 py-1 text-sm border rounded text-right ${inputBg}`}
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={member.hours}
                          onChange={(e) => updateTeamMember(feature.id, member.id, 'hours', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded text-right ${inputBg}`}
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <span className={`text-sm font-medium ${cardText}`}>€{fmt(member.hours * member.rate)}</span>
                        {feature.team.length > 1 && (
                          <button
                            onClick={() => deleteTeamMember(feature.id, member.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addTeamMember(feature.id)}
                    className={`text-sm flex items-center gap-1 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                  >
                    <Plus className="w-4 h-4" />
                    Add team member
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Feature Button */}
      <button
        onClick={addFeature}
        className={`w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 ${
          darkMode 
            ? 'border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400' 
            : 'border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-600'
        }`}
      >
        <Plus className="w-5 h-5" />
        Add Feature
      </button>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-75 mb-4">Proposal Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Features</div>
            <div className="text-2xl font-bold">{features.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Total Hours</div>
            <div className="text-2xl font-bold">{fmt(totalHours)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Est. Timeline</div>
            <div className="text-2xl font-bold">{Math.ceil(totalHours / 40)}w</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Margin</div>
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                className="w-12 px-1 py-0.5 text-lg font-bold text-center bg-white/20 border border-white/30 rounded text-white"
              />
              <span className="text-lg font-bold">%</span>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xs opacity-75">Total Price</div>
            <div className="text-2xl font-bold">€{fmt(totalPrice)}</div>
          </div>
        </div>

        {/* Per-feature breakdown */}
        <div className="space-y-2 mb-4">
          {features.map((f, i) => (
            <div key={f.id} className="flex justify-between items-center text-sm bg-white/10 rounded-lg px-3 py-2">
              <span className="opacity-75">#{i + 1} {f.name}</span>
              <span className="font-semibold">€{fmt(calculateFeatureCost(f) * (1 + margin/100))}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className={`rounded-xl p-4 shadow-sm border ${cardBg}`}>
        <label className={`block text-xs mb-2 ${labelText}`}>Additional Notes (included in export)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${inputBg}`}
          placeholder="Payment terms, timeline notes, exclusions..."
        />
      </div>

      {/* Actions */}
      <div className={`rounded-xl p-4 shadow-sm border ${cardBg}`}>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`text-sm ${labelText}`}>
              {clientName && <span className={cardText}><strong>{clientName}</strong> • </span>}
              {features.length} feature{features.length !== 1 ? 's' : ''} • {fmt(totalHours)} hours • Valid until {new Date(validUntil).toLocaleDateString()}
            </div>
            {syncStatus === 'syncing' && (
              <span className="flex items-center gap-1 text-xs text-blue-500">
                <Cloud className="w-4 h-4 animate-pulse" />
                Syncing...
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Cloud className="w-4 h-4" />
                Synced
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <CloudOff className="w-4 h-4" />
                Offline
              </span>
            )}
          </div>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:opacity-90"
          >
            <FileText className="w-4 h-4" />
            Preview Proposal
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function CalculatorApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [darkMode, setDarkMode] = useState(false);
  
  // Check for existing session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const tabs = [
    { id: 'transactions', name: 'Transaction Cost', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'features', name: 'Team/Time', icon: <Users className="w-4 h-4" /> },
    { id: 'storypoints', name: 'Sprint Cost', icon: <Code className="w-4 h-4" /> },
    { id: 'commercial', name: 'Quick Quote', icon: <Calculator className="w-4 h-4" /> },
    { id: 'proposal', name: 'Client Proposal', icon: <Clock className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage onSuccess={setSession} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className={`rounded-xl p-6 shadow-sm border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unit Economics Calculator</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction costs & feature development</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {session.user.email}
              </span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Lock className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`rounded-xl shadow-sm border overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'text-indigo-400 bg-gray-700/50 border-b-2 border-indigo-400'
                      : 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'transactions' && <TransactionCostCalculator darkMode={darkMode} supabase={supabase} userEmail={session?.user?.email} />}
        {activeTab === 'features' && <FeatureCostCalculator darkMode={darkMode} />}
        {activeTab === 'storypoints' && <StoryPointsCalculator darkMode={darkMode} />}
        {activeTab === 'commercial' && <CommercialOfferCalculator darkMode={darkMode} />}
        {activeTab === 'proposal' && <ClientProposalCalculator darkMode={darkMode} />}
      </div>
    </div>
  );
}
