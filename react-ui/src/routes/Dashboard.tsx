import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li>
                <a href="#overview">Overview</a>
              </li>
              <li>
                <a href="#reports">Reports</a>
              </li>
              <li>
                <a href="#settings">Settings</a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-content">
          <section id="overview">
            <h2>Overview</h2>
            <p>Welcome to the dashboard overview.</p>
          </section>
          <section id="reports">
            <h2>Reports</h2>
            <p>Here you can find various reports.</p>
          </section>
          <section id="settings">
            <h2>Settings</h2>
            <p>Adjust your preferences here.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
