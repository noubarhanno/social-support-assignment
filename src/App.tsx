import type { FC } from "react";
import AppRouter from "./app/AppRouter";

/**
 * Main App component that serves as the root of the application.
 * Sets up routing and global providers.
 */
const App: FC = () => {
  return <AppRouter />;
};

export default App;
