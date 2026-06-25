import React from "react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "sweep-rules", label: "Sweep Rules", icon: "account_tree" },
    { id: "hedge-rules", label: "Hedging Rules", icon: "show_chart" },
    { id: "activity-logs", label: "Activity Logs", icon: "history" },
  ];

  return (
    <nav className="w-[260px] h-screen fixed left-0 top-0 border-r border-outline-variant flex flex-col py-lg px-md bg-surface-container-low z-20">
      <div className="mb-xl px-sm">
        <h1 className="font-display-lg text-display-lg font-bold text-on-surface">
          Apex Treasury
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Corporate HQ
        </p>
      </div>
      <ul className="flex-1 space-y-xs">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-sm px-sm py-xs rounded-DEFAULT transition-all duration-200 ease-in-out text-left ${
                  isActive
                    ? "text-primary font-bold border-l-2 border-primary bg-primary/10"
                    : "text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-lg border-t border-outline-variant">
        <div className="flex items-center gap-sm px-sm">
          <img
            alt="Sarah Jenkins"
            className="w-8 h-8 rounded-full bg-surface-container-highest object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM6E2msvOsZGxnIshHLe6uVPVv8rzPy9-9XtdVRLhQ3-xGgCOgsU59oXNl00zul73Rt1zpbyYRmktEf9mGB4o1WqQ5PFooDm_vmN8sy9BApxJXTz0ipzykw8jqSomO-nq2r1FMeSj0ql5wJpVHMRCUHTXr7epqcbzjGmuZSQ_XrZr2k8LYbDy9-hzvzgiNGx2MFsxXxDf6JNAvmcXaQ4wR5JtSINeaaxJ3F-9PO7n_9MRvijbImbVnStWtGkelnYrkiEiMAWDuQHuX"
          />
          <div>
            <p className="font-body-md text-body-md font-medium text-on-surface">
              Sarah Jenkins
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Treasury Manager
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
