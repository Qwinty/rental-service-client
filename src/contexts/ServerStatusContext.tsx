import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useServerStatus } from "../hooks/useServerStatus";
import type { ServerStatus } from "../hooks/useServerStatus";

interface ServerStatusContextType extends ServerStatus {
  wakeUpServer: () => Promise<boolean>;
  pingServer: () => Promise<boolean>;
}

const ServerStatusContext = createContext<ServerStatusContextType | null>(null);

interface ServerStatusProviderProps {
  children: ReactNode;
}

export const ServerStatusProvider: React.FC<ServerStatusProviderProps> = ({
  children,
}) => {
  const serverStatus = useServerStatus();

  return (
    <ServerStatusContext.Provider value={serverStatus}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatusContext = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error(
      "useServerStatusContext must be used within a ServerStatusProvider"
    );
  }
  return context;
};
