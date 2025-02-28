import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user's identity token
    const identity = await ctx.auth.getUserIdentity();
    
    // If user is not authenticated, throw an error
    if (!identity) {
      throw new Error("You must be logged in to create a task");
    }

    // Insert the new task
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      completed: false, // Default to uncompleted
      userId: identity.subject, // This is the unique identifier for the user
      createdAt: Date.now(), // Add timestamp for potential sorting
    });

    return taskId;
  },
});

export const getTasks = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("You must be logged in to get tasks");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    return tasks;
  },
});
