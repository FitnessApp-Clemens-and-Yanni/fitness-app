import { WorkoutsRouter } from "@/routers/workouts";
import { createCallerFactory, createTRPCRouter } from "@/trpc";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { SnapshotsRouter } from "./routers/snapshots";
import { db } from "./data/meta";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workouts: WorkoutsRouter,
  snapshots: SnapshotsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext() {
    return {
      db,
      headers: new Headers(),
    };
  },
  onError: (err) => {
    console.error(err.error.message);
  },
});

server.listen(3000, () => console.log("Server is running..."));
