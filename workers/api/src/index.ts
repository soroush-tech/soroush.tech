import { app } from './app'
import { runMonthlyMaintenance } from 'src/jobs/retention'
import type { Env } from './env'

export default {
  fetch: app.fetch,
  scheduled: (_controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    ctx.waitUntil(runMonthlyMaintenance(env))
  },
}
