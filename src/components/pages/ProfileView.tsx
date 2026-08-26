import React, { useState } from 'react';
import {
  User,
  Database,
  Check,
  Copy,
  Save,
  Shield,
  Table,
  Key,
  Layers,
  ChevronRight,
  FileCode,
  Lock,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL, SCHEMA_TABLES_META } from '../../lib/supabase';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { currentDay } = useSimulation();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [targetNiche, setTargetNiche] = useState(user?.targetNiche || 'Executive & Tech VA');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Schema Inspector state
  const [selectedTable, setSelectedTable] = useState<string>('students');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSchemaTab, setActiveSchemaTab] = useState<'tables' | 'sql' | 'rls'>('tables');

  const isSupabaseActive = isSupabaseConfigured();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      targetNiche,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const categories = ['all', 'Curriculum Taxonomy', 'Simulation & Persona', 'Communications', 'Execution & Grading', 'Analytics & Remediation'];

  const filteredTables = SCHEMA_TABLES_META.filter((t) => {
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesSearch =
      t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeTableMeta = SCHEMA_TABLES_META.find((t) => t.tableName === selectedTable) || SCHEMA_TABLES_META[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{user?.fullName || 'Student Trainee'}</h2>
                <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Student Account
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                  {user?.targetNiche || 'Executive & Tech VA'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Simulation Day {currentDay} of 90
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                isSupabaseActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isSupabaseActive ? '✓ Supabase Connected' : 'Local Sandbox Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Account Profile Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Student Profile Settings</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Specialized VA Career Track</label>
              <select
                value={targetNiche}
                onChange={(e) => setTargetNiche(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
              >
                <option value="Executive & Tech VA">Executive & Tech VA (Startup Founders, C-Suite)</option>
                <option value="E-Commerce & Operations VA">E-Commerce & Operations VA (Shopify, Logistics)</option>
                <option value="Project Coordination & Ops VA">Project Coordination & Ops VA (Notion, Jira)</option>
                <option value="General Administrative VA">General Administrative Virtual Assistant</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile updated successfully!</span>
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & RLS Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Database Security & RLS</span>
          </h3>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-medium">
              <span className="text-slate-600">Total Core Tables:</span>
              <span className="font-bold text-slate-900">16 Relational Tables</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-slate-600">Row Level Security:</span>
              <span className="text-emerald-600 font-bold">100% Enabled</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-slate-600">Student Isolation:</span>
              <span className="text-indigo-600 font-bold">Strict auth.uid()</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-slate-600">API Key Privacy:</span>
              <span className="text-slate-900 font-bold">Never Exposed</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed space-y-1">
            <p>
              • <strong>Isolation Guarantee:</strong> Students can only view & mutate their own profile, simulation runs, tasks, deliverables, evaluations, and skill scores.
            </p>
            <p>
              • <strong>Curriculum Taxonomies:</strong> Services, skills, and competency levels are globally readable by authenticated students.
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Database Architecture & 16-Table Schema Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Supabase Database Architecture</h3>
              <p className="text-xs text-slate-500">
                16 Relational Tables with Foreign Keys, Performance Indexes, and Row Level Security
              </p>
            </div>
          </div>

          {/* Action Tabs & Copy Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveSchemaTab('tables')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeSchemaTab === 'tables' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Table Explorer (16)
              </button>
              <button
                onClick={() => setActiveSchemaTab('sql')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeSchemaTab === 'sql' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SQL Script
              </button>
              <button
                onClick={() => setActiveSchemaTab('rls')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeSchemaTab === 'rls' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Security & Policies
              </button>
            </div>

            <button
              onClick={handleCopySql}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied SQL</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Migration</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Table Explorer */}
        {activeSchemaTab === 'tables' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[500px]">
            {/* Left Sidebar: Table List */}
            <div className="lg:col-span-4 p-4 space-y-3 bg-slate-50/50">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tables or fields..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px]">
                  <Filter className="w-3 h-3 text-slate-400 shrink-0" />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition-colors ${
                        categoryFilter === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'All (16)' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
                {filteredTables.map((t) => {
                  const isSelected = t.tableName === selectedTable;
                  return (
                    <button
                      key={t.tableName}
                      onClick={() => setSelectedTable(t.tableName)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500/20'
                          : 'bg-white/60 hover:bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <Table className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className={`font-mono font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {t.tableName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                          {t.category} • {t.fields.length} columns
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Selected Table Schema Details */}
            <div className="lg:col-span-8 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-base font-bold text-slate-900">
                      public.{activeTableMeta.tableName}
                    </span>
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                      {activeTableMeta.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{activeTableMeta.description}</p>
                </div>

                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  RLS Active
                </span>
              </div>

              {/* RLS Policy Summary for this Table */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-800 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Row Level Security Enforcement:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {activeTableMeta.rlsSummary}
                </p>
              </div>

              {/* Fields Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Columns & Data Types ({activeTableMeta.fields.length})</span>
                </h4>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Column Name</th>
                        <th className="py-2 px-3">Data Type</th>
                        <th className="py-2 px-3">Constraint / FK</th>
                        <th className="py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {activeTableMeta.fields.map((field) => (
                        <tr key={field.name} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center space-x-1.5">
                            {field.isPrimary && (
                              <span title="Primary Key" className="p-0.5 bg-amber-100 text-amber-800 rounded">
                                <Key className="w-2.5 h-2.5" />
                              </span>
                            )}
                            <span>{field.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-indigo-600 font-medium">
                            {field.type}
                          </td>
                          <td className="py-2.5 px-3">
                            {field.isForeign ? (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                → {field.foreignTable}
                              </span>
                            ) : field.defaultValue ? (
                              <span className="text-[10px] text-slate-500">
                                def: {field.defaultValue}
                              </span>
                            ) : field.nullable === false ? (
                              <span className="text-[10px] text-rose-600 font-sans font-medium">
                                NOT NULL
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-600 text-[11px]">
                            {field.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full SQL Migration Script */}
        {activeSchemaTab === 'sql' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>Ready-to-run PostgreSQL DDL migration with extensions, tables, indexes, triggers & RLS.</span>
              </div>
              <button
                onClick={handleCopySql}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 flex items-center space-x-1"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-[11px] max-h-[480px] overflow-y-auto leading-relaxed border border-slate-800">
              <pre>{SUPABASE_SCHEMA_SQL}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Security & RLS Matrix */}
        {activeSchemaTab === 'rls' && (
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Row Level Security (RLS) Policy Matrix</h4>
              <p className="text-xs text-slate-500">
                Enforcing strict multi-tenant student boundary isolation across all 16 database tables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Student Isolated Records (Owner Only)</span>
                </h5>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>students:</strong> Select & Update restricted to <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">auth.uid() = id</code></li>
                  <li><strong>simulations:</strong> Access restricted to <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">student_id = auth.uid()</code></li>
                  <li><strong>conversations & messages:</strong> Student thread access only</li>
                  <li><strong>submissions:</strong> Restricted to <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">student_id = auth.uid()</code></li>
                  <li><strong>evaluations:</strong> Visible only to student owner via submission join</li>
                  <li><strong>skill_scores & remediation_tasks:</strong> Student specific access</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Simulation-Linked Resources</span>
                </h5>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>clients:</strong> Checked via parent simulation ownership</li>
                  <li><strong>client_memory:</strong> Verified via client and simulation join</li>
                  <li><strong>tasks:</strong> Scoped exclusively to active student simulation</li>
                  <li><strong>progress:</strong> Daily stage records tied to student simulation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
