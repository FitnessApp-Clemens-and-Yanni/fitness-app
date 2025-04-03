import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  createTRPCReact,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/react-query";
import { type AppRouter } from "../../server/build/root";
import { createQueryClient } from "./query-client";
import { useState } from "react";
import SuperJSON from "superjson";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/", // We don't have a special route for trpc, so it's not "/api/trpc" or anything, it's just "/"
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
}
