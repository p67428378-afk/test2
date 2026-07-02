import React from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeAlertCount = 0,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    {
      id: "alerts",
      label: "Security Alerts",
      icon: "security_update_warning",
      badge: activeAlertCount > 0 ? `${activeAlertCount} Active` : null,
    },
    { id: "cards", label: "Cards", icon: "credit_card" },
    { id: "transactions", label: "Transactions", icon: "receipt_long" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="hidden md:flex flex-col h-full py-6 px-4 bg-[#0F172A] border-r border-outline-variant fixed left-0 top-0 w-[260px] z-50">
      {/* Header */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance
          </span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            Apex Premier
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Private Banking
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out w-full text-left group ${
                isActive
                  ? "bg-[#6366F1]/10 text-primary font-bold border-l-4 border-[#6366F1]"
                  : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-3 flex-grow">
                <span className="material-symbols-outlined group-hover:text-on-surface transition-colors">
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md group-hover:text-on-surface transition-colors">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-error text-on-error font-label-md text-label-md px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile */}
      <div className="mt-auto pt-6 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
            <img
              alt="Alexander Vance"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0UGQxXz0OZRVrS3RGImXBwVWZfkePoHLbPNfY4aYY6n0J8Bgyg8aZnXHU6Wnx7OIsI7WmWUe4RvBxVh7rb9vaezqQQKtPDdzR2fCQ-VGYjG1MNinRcG4SPIZljeLLhKG2GPmmsKc2_2hnT-8H3JaQQyPm55Ga8-bHrvrGK-2sKNb2ERPN72z6nFibLkc7H-T601aslWaWO1ON64KTsIgR9ekUPlbIotKZhgdshp-bhVWzA0atj7fab1_Uvh-kIvrctwpldp6KOg"
            />
          </div>
          <div>
            <p className="font-body-md text-body-md font-bold text-on-surface">
              Alexander Vance
            </p>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                diamond
              </span>{" "}
              Premier Member
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("support")}
          className={`flex items-center gap-3 px-4 py-3 mt-4 rounded-lg transition-all duration-200 ease-in-out w-full text-left group ${
            activeTab === "support"
              ? "bg-[#6366F1]/10 text-primary font-bold border-l-4 border-[#6366F1]"
              : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined group-hover:text-on-surface transition-colors">
            help_center
          </span>
          <span className="font-body-md text-body-md group-hover:text-on-surface transition-colors">
            Support
          </span>
        </button>
      </div>
    </nav>
  );
}
