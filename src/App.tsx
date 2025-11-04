import type { FC } from "react";
import AppRouter from "./app/AppRouter";
import { ConfigContextProvider } from "./lib/contexts";

/**
 * Main App component that serves as the root of the application.
 * Sets up routing and global providers.
 */
const App: FC = () => {
  return (
    <ConfigContextProvider>
      <AppRouter />
    </ConfigContextProvider>
  );
};

export default App;
