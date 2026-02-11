import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Calculator, CreditCard, Smartphone, Users, Clock, Code, Save, History, Download, Lock, Eye, EyeOff, Sun, Moon, Upload, FileText, Cloud, CloudOff, TrendingUp, ArrowRight, Copy, FolderOpen, Target, ChevronDown, ChevronUp, Filter, CheckCircle, ExternalLink } from 'lucide-react';
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


// Password-protected tab wrapper for under-construction tabs
function ProtectedTab({ children, darkMode, tabName }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const correctPassword = 'xK9#mPq$2vL8@nZr';

  const handleUnlock = () => {
    if (password === correctPassword) {
      setUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleUnlock();
  };

  if (unlocked) return children;

  return (
    <div className={`rounded-xl p-8 shadow-sm border text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
        <Lock className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
      </div>
      <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tabName}</h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        🚧 Under construction — Enter password to access
      </p>
      <div className="max-w-xs mx-auto space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Password"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'
          }`}
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleUnlock}
          className="w-full py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Unlock
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
function TransactionCostCalculator() {
  const [eurToUsd, setEurToUsd] = useState('1.08');
  const [activeTab, setActiveTab] = useState('costs'); // 'costs' or 'clients'
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const saveTimeoutRef = useRef(null);
  const isInitialLoad = useRef(true);
  
  // BASELINE
  const [baselineYear, setBaselineYear] = useState('2025');
  const [show2025Section, setShow2025Section] = useState(true); // Expanded by default
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
    { id: 1, name: 'Client A', startDate: '2026-01-01', analyticsUrl: '', providerAnalyticsUrl: '' },
    { id: 2, name: 'Client B', startDate: '2026-02-16', analyticsUrl: '', providerAnalyticsUrl: '' },
  ]);
  
  // Client monthly data - stores month-specific values
  // Key format: `${clientId}-${monthIndex}` e.g., "1-0" for Client 1, January
  const [clientMonthlyData, setClientMonthlyData] = useState({
    '1-0': { monthlyOperations: '4000000', monthlyTransactions: '3800000', approvalRate: '79', price: '0.01', pricingModel: 'perTransaction', fixedFeePerTxn: '0', oneTimeFee: '0', monthlyFee: '0', customDevRevenue: '0', customDevCost: '0' },
    '2-1': { monthlyOperations: '1000000', monthlyTransactions: '950000', approvalRate: '82', price: '0.015', pricingModel: 'perTransaction', fixedFeePerTxn: '0', oneTimeFee: '0', monthlyFee: '0', customDevRevenue: '0', customDevCost: '0' },
  });
  
  // Default values for new months
  const defaultClientMonth = { monthlyOperations: '0', monthlyTransactions: '0', approvalRate: '79', price: '0.01', pricingModel: 'perTransaction', fixedFeePerTxn: '0', oneTimeFee: '0', monthlyFee: '0', customDevRevenue: '0', customDevCost: '0' };
  
  // Get client data for a specific month
  const getClientMonth = (clientId, monthIndex) => {
    const key = `${clientId}-${monthIndex}`;
    return clientMonthlyData[key] || null;
  };
  
  // Set client data for a specific month
  const setClientMonth = (clientId, monthIndex, field, value) => {
    const key = `${clientId}-${monthIndex}`;
    setClientMonthlyData(prev => ({
      ...prev,
      [key]: { ...(prev[key] || defaultClientMonth), [field]: value }
    }));
  };
  
  // Initialize a month with default or copied data
  const initClientMonth = (clientId, monthIndex, copyFrom = null) => {
    const key = `${clientId}-${monthIndex}`;
    let data = { ...defaultClientMonth };
    
    if (copyFrom !== null) {
      const sourceKey = `${clientId}-${copyFrom}`;
      const sourceData = clientMonthlyData[sourceKey];
      if (sourceData) {
        data = { ...sourceData, oneTimeFee: '0' }; // Don't copy one-time fees
      }
    }
    
    setClientMonthlyData(prev => ({ ...prev, [key]: data }));
  };
  
  // Copy data from previous month for all clients
  const copyFromPreviousMonth = (monthIndex) => {
    if (monthIndex === 0) return;
    const prevMonth = monthIndex - 1;
    
    const newData = { ...clientMonthlyData };
    clients.forEach(client => {
      const prevKey = `${client.id}-${prevMonth}`;
      const currKey = `${client.id}-${monthIndex}`;
      if (clientMonthlyData[prevKey] && !clientMonthlyData[currKey]) {
        newData[currKey] = { ...clientMonthlyData[prevKey], oneTimeFee: '0' };
      }
    });
    setClientMonthlyData(newData);
  };
  
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

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data from Supabase...');
        const { data, error } = await supabase
          .from('unit_economics')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Load error:', error);
          isInitialLoad.current = false;
          return;
        }
        
        if (data?.state) {
          console.log('Loaded data:', data.state);
          const state = data.state;
          if (state.eurToUsd !== undefined) setEurToUsd(state.eurToUsd);
          if (state.baselineAnnualOperations !== undefined) setBaselineAnnualOperations(state.baselineAnnualOperations);
          if (state.baselineAnnualTransactions !== undefined) setBaselineAnnualTransactions(state.baselineAnnualTransactions);
          if (state.baselineApprovalRate !== undefined) setBaselineApprovalRate(state.baselineApprovalRate);
          if (state.baselineCosts !== undefined) setBaselineCosts(state.baselineCosts);
          if (state.annualCosts !== undefined) setAnnualCosts(state.annualCosts);
          if (state.monthlyData !== undefined) setMonthlyData(state.monthlyData);
          if (state.clients !== undefined) setClients(state.clients);
          if (state.clientMonthlyData !== undefined) setClientMonthlyData(state.clientMonthlyData);
          if (state.targetMargin !== undefined) setTargetMargin(state.targetMargin);
        } else {
          console.log('No saved data found, using defaults');
        }
        
        // Mark initial load complete after a delay to let state settle
        setTimeout(() => { 
          console.log('Initial load complete, enabling auto-save');
          isInitialLoad.current = false; 
        }, 1000);
      } catch (err) {
        console.error('Load error:', err);
        isInitialLoad.current = false;
      }
    };
    loadData();
  }, []);

  // Auto-save on changes (debounced)
  useEffect(() => {
    // Skip during initial load
    if (isInitialLoad.current) {
      console.log('Skipping save - initial load in progress');
      return;
    }
    
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setSaveStatus('saving');
    console.log('Scheduling save...');
    
    // Debounce save by 1 second
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('Executing save to Supabase...');
        const state = {
          eurToUsd,
          baselineAnnualOperations,
          baselineAnnualTransactions,
          baselineApprovalRate,
          baselineCosts,
          annualCosts,
          monthlyData,
          clients,
          clientMonthlyData,
          targetMargin,
        };
        
        // Use upsert - insert or update if exists
        const { error } = await supabase
          .from('unit_economics')
          .upsert({ id: 1, state, updated_at: new Date().toISOString() }, { onConflict: 'id' });
        
        if (error) {
          console.error('Save error:', error);
          setSaveStatus('error');
        } else {
          console.log('Save successful!');
          setSaveStatus('saved');
        }
      } catch (err) {
        console.error('Save error:', err);
        setSaveStatus('error');
      }
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [eurToUsd, baselineAnnualOperations, baselineAnnualTransactions, baselineApprovalRate, baselineCosts, annualCosts, monthlyData, clients, clientMonthlyData, targetMargin]);

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
      const monthData = getClientMonth(c.id, monthIndex) || defaultClientMonth;
      const clientOps = Math.round(num(monthData.monthlyOperations) * factor);
      const clientTxn = Math.round(num(monthData.monthlyTransactions) * factor);
      const clientSuccessful = Math.round(clientTxn * num(monthData.approvalRate) / 100);
      
      ops += clientOps;
      txn += clientTxn;
      successful += clientSuccessful;
      
      clientDetails.push({
        ...c,
        ...monthData, // Include month-specific data
        factor,
        activeOps: clientOps,
        activeTxn: clientTxn,
        activeSuccessful: clientSuccessful,
        isActive: factor > 0,
        isPartial: factor > 0 && factor < 1,
        hasMonthData: !!getClientMonth(c.id, monthIndex)
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
    // Get proration factor and month-specific data for selected month
    const proratedData = selectedMonthVolume.clientDetails.find(c => c.id === client.id);
    const factor = proratedData?.factor || 0;
    const proratedOps = proratedData?.activeOps || 0;
    const proratedTxn = proratedData?.activeTxn || 0;
    const proratedSuccessful = proratedData?.activeSuccessful || 0;
    
    // Use month-specific data (from proratedData which includes monthData)
    const monthlyOps = num(proratedData?.monthlyOperations || 0);
    const monthlyTxn = num(proratedData?.monthlyTransactions || 0);
    const approval = num(proratedData?.approvalRate || 79);
    const price = num(proratedData?.price || 0);
    const pricingModel = proratedData?.pricingModel || 'perTransaction';
    const fixedFeePerTxn = num(proratedData?.fixedFeePerTxn || 0);
    const oneTimeFee = num(proratedData?.oneTimeFee || 0);
    const monthlyFee = num(proratedData?.monthlyFee || 0);
    const margin = num(targetMargin);
    
    const filterRate = monthlyOps > 0 ? (monthlyTxn / monthlyOps) * 100 : 0;
    const monthlySuccessful = Math.round(monthlyTxn * approval / 100);
    
    const marginalCostPerOperation = effectiveCostPerOp;
    
    // Revenue calculation
    // 1. Variable fee based on pricing model
    let variableRevenue = 0;
    if (pricingModel === 'perOperation') variableRevenue = price * proratedOps;
    else if (pricingModel === 'perTransaction') variableRevenue = price * proratedTxn;
    else if (pricingModel === 'perSuccessful') variableRevenue = price * proratedSuccessful;
    
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
      hasMonthData: proratedData?.hasMonthData || false,
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

  const totalNewVolume = totalClientOperations; // Use the already calculated value from getMonthlyVolume
  const totalRevenue = clientMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalCost = clientMetrics.reduce((sum, m) => sum + m.cost, 0);
  const totalProfit = clientMetrics.reduce((sum, m) => sum + m.profit, 0);
  const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const addClient = () => {
    const newId = Date.now();
    const newName = `Client ${String.fromCharCode(65 + clients.length)}`;
    setClients([...clients, { id: newId, name: newName, startDate: '2026-01-01', analyticsUrl: '', providerAnalyticsUrl: '' }]);
    // Initialize first month with default data
    setClientMonthlyData(prev => ({
      ...prev,
      [`${newId}-${selectedMonth}`]: { ...defaultClientMonth }
    }));
  };
  const updateClient = (id, field, value) => setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  const removeClient = (id) => { 
    if (clients.length > 1) {
      setClients(clients.filter(c => c.id !== id));
      // Also remove all monthly data for this client
      setClientMonthlyData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(key => {
          if (key.startsWith(`${id}-`)) delete newData[key];
        });
        return newData;
      });
    }
  };

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
              {saveStatus === 'saving' && (
                <>
                  <Cloud className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs text-amber-600">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Cloud className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600">All changes saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <CloudOff className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Save failed</span>
                </>
              )}
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
            
            {/* Volume inputs - editable */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs mb-1 text-gray-500">Annual Operations</label>
                <input 
                  type="text" 
                  value={baselineAnnualOperations} 
                  onChange={(e) => setBaselineAnnualOperations(e.target.value)}
                  className="w-full px-2 py-1 border rounded-lg text-sm bg-white border-gray-200"
                />
                <div className="text-xs text-gray-400 mt-0.5">{fmtM(baselineMonthlyOperations)}/mo</div>
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-500">Annual Transactions</label>
                <input 
                  type="text" 
                  value={baselineAnnualTransactions} 
                  onChange={(e) => setBaselineAnnualTransactions(e.target.value)}
                  className="w-full px-2 py-1 border rounded-lg text-sm bg-white border-gray-200"
                />
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
                <input 
                  type="text" 
                  value={baselineApprovalRate} 
                  onChange={(e) => setBaselineApprovalRate(e.target.value)}
                  className="w-full px-2 py-1 border rounded-lg text-sm bg-white border-gray-200"
                />
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

          {/* MONTH SELECTOR FOR CLIENTS */}
          <div className="rounded-xl p-4 shadow-sm border bg-white border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100">
                  <span className="text-emerald-600 text-sm">📅</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">{MONTHS[selectedMonth]} 2026 Client Data</h2>
                  <p className="text-xs text-gray-500">Enter volumes and pricing for each month</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedMonth > 0 && (
                  <button 
                    onClick={() => copyFromPreviousMonth(selectedMonth)}
                    className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs hover:bg-indigo-200"
                  >
                    📋 Copy from {MONTHS[selectedMonth - 1]}
                  </button>
                )}
              </div>
            </div>
            
            {/* Month tabs */}
            <div className="flex gap-1 flex-wrap">
              {MONTHS.map((month, i) => {
                const hasData = clients.some(c => getClientMonth(c.id, i));
                return (
                  <button 
                    key={month} 
                    onClick={() => setSelectedMonth(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors relative ${
                      selectedMonth === i 
                        ? 'bg-emerald-600 text-white' 
                        : hasData 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {month}
                    {hasData && selectedMonth !== i && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />}
                  </button>
                );
              })}
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
              
              return (
                <div key={client.id} className="rounded-lg border mb-3 overflow-hidden border-l-4 border-l-emerald-500 border-gray-200 bg-white">
                  {/* Collapsed Header - Always Visible */}
                  <div 
                    className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleClientExpanded(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        <Users className="w-4 h-4 text-emerald-600" />
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
                          <span className="px-2 py-0.5 bg-slate-400 text-white rounded text-xs font-medium">
                            Not active in {MONTHS[selectedMonth]}
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
                        {/* Start date in header */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-blue-600 font-medium">Start:</span>
                          <input 
                            type="date" 
                            value={client.startDate || '2026-01-01'} 
                            onChange={(e) => updateClient(client.id, 'startDate', e.target.value)}
                            className="px-1 py-0.5 border-0 bg-transparent text-xs text-blue-700 font-medium focus:outline-none"
                          />
                        </div>
                        {clients.length > 1 && (
                          <button onClick={(e) => { e.stopPropagation(); removeClient(client.id); }} className="p-1 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-200">
                      {/* Header row with name edit */}
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Name:</span>
                          <input type="text" value={client.name} onChange={(e) => updateClient(client.id, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="px-2 py-1 border rounded font-medium w-28 text-xs bg-white border-gray-200" />
                        </div>
                        <div className="text-xs text-gray-400">
                          {MONTHS[selectedMonth]} 2026 data
                        </div>
                      </div>
                  
                  {/* Month data status */}
                  {!metrics.hasMonthData && metrics.isActive && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                      <span className="text-xs text-amber-700">⚠️ No data for {MONTHS[selectedMonth]} yet</span>
                      <button 
                        onClick={() => initClientMonth(client.id, selectedMonth, selectedMonth > 0 ? selectedMonth - 1 : null)}
                        className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200"
                      >
                        {selectedMonth > 0 ? `Copy from ${MONTHS[selectedMonth - 1]}` : 'Initialize'}
                      </button>
                    </div>
                  )}
                  
                  {/* Client Volume - Input Row */}
                  <div className="mb-2">
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Monthly Operations</div>
                        <input 
                          type="number" 
                          value={getClientMonth(client.id, selectedMonth)?.monthlyOperations || ''} 
                          onChange={(e) => setClientMonth(client.id, selectedMonth, 'monthlyOperations', e.target.value)} 
                          placeholder="0"
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 border-gray-200" 
                        />
                        <div className="text-xs text-gray-400 mt-1">{fmtM(num(getClientMonth(client.id, selectedMonth)?.monthlyOperations))}/mo</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Monthly Transactions</div>
                        <input 
                          type="number" 
                          value={getClientMonth(client.id, selectedMonth)?.monthlyTransactions || ''} 
                          onChange={(e) => setClientMonth(client.id, selectedMonth, 'monthlyTransactions', e.target.value)} 
                          placeholder="0"
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 border-gray-200" 
                        />
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-blue-500">{fmt(metrics.filterRate || 0, 0)}% of operations</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Provider Approval Rate %</div>
                        <input 
                          type="number" 
                          value={getClientMonth(client.id, selectedMonth)?.approvalRate || ''} 
                          onChange={(e) => setClientMonth(client.id, selectedMonth, 'approvalRate', e.target.value)} 
                          placeholder="79"
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 border-gray-200" 
                        />
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-amber-500">{fmt(100 - num(getClientMonth(client.id, selectedMonth)?.approvalRate || 79), 0)}% declined</span>
                        </div>
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
                          <div className="text-2xl font-bold text-indigo-700">{fmtM(num(getClientMonth(client.id, selectedMonth)?.monthlyOperations))}</div>
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
                          <div className="text-2xl font-bold text-indigo-700">{fmtM(num(getClientMonth(client.id, selectedMonth)?.monthlyTransactions))}</div>
                          <div className="text-xs text-gray-500">sent to provider</div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <ArrowRight className="w-5 h-5 text-gray-300" />
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-xs font-medium">
                            {fmt(num(getClientMonth(client.id, selectedMonth)?.approvalRate || 79), 0)}% approved
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
                    <div className="text-xs font-semibold text-gray-600 mb-2">💰 Pricing for {MONTHS[selectedMonth]}</div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Left column - Variable pricing */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <select 
                            value={getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction'} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'pricingModel', e.target.value)} 
                            className="px-2 py-1 border rounded text-xs bg-white border-gray-200"
                          >
                            <option value="perTransaction">Per Transaction</option>
                            <option value="perSuccessful">Per Successful</option>
                          </select>
                          <span className="text-xs text-gray-400">€</span>
                          <input 
                            type="number" 
                            step="0.0001" 
                            value={getClientMonth(client.id, selectedMonth)?.price || ''} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'price', e.target.value)} 
                            placeholder="0.01"
                            className="w-20 px-2 py-1 border rounded text-xs bg-white border-gray-200" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-28">+ Fixed/success:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            value={getClientMonth(client.id, selectedMonth)?.fixedFeePerTxn || ''} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'fixedFeePerTxn', e.target.value)} 
                            placeholder="0"
                            className="w-20 px-2 py-1 border rounded text-xs bg-white border-gray-200" 
                          />
                        </div>
                      </div>
                      {/* Right column - Fixed fees */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">Monthly fee:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input 
                            type="number" 
                            step="1" 
                            value={getClientMonth(client.id, selectedMonth)?.monthlyFee || ''} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'monthlyFee', e.target.value)} 
                            placeholder="0"
                            className="w-24 px-2 py-1 border rounded text-xs bg-white border-gray-200" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">One-time fee:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input 
                            type="number" 
                            step="1" 
                            value={getClientMonth(client.id, selectedMonth)?.oneTimeFee || ''} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'oneTimeFee', e.target.value)} 
                            placeholder="0"
                            className="w-24 px-2 py-1 border rounded text-xs bg-white border-gray-200" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Marginal Cost Comparison */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2">⚡ Marginal Cost (infra only) - price floor</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded-lg ${(getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction') === 'perTransaction' ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'}`}>
                          <div className="text-xs text-gray-500">Per Transaction</div>
                          <div className="text-sm font-bold text-violet-700">€{fmt(effectiveMarginalPerTxn, 4)}</div>
                          {(getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction') === 'perTransaction' && (
                            <div className={`text-xs mt-1 ${num(getClientMonth(client.id, selectedMonth)?.price) >= effectiveMarginalPerTxn ? 'text-emerald-600' : 'text-red-500'}`}>
                              {num(getClientMonth(client.id, selectedMonth)?.price) >= effectiveMarginalPerTxn ? '✓' : '⚠'} Your price: €{fmt(num(getClientMonth(client.id, selectedMonth)?.price), 4)}
                            </div>
                          )}
                        </div>
                        <div className={`p-2 rounded-lg ${(getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction') === 'perSuccessful' ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'}`}>
                          <div className="text-xs text-gray-500">Per Successful</div>
                          <div className="text-sm font-bold text-violet-700">€{fmt(effectiveMarginalPerSuccess, 4)}</div>
                          {(getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction') === 'perSuccessful' && (
                            <div className={`text-xs mt-1 ${num(getClientMonth(client.id, selectedMonth)?.price) >= effectiveMarginalPerSuccess ? 'text-emerald-600' : 'text-red-500'}`}>
                              {num(getClientMonth(client.id, selectedMonth)?.price) >= effectiveMarginalPerSuccess ? '✓' : '⚠'} Your price: €{fmt(num(getClientMonth(client.id, selectedMonth)?.price), 4)}
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
                            <span className={(getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction') === 'perTransaction' ? 'font-bold text-violet-700' : 'text-gray-600'}>
                              Per Txn: €{fmt(minPricePerTxn, 4)}
                            </span>
                            <span className={(getClientMonth(client.id, selectedMonth)?.pricingModel || 'perTransaction') === 'perSuccessful' ? 'font-bold text-violet-700' : 'text-gray-600'}>
                              Per Success: €{fmt(minPricePerSuccess, 4)}
                            </span>
                          </div>
                        </div>
                      </div>
                        );
                      })()}
                    </div>
                    
                    {/* Custom Development for this month */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2">🛠️ Custom Development ({MONTHS[selectedMonth]})</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Revenue:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input 
                            type="number" 
                            value={getClientMonth(client.id, selectedMonth)?.customDevRevenue || ''} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'customDevRevenue', e.target.value)} 
                            placeholder="0"
                            className="w-24 px-2 py-1 border rounded text-xs bg-white border-gray-200" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Cost:</span>
                          <span className="text-xs text-gray-400">€</span>
                          <input 
                            type="number" 
                            value={getClientMonth(client.id, selectedMonth)?.customDevCost || ''} 
                            onChange={(e) => setClientMonth(client.id, selectedMonth, 'customDevCost', e.target.value)} 
                            placeholder="0"
                            className="w-24 px-2 py-1 border rounded text-xs bg-white border-gray-200" 
                          />
                        </div>
                      </div>
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
              <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                <div className="col-span-2">Client</div>
                <div className="col-span-2 text-right">Txn Revenue</div>
                <div className="col-span-4 text-center">Custom Development</div>
                <div className="col-span-2 text-right">Total</div>
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
                  <div key={client.id} className={`grid grid-cols-12 gap-2 p-3 border-b border-gray-100 hover:bg-gray-50 text-sm items-center ${!detail.isActive ? 'opacity-50' : ''}`}>
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
                    <div className="col-span-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Rev:</span>
                          <span className="text-xs text-purple-600">€</span>
                          <input 
                            type="number" 
                            value={customDev.revenue} 
                            onChange={(e) => setCustomDev(client.id, profitabilityMonth, 'revenue', e.target.value)}
                            className="w-20 px-2 py-1 border rounded text-xs text-right bg-white border-gray-200"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Cost:</span>
                          <span className="text-xs text-gray-500">€</span>
                          <input 
                            type="number" 
                            value={customDev.cost} 
                            onChange={(e) => setCustomDev(client.id, profitabilityMonth, 'cost', e.target.value)}
                            className="w-20 px-2 py-1 border rounded text-xs text-right bg-gray-50 border-gray-200 text-gray-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
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
              <div className="grid grid-cols-12 gap-2 p-3 bg-purple-50 text-sm font-bold">
                <div className="col-span-2 text-gray-700">Total</div>
                <div className="col-span-2 text-right text-emerald-600">€{fmtNum(profitTotalTxnRevenue)}</div>
                <div className="col-span-4 text-center text-purple-600">€{fmtNum(profitTotalCustomRev)} rev / €{fmtNum(profitTotalCustomCost)} cost</div>
                <div className="col-span-2 text-right text-gray-800">€{fmtNum(profitTotalRevenue)}</div>
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
      <div className="max-w-7xl mx-auto">
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
        {activeTab === 'transactions' && <TransactionCostCalculator />}
        {activeTab === 'features' && <ProtectedTab darkMode={darkMode} tabName="Team/Time Calculator"><FeatureCostCalculator darkMode={darkMode} /></ProtectedTab>}
        {activeTab === 'storypoints' && <ProtectedTab darkMode={darkMode} tabName="Sprint Cost Calculator"><StoryPointsCalculator darkMode={darkMode} /></ProtectedTab>}
        {activeTab === 'commercial' && <ProtectedTab darkMode={darkMode} tabName="Quick Quote"><CommercialOfferCalculator darkMode={darkMode} /></ProtectedTab>}
        {activeTab === 'proposal' && <ProtectedTab darkMode={darkMode} tabName="Client Proposal"><ClientProposalCalculator darkMode={darkMode} /></ProtectedTab>}
      </div>
    </div>
  );
}
