import { WorkoutsRouter } from "@/routers/workouts.js";
import { createCallerFactory, createTRPCRouter } from "@/trpc.js";
import cors from "cors";
import { SnapshotsRouter } from "@/routers/snapshots.js";
import { FoodRouter } from "@/routers/food.js";
import { FatSecretRouter } from "@/routers/fatsecret.js";
import { db } from "./data/meta/index.js";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  fatSecret: FatSecretRouter,
  food: FoodRouter,
  workouts: WorkoutsRouter,
  snapshots: SnapshotsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 */
export const createCaller = createCallerFactory(appRouter);

const PORT = 3000;

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext() {
    return {
      db: db,
      headers: new Headers(),
    };
  },
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
