import { createContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

type ContextType = {
  SID?: number
  setSID: (SID?: number) => void
  username?: string
  setUsername: (username?: string) => void
  lastInteraction?: Date
  setLastInteraction: (lastInteraction?: Date) => void
  logout: () => void
}

const providerlessContext: ContextType = {setSID: () => {}, setUsername: () => {}, setLastInteraction: () => {}, logout: () => {}};

export const TabletContext = createContext(providerlessContext);

export function TabletContextProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [SID, setSID] = useState<number>();
  const [username, setUsername] = useState<string>();
  const [lastInteraction, setLastInteraction] = useState<Date>();

  function logout() {
    setSID(undefined);
    setUsername(undefined);
    setSID(undefined);
    setLastInteraction(undefined);
    navigate("/tablet/login");
  }

  return (
    <TabletContext value={{
      SID: SID,
      setSID: setSID,
      username: username,
      setUsername: setUsername,
      lastInteraction: lastInteraction,
      setLastInteraction: setLastInteraction,
      logout: logout
    }}>
      {children}
    </TabletContext>
  )
}