import {
  Client,
  Provider,
  cacheExchange,
  createClient,
  fetchExchange,
} from "urql";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type UrqlContextState = { urqlClient: Client; reset: () => void };

const UrqlContext = createContext<UrqlContextState>({
  urqlClient: null as any,
  reset: () => void 0,
});

const createUrqlClient = () =>
  createClient({
    url: "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

export const useUrql = () => useContext(UrqlContext);

export const UrqlProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [urqlClient, setUrqlClient] = useState(createUrqlClient());
  const reset = useCallback(() => setUrqlClient(createUrqlClient()), []);

  return (
    <UrqlContext.Provider value={{ urqlClient, reset }}>
      <Provider value={urqlClient}>{children}</Provider>
    </UrqlContext.Provider>
  );
};
