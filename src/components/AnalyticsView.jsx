import { useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import { STAGES, METHODS } from '../types';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';
import { startOfWeek, parseISO, differenceInDays } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const { applications } = useJobs();

  const analytics = useMemo(() => {
    // Applications by stage
    const byStage = STAGES.map(stage => ({
      name: stage,
      count: applications.filter(app => app.stage === stage).length
    }));

    // Applications by method
    const byMethod = METHODS.map(method => {
      const methodApps = applications.filter(app => app.method === method);
      const responded = methodApps.filter(app =>
        app.stage !== 'Applied' && app.stage !== 'Rejected'
      ).length;

      return {
        name: method,
        total: methodApps.length,
        responded: responded,
        responseRate: methodApps.length > 0 ? ((responded / methodApps.length) * 100).toFixed(1) : 0
      };
    });

    // Applications over time (weekly)
    const weeklyData = {};
    applications.forEach(app => {
      const weekStart = startOfWeek(parseISO(app.applicationDate)).toISOString().split('T')[0];
      weeklyData[weekStart] = (weeklyData[weekStart] || 0) + 1;
    });

    const timelineData = Object.entries(weeklyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([date, count]) => ({
        week: date,
        applications: count
      }));

    // Average time in each stage
    const stageTime = STAGES.filter(s => s !== 'Applied' && s !== 'Rejected').map(stage => {
      const stageApps = applications.filter(app => app.stage === stage);
      const avgDays = stageApps.length > 0
        ? Math.round(
            stageApps.reduce((sum, app) => {
              return sum + differenceInDays(new Date(), parseISO(app.applicationDate));
            }, 0) / stageApps.length
          )
        : 0;

      return {
        name: stage,
        days: avgDays
      };
    });

    // Conversion funnel
    const totalApps = applications.length;
    const interviewed = applications.filter(app =>
      ['Interview 1', 'Case Study', 'Final Interview', 'Offer'].includes(app.stage)
    ).length;
    const offers = applications.filter(app => app.stage === 'Offer').length;

    const conversionRate = totalApps > 0 ? ((interviewed / totalApps) * 100).toFixed(1) : 0;
    const offerRate = totalApps > 0 ? ((offers / totalApps) * 100).toFixed(1) : 0;

    return {
      byStage,
      byMethod,
      timelineData,
      stageTime,
      totalApps,
      interviewed,
      offers,
      conversionRate,
      offerRate
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={analytics.totalApps}
          icon={Users}
          color="text-primary-600"
        />
        <StatCard
          title="In Interview Process"
          value={analytics.interviewed}
          subtitle={`${analytics.conversionRate}% conversion rate`}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title="Offers Received"
          value={analytics.offers}
          subtitle={`${analytics.offerRate}% of total`}
          icon={Target}
          color="text-purple-600"
        />
        <StatCard
          title="This Week"
          value={analytics.timelineData[analytics.timelineData.length - 1]?.applications || 0}
          subtitle="Applications submitted"
          icon={Clock}
          color="text-orange-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Stage */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.byStage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => count > 0 ? `${name}: ${count}` : ''}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.byStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Response Rate by Method */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Method</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.byMethod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Total" />
              <Bar dataKey="responded" fill="#10b981" name="Responded" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.byMethod.map((method, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">{method.name}</span>
                <span className="font-medium text-gray-900">{method.responseRate}% response rate</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Over Time */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average Time in Stage */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Time in Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.stageTime} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="days" fill="#f59e0b" name="Days" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          <div className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Applications Submitted</span>
              <span className="text-sm font-medium text-gray-900">{analytics.totalApps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-primary-600 h-4 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Reached Interview Stage</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.interviewed} ({analytics.conversionRate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-600 h-4 rounded-full" style={{ width: `${analytics.conversionRate}%` }}></div>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Offers Received</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.offers} ({analytics.offerRate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-purple-600 h-4 rounded-full" style={{ width: `${analytics.offerRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
