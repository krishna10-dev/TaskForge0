import React from 'react';
import './HelpCenter.css';

const CategoryCard = ({ icon, title, desc, colorClass }) => (
  <div className="help-category-card group">
    <div className={`category-icon-box ${colorClass}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h3 className="category-title">{title}</h3>
    <p className="category-desc">{desc}</p>
    <span className="category-link">
      Browse Guides <span className="material-symbols-outlined">arrow_forward</span>
    </span>
  </div>
);

const ArticleLink = ({ title }) => (
  <a href="#" className="help-article-link group">
    <div className="article-info">
      <span className="material-symbols-outlined">article</span>
      <span className="article-title">{title}</span>
    </div>
    <span className="material-symbols-outlined arrow-icon">chevron_right</span>
  </a>
);

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    { icon: "rocket_launch", title: "Getting Started", desc: "New to Orchestrator? Learn the basics of task management and workspace setup.", colorClass: "bg-secondary" },
    { icon: "groups", title: "Workspaces", desc: "Manage team permissions, invite collaborators, and structure your departments.", colorClass: "bg-secondary" },
    { icon: "bolt", title: "Automations", desc: "Create powerful workflows using our drag-and-drop automation engine.", colorClass: "bg-tertiary" },
    { icon: "api", title: "API & Webhooks", desc: "Integrate Orchestrator with your existing tech stack using our robust API.", colorClass: "bg-secondary" },
    { icon: "credit_card", title: "Billing", desc: "Manage subscriptions, update payment methods, and view your invoices.", colorClass: "bg-secondary" },
    { icon: "shield", title: "Security", desc: "Set up SSO, 2FA, and review audit logs for enterprise compliance.", colorClass: "bg-secondary" },
  ];

  const articles = [
    "How to set up Focus Mode for deep work",
    "Managing team permissions and role hierarchy",
    "Connecting Orchestrator to Slack for notifications",
    "Bulk editing tasks and workflow state changes",
    "Advanced filtering with JQL-style queries",
  ];

  const filteredCategories = categories.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter(a => 
    a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-center-container">
      {/* Hero Section */}
      <section className="help-hero">
        <div className="help-hero-content">
          <h1 className="help-hero-title">How can we help you today?</h1>
          <div className="help-search-wrapper">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              className="help-search-input" 
              placeholder="Search for guides, API docs, or troubleshooting..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="help-popular-tags">
              <span className="tag-label">Popular:</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setSearchQuery('API'); }}>API Webhooks</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSearchQuery('Focus'); }}>Focus Mode</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSearchQuery('SSO'); }}>SSO Config</a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="help-categories-grid">
        {filteredCategories.map((cat, idx) => (
          <CategoryCard 
            key={idx}
            icon={cat.icon} 
            title={cat.title} 
            desc={cat.desc}
            colorClass={cat.colorClass}
          />
        ))}
        {filteredCategories.length === 0 && <p className="no-results">No categories found matching "{searchQuery}"</p>}
      </section>

      {/* Popular Articles */}
      <section className="help-articles-section">
        <div className="articles-container">
          <div className="articles-header">
            <div>
              <span className="kb-label">Knowledge Base</span>
              <h2 className="section-title">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Articles'}
              </h2>
            </div>
            {!searchQuery && <a href="#" className="view-all-link">View all articles</a>}
          </div>
          <div className="articles-list">
            {filteredArticles.map((art, idx) => (
              <ArticleLink key={idx} title={art} />
            ))}
            {filteredArticles.length === 0 && <p>No articles found.</p>}
          </div>
        </div>
      </section>

      {/* Community & Support CTA */}
      <section className="help-cta-grid">
        <div className="help-cta-card community-card group">
          <div className="cta-icon-bg">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <div className="cta-content">
            <h3 className="cta-title">Join the Community</h3>
            <p className="cta-desc">Connect with other power users, share workflows, and get tips from the Orchestrator team.</p>
            <button className="cta-btn secondary">Browse Forums</button>
          </div>
        </div>
        <div className="help-cta-card support-card group">
          <div className="cta-icon-bg">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div className="cta-content">
            <h3 className="cta-title">Still need help?</h3>
            <p className="cta-desc">Our technical support team is available 24/7 for Enterprise and Pro customers.</p>
            <button className="cta-btn primary">Submit a Ticket</button>
          </div>
        </div>
      </section>

      {/* Footer info (Mini) */}
      <footer className="help-mini-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-name">Precision Orchestrator</span>
            <p className="copyright">© 2024 Precision Orchestrator. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Status Page</a>
            <a href="#" className="underline">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;
