import { mutation } from "./_generated/server";

export const removePositionField = mutation({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    for (const task of tasks) {
      if ('position' in task) {
        await ctx.db.patch(task._id, {
          position: undefined
        });
      }
    }
  },
}); 