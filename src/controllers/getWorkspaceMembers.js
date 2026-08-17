import { db } from "#config/client.js";
import { workspace, workspaceMembers } from "#drizzle/schema.js";
import { eq , and } from "drizzle-orm";

export async function getWorkspaceMembers(req, res) {
  const userId = req.user.id;
  const workspaceId = req.params.workspaceId;
   const targetMemberId = req.params.memberId;/* get specific user */
  try {
    /* check user role first  */
    const userRoleOnWorkspace = await db
      .select({
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId),
        ),
      );
    if (userRoleOnWorkspace.length === 0) {
      return res
        .status(403)
        .json({
          message: "Access denied. You are not a member of this workspace.",
        });
    }
    /* pass query on base of role  */
    /*  if admin  or owner then get all workspace members data */
    const userRole = userRoleOnWorkspace[0].role;
    /* pass query  */
    let queryCondition;
    /* get all members data */
    if (userRole === "owner" || userRole === "admin") {
      /* if targetMember id then only send target member if not then share all members data*/
      if (targetMemberId) {
        // grt specific member
        queryCondition = and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.id, targetMemberId)
        );
      } else {
        //  get all members data
        queryCondition = eq(workspaceMembers.workspaceId, workspaceId);
      }
    } 
    else if (userRole === "editor" || userRole === "viewer") {
    /* viewer and editor get only yours data */
      queryCondition = and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
      );
    }
    /* invalid role  */
    else {
      return res.status(403).json({ message: "Invalid role permission" });
    }
    const getWorkspaceMember = await db
      .select({
        memberId: workspaceMembers.id,
        username: workspaceMembers.memberName,
        user_id: workspaceMembers.userId,
        role: workspaceMembers.role,
        createAt: workspaceMembers.createdAt,
      })
      .from(workspaceMembers)
      .where(queryCondition);

    return res.status(200).json({
      message: "Workspaces fetched successfully",
      count: getWorkspaceMember.length,
      member: getWorkspaceMember,
    });
  } catch (error) {
    console.log("Get Workspaces Member Error:", error);

    return res.status(500).json({
      message: "Failed to fetch workspace member",
      error: error.message,
    });
  }
}
