import React from "react";
import { Shield, User, Clock, FileText } from "lucide-react";

export default function ChainOfCustodyTimeline({ logs = [] }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {logs.length === 0 ? (
          <li className="text-center py-4 text-[#c7c4d7]">
            No chain of custody records found.
          </li>
        ) : (
          logs.map((log, logIdx) => (
            <li key={log.id}>
              <div className="relative pb-8">
                {logIdx !== logs.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[#334155]"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-[#2d3449] flex items-center justify-center ring-8 ring-[#1e293b]">
                      <Shield className="h-4 w-4 text-[#c0c1ff]" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-[#dae2fd]">
                        <span className="font-semibold text-[#c0c1ff]">
                          {log.action}
                        </span>
                        {" by "}
                        <span className="font-medium text-[#dae2fd]">
                          {log.username}
                        </span>
                      </p>
                      {log.details && (
                        <div className="mt-1 text-xs text-[#c7c4d7] bg-[#0F172A] p-2 rounded border border-[#334155] font-mono">
                          {typeof log.details === "object"
                            ? JSON.stringify(log.details, null, 2)
                            : log.details}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs whitespace-nowrap text-[#c7c4d7] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <time dateTime={log.timestamp}>
                        {new Date(log.timestamp).toLocaleString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
