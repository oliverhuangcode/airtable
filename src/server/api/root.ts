import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { baseRouter } from "~/server/api/routers/base";
import { tableRouter } from "~/server/api/routers/table";
import { fieldRouter } from "~/server/api/routers/field";
import { recordRouter } from "~/server/api/routers/record";
import { viewRouter } from "~/server/api/routers/view";

export const appRouter = createTRPCRouter({
  base: baseRouter,
  table: tableRouter,
  field: fieldRouter,
  record: recordRouter,
  view: viewRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
