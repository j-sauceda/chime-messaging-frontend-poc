// Third-party libraries
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Custom components
import ChannelsMenu from "./components/ChannelsMenu.tsx";
import InstancesMenu from "./components/InstancesMenu.tsx";
import MessagesBoard from "./components/MessagesBoard.tsx";
import UserMenu from "./components/UserMenu.tsx";

// App state and data fetching
import { useStore } from "./store";
const queryClient = new QueryClient();
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Styling
import "@picocss/pico/css/pico.min.css";

function App() {
  const { appInstanceARN, channelARN, userARN } = useStore();
  const is_offline = import.meta.env.VITE_IS_OFFLINE;

  return (
    <main className="container">
      <QueryClientProvider client={queryClient}>
        {appInstanceARN === "" && <InstancesMenu />}
        {appInstanceARN && userARN === "" && <UserMenu />}
        {appInstanceARN && userARN && channelARN === "" && <ChannelsMenu />}
        {appInstanceARN && userARN && channelARN && <MessagesBoard />}
        {is_offline && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </main>
  );
}

export default App;
