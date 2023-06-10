import {
  Client,
  Provider,
  cacheExchange,
  createClient,
  fetchExchange,
} from "urql";
import React, { createContext, useCallback, useContext, useState } from "react";

type UrqlContextState = { urqlClient: Client; reset: () => void };

const UrqlContext = createContext<UrqlContextState>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  urqlClient: null as any,
  reset: () => void 0,
});

const createUrqlClient = () =>
  createClient({
    url: "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

// eslint-disable-next-line react-refresh/only-export-components
export const useUrql = () => useContext(UrqlContext);

export const UrqlProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [urqlClient, setUrqlClient] = useState(createUrqlClient());
  const reset = useCallback(() => setUrqlClient(createUrqlClient()), []);

  return (
    <UrqlContext.Provider value={{ urqlClient, reset }}>
      <Provider value={urqlClient}>{children}</Provider>
    </UrqlContext.Provider>
  );
};
