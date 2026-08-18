import { db } from "#config/client.js";
import { audit_log } from "#drizzle/schema.js";
export const createAuditLog = async ({performedBy,action,affectedUser,}) => {
  try {
    await db.insert(audit_log).values({
      performedBy,
      action,
      affectedUser,
    });

    return {
      success: true,
      message: "Audit log created successfully",
    };
  } catch (error) {
    console.error("Audit log error:", error);

    return {
      success: false,
      message: "Failed to create audit log",
    };
  }
};