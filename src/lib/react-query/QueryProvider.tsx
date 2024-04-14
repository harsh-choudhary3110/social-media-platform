import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
