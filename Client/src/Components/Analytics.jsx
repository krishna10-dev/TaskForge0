import React, { useState, useEffect } from 'react';
import { getTasks } from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

const COLORS = ['#497cff', '#0c9488', '#fbbf24', '#ba1a1a', '#8b5cf6'];

const MetricCard = ({ label, value, trend, trendType, footer }) => (
  <div className="analytics-metric-card">
    <div className="blade-accent"></div>
    <p className="metric-label">{label}</p>
    <div className="metric-value-container">
      <h3 className="metric-value">{value}</h3>
      {trend && (
        <span className={`metric-trend trend-${trendType}`}>
          {trend}
        </span>
      )}
    </div>
    {footer && <p className="metric-footer">{footer}</p>}
  </div>
);

const Analytics = ({ searchQuery = '' }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    return task.title.toLowerCase().includes(searchLower) || 
           (task.description && task.description.toLowerCase().includes(searchLower)) ||
           (task.project && task.project.toLowerCase().includes(searchLower));
  });

  // Calculations
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'Done').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = filteredTasks.filter(t => t.priority === 'High' && t.status !== 'Done').length;

  // Project Distribution for Pie Chart
  const projectCounts = filteredTasks.reduce((acc, task) => {
    acc[task.project] = (acc[task.project] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(projectCounts).map(name => ({
    name: name,
    value: projectCounts[name]
  }));

  // Bar Distribution for manual progress bars
  const distribution = Object.keys(projectCounts).map(name => ({
    label: name,
    value: Math.round((projectCounts[name] / (totalTasks || 1)) * 100)
  })).sort((a, b) => b.value - a.value).slice(0, 4);

  // Velocity Mock Data (augmented with current state)
  const chartData = [
    { name: 'Mon', completed: 2, target: 6 },
    { name: 'Tue', completed: 5, target: 4 },
    { name: 'Wed', completed: 3, target: 4 },
    { name: 'Thu', completed: 6, target: 5 },
    { name: 'Fri', completed: 4, target: 5 },
    { name: 'Sat', completed: completedTasks, target: 6 },
  ];

  if (loading) return <div className="analytics-loading">Synchronizing System Data...</div>;

  return (
    <div className="analytics-container">
      <section className="analytics-header">
        <div>
          <h2 className="analytics-title">System Performance</h2>
          <p className="analytics-subtitle">Real-time task velocity and project resource efficiency.</p>
        </div>
        <div className="analytics-range-selector">
          <button className="range-btn active">Live Sync</button>
          <button className="range-btn" onClick={fetchData}>Refresh</button>
        </div>
      </section>

      <section className="analytics-metrics-grid">
        <MetricCard
          label="Completion Velocity"
          value={`${completionRate}%`}
          trend={completionRate > 50 ? "+5%" : "-2%"}
          trendType={completionRate > 50 ? "positive" : "neutral"}
          footer="Tasks finalized vs total"
        />
        <MetricCard
          label="Active Objectives"
          value={pendingTasks}
          trend={`Total: ${totalTasks}`}
          trendType="neutral"
          footer="Registered in system"
        />
        <MetricCard
          label="Urgent Bottlenecks"
          value={highPriorityTasks}
          trend={highPriorityTasks > 3 ? "Action Required" : "Stable"}
          trendType={highPriorityTasks > 3 ? "neutral" : "positive"}
          footer="Pending High priority"
        />
        <MetricCard
          label="Resource Health"
          value="Optimal"
          trend="A+"
          trendType="positive"
          footer="System load balanced"
        />
      </section>

      <section className="analytics-charts-grid">
        <div className="chart-card velocity-chart">
          <div className="chart-header">
            <h4 className="chart-title">Velocity Analysis</h4>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot target"></span> Target</span>
              <span className="legend-item"><span className="dot actual"></span> Actual</span>
            </div>
          </div>
          <div className="chart-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#497cff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#497cff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#497cff" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                <Area type="monotone" dataKey="target" stroke="#e2e8f0" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card distribution-chart">
          <h4 className="chart-title">Project Ecosystem</h4>
          <div className="chart-body" style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="distribution-list">
            {distribution.map((item, idx) => (
              <div key={idx} className="distribution-item">
                <div className="dist-label-row">
                  <span className="dist-label">{item.label}</span>
                  <span className="dist-value">{item.value}%</span>
                </div>
                <div className="dist-progress-bg">
                  <div className="dist-progress-fill" style={{ width: `${item.value}%`, backgroundColor: COLORS[idx % COLORS.length] }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="analytics-bottom-grid">
        <div className="heatmap-card">
          <div className="chart-header">
            <h4 className="chart-title">Activity Frequency</h4>
            <span className="heatmap-badge">Node Active</span>
          </div>
          <div className="heatmap-grid">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="heatmap-block" style={{ opacity: Math.random() * 0.7 + 0.3 }}></div>
            ))}
          </div>
          <div className="heatmap-labels">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="insights-card">
          <h4 className="chart-title">Smart Insights</h4>
          <div className="insights-list">
            <div className={`insight-item ${highPriorityTasks > 3 ? 'insight-warning' : 'insight-success'}`}>
              <span className="material-symbols-outlined">{highPriorityTasks > 3 ? 'warning' : 'verified'}</span>
              <div>
                <p className="insight-title">{highPriorityTasks > 3 ? 'Efficiency Alert' : 'Flow Status'}</p>
                <p className="insight-desc">
                  {highPriorityTasks > 3 
                    ? `You have ${highPriorityTasks} critical bottlenecks. Suggest offloading to subtasks.`
                    : "No major bottlenecks detected in the current cycle."}
                </p>
              </div>
            </div>
            <div className="insight-item insight-info">
              <span className="material-symbols-outlined">trending_up</span>
              <div>
                <p className="insight-title">Velocity Peak</p>
                <p className="insight-desc">Your highest productivity window was observed during the midweek cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;