"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";

export default function ConvexClerkUserSync() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!user) return;

    // Store the user in the Convex database
    storeUser({
      tokenIdentifier: user.id,
      name: user.fullName ?? "Anonymous",
      email: user.primaryEmailAddress?.emailAddress ?? "",
    });
  }, [user, storeUser]);

  return null;
}
