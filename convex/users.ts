import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if we've already stored this user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (existingUser) {
      // If we've seen this user before but their name or email has changed,
      // update them.
      if (
        existingUser.name !== args.name ||
        existingUser.email !== args.email
      ) {
        await ctx.db.patch(existingUser._id, {
          name: args.name,
          email: args.email,
        });
      }
      return existingUser._id;
    }

    // If this is a new user, create them
    return await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
    });
  },
});