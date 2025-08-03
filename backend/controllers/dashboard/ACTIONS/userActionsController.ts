const User = require("../../../models/user");
const AuditLog = require("../../../models/audits");
const PendingRequest = require("../../../models/pendingRequests");

// ✅ FIX 1: Use consistent import syntax for TypeScript
const { checkDashboardPermission } = require("../../../middlewares/RBAC/rbac");
import type { Role } from "../../../middlewares/RBAC/rbac";

// DELETE /dashboard/user/delete - Delete user
export const deleteUser = async (req: any, res: any) => {
  try {
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // ✅ FIX 2: Add RBAC permission check
    if (!checkDashboardPermission(currentUser.role as Role, 'delete_user')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete users'
      });
    }

    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already deleted
    if (targetUser.deleted) {
      return res.status(400).json({
        success: false,
        message: 'User is already deleted'
      });
    }
    
    // Prevent self-deletion
    if (targetUserId === (currentUser.id || currentUser._id).toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    // Store user data before soft deletion
    const userData = {
      firstname: targetUser.firstname,
      lastname: targetUser.lastname,
      email: targetUser.email,
      role: targetUser.role,
      solvedProblems: targetUser.solvedProblems?.length || 0,
      attemptedProblems: targetUser.attemptedProblems?.length || 0
    };

    // Soft delete the user instead of permanent deletion
    await User.findByIdAndUpdate(targetUserId, {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: currentUser.id || currentUser._id
    });

    // Log the action as REVERSIBLE
    await new AuditLog({
      action: 'user_deleted',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'user',
      targetId: targetUserId,
      metadata: {
        deletedUser: userData,
        reason: 'Admin deletion',
        softDelete: true
      },
      reversible: true
    }).save();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully (can be reverted)',
      data: {
        deletedUserId: targetUserId,
        deletedUserInfo: userData,
        reversible: true
      }
    });

  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// GET /dashboard/user/edit/:userId - Edit user page
