export default function AppLayout({
  sidebar,
  header,
  children,
  toasts
}) {
  return (
    <div className="flowtask-app-layout">
      {sidebar}
      <main className="app-main-workspace">
        {header}
        <div className="workspace-scroll-container">
          {children}
        </div>
      </main>
      {toasts}
    </div>
  );
}
