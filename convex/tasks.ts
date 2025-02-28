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

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("You must be logged in to delete tasks");
    }

    // Get the task to verify ownership
    const task = await ctx.db.get(args.id);
    
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify the user owns this task
    if (task.userId !== identity.subject) {
      throw new Error("Unauthorized to delete this task");
    }

    // Delete the task
    await ctx.db.delete(args.id);
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("You must be logged in to update tasks");
    }

    // Get the task to verify ownership
    const task = await ctx.db.get(args.id);
    
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify the user owns this task
    if (task.userId !== identity.subject) {
      throw new Error("Unauthorized to update this task");
    }

    // Update the task
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
    });
  },
});

export const toggleTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("You must be logged in to update tasks");
    }

    // Get the task to verify ownership
    const task = await ctx.db.get(args.id);
    
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify the user owns this task
    if (task.userId !== identity.subject) {
      throw new Error("Unauthorized to update this task");
    }

    // Toggle the completed status
    await ctx.db.patch(args.id, {
      completed: !task.completed,
    });
  },
});