export const getEditUser = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get current user info
    const currentUser = req.user;

    // ✅ FIX 3: Add RBAC permission check
    if (!checkDashboardPermission(currentUser.role as Role, 'view_all_users')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view user details'
      });
    }

    // Find the target user
    const targetUser = await User.findById(userId).select('-password -token -__v');
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const userStats = {
      totalSolvedProblems: targetUser.solvedProblems?.length || 0,
      totalAttemptedProblems: targetUser.attemptedProblems?.length || 0,
      totalBookmarkedProblems: targetUser.bookmarkedProblems?.length || 0,
      accountAge: Math.floor((Date.now() - new Date(targetUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    };

    // Get available roles based on current user's permissions
    const roleHierarchy = ['user', 'problem_setter', 'admin', 'super_admin'];
    const currentUserRoleLevel = roleHierarchy.indexOf(currentUser.role);
    
    let availableRoles = [];
    if (currentUser.role === 'super_admin') {
      availableRoles = roleHierarchy;
    } else {
      availableRoles = roleHierarchy.slice(0, currentUserRoleLevel);
    }

    res.status(200).json({
      success: true,
      message: 'User details fetched for editing',
      data: {
        user: targetUser,
        userStats: userStats,
        formOptions: {
          availableRoles: availableRoles,
          currentUserRole: currentUser.role
        },
        userPermissions: {
          canEditRole: checkDashboardPermission(currentUser.role as Role, 'set_user_role'),
          canDelete: checkDashboardPermission(currentUser.role as Role, 'delete_user'),
          canPromote: checkDashboardPermission(currentUser.role as Role, 'promote_user'),
          canDemote: checkDashboardPermission(currentUser.role as Role, 'demote_user')
        }
      }
    });

  } catch (error: any) {
    console.error('Get edit user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user for editing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// PUT /dashboard/user/setrole - Set user role
export const setUserRole = async (req: any, res: any) => {
  try {
    const { targetUserId, newRole } = req.body;
    
    if (!targetUserId || !newRole) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID and new role are required'
      });
    }

    // Get current user info
    const currentUser = req.user;

    // ✅ FIX 4: Add RBAC permission check
    if (!checkDashboardPermission(currentUser.role as Role, 'set_user_role')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to set user roles'
      });
    }

    // Validate role
    const validRoles = ['user', 'problem_setter', 'admin', 'super_admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent self-role change
    if (targetUserId === (currentUser.id || currentUser._id).toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    // Role hierarchy check
    const roleHierarchy = ['user', 'problem_setter', 'admin', 'super_admin'];
    const currentUserRoleLevel = roleHierarchy.indexOf(currentUser.role);
    const newRoleLevel = roleHierarchy.indexOf(newRole);
    
    if (currentUser.role !== 'super_admin' && newRoleLevel >= currentUserRoleLevel) {
      return res.status(403).json({
        success: false,
        message: 'You can only assign roles lower than your own'
      });
    }

    const oldRole = targetUser.role;
    
    // If promoting to admin, create a pending request for super admin approval
    let requiresApproval = false;
    if (newRole === 'admin' && currentUser.role === 'admin') {
      await new PendingRequest({
        requestType: 'user_role_change',
        requestedBy: currentUser.id || currentUser._id,
        targetId: targetUserId,
        targetType: 'user',
        reason: `Role change from ${oldRole} to ${newRole}`,
        status: 'pending'
      }).save();
      
      requiresApproval = true;
    } else {
      await User.findByIdAndUpdate(targetUserId, { role: newRole });
    }

    // Log the action in audit logs
    await new AuditLog({
      action: requiresApproval ? 'user_role_change_requested' : 'user_role_changed',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'user',
      targetId: targetUserId,
      metadata: {
        targetUser: {
          firstname: targetUser.firstname,
          lastname: targetUser.lastname,
          email: targetUser.email
        },
        oldRole: oldRole,
        newRole: newRole,
        requiresApproval: requiresApproval
      },
      reversible: !requiresApproval
    }).save();

    res.status(200).json({
      success: true,
      message: requiresApproval ? 
        'Role change request submitted for Super Admin approval' : 
        'User role updated successfully',
      data: {
        targetUserId,
        oldRole,
        newRole,
        requiresApproval,
        status: requiresApproval ? 'pending_approval' : 'completed'
      }
    });

  } catch (error: any) {
    console.error('Set user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set user role',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function
function getNextRole(currentRole: Role): Role | null {
  const promotionMap: Record<Role, Role | null> = {
    'user': 'problem_setter',
    'problem_setter': 'admin', 
    'admin': 'super_admin',
    'super_admin': null
  };
  
  return promotionMap[currentRole] || null;
}

// PUT /dashboard/user/promote - Promote user
export const promoteUser = async (req: any, res: any) => {
  try {
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    // Get current user info
    const currentUser = req.user;

    // ✅ FIX 5: Check if current user can promote OTHER users, not self-promote
    if (!checkDashboardPermission(currentUser.role as Role, 'promote_user')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to promote users'
      });
    }

    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Define promotion hierarchy
    const promotionMap = {
      'user': 'problem_setter',
      'problem_setter': 'admin',
      'admin': 'super_admin'
    };

    const currentRole = targetUser.role;
    const newRole = promotionMap[currentRole as keyof typeof promotionMap];

    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: `Cannot promote from ${currentRole} - already at highest level or invalid role`
      });
    }

    // Use the setUserRole logic for promotion
    req.body.newRole = newRole;
    return setUserRole(req, res);

  } catch (error: any) {
    console.error('Promote user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to promote user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// PUT /dashboard/user/demote - Demote user
export const demoteUser = async (req: any, res: any) => {
  try {
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    // Get current user info
    const currentUser = req.user;

    // ✅ FIX 6: Add RBAC permission check
    if (!checkDashboardPermission(currentUser.role as Role, 'demote_user')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to demote users'
      });
    }

    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Define demotion hierarchy
    const demotionMap = {
      'super_admin': 'admin',
      'admin': 'problem_setter',
      'problem_setter': 'user'
    };

    const currentRole = targetUser.role;
    const newRole = demotionMap[currentRole as keyof typeof demotionMap];

    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: `Cannot demote from ${currentRole} - already at lowest level or invalid role`
      });
    }

    // Special case: Admin trying to demote another Admin requires Super Admin approval
    if (currentRole === 'admin' && currentUser.role === 'admin') {
      await new PendingRequest({
        requestType: 'user_demotion',
        requestedBy: currentUser.id || currentUser._id,
        targetId: targetUserId,
        targetType: 'user',
        reason: `Demotion request from ${currentRole} to ${newRole}`,
        status: 'pending'
      }).save();

      await new AuditLog({
        action: 'user_demotion_requested',
        performedBy: currentUser.id || currentUser._id,
        targetType: 'user',
        targetId: targetUserId,
        metadata: {
          targetUser: {
            firstname: targetUser.firstname,
            lastname: targetUser.lastname,
            email: targetUser.email
          },
          currentRole: currentRole,
          requestedNewRole: newRole,
          requiresApproval: true
        },
        reversible: false
      }).save();

      return res.status(200).json({
        success: true,
        message: 'Demotion request submitted for Super Admin approval',
        data: {
          targetUserId,
          currentRole,
          requestedNewRole: newRole,
          status: 'pending_approval'
        }
      });
    }

    // Use the setUserRole logic for demotion
    req.body.newRole = newRole;
    return setUserRole(req, res);

  } catch (error: any) {
    console.error('Demote user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to demote user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
