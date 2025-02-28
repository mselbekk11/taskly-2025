import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]), // Index to quickly fetch tasks for a specific user
  
  numbers: defineTable({
    value: v.number(),
  }),
});
