import { db } from "#config/client.js";
import { auditLog } from "#drizzle/schema.js";
export const createAuditLog = async ({ performedBy, action, affectedUser,}) => {
  try {
    const result = await db
      .insert(auditLog)
      .values({
        performedBy,
        action,
        affectedUser,
      })
      .returning();

    console.log("Audit log inserted:", result);

    return result;

  } catch (error) {
    console.error("Audit log error:", error);
    throw error;
  }
};