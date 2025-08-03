/**
 * Role-Based Access Control (RBAC) Utility for Dashboard
 * 
 * This module provides centralized permission checking for the admin dashboard.
 * It implements role inheritance where higher roles inherit permissions from lower roles.
 * 
 * Role Hierarchy: user < problem_setter < admin < super_admin
 * 
 * Special Cases:
 * - Self-promotion requests are limited by role ceiling
 * - Super Admin cannot request promotions (no higher role exists)
 * - Admin cannot request promotion to Super Admin (role ceiling)
 * 
 * @author Dashboard Team
 * @version 1.0.0
 */

/**
 * Checks if a user with a given role has permission to perform a specified action
 * 
 * @param {string} userRole - The user's current role ('user', 'problem_setter', 'admin', 'super_admin')
 * @param {string} action - The action to check permission for (e.g., 'edit_problem', 'manage_users')
 * @param {Object} context - Optional context object for additional checks
 * @param {string} context.targetRole - Target role for promotion requests
 * @param {string} context.targetUserId - Target user ID for user management actions
 * @param {string} context.currentUserId - Current user ID for self-action checks
 * 
 * @returns {boolean} - true if permission granted, false if denied
 * 
 * @example
 * // Check if admin can edit problems
 * checkDashboardPermission('admin', 'edit_problem') // returns true
 * 
 * @example
 * // Check if problem_setter can request promotion to admin
 * checkDashboardPermission('problem_setter', 'request_promotion', { targetRole: 'admin' }) // returns true
 * 
 * @example
 * // Check if admin can request promotion to super_admin (blocked by role ceiling)
 * checkDashboardPermission('admin', 'request_promotion', { targetRole: 'super_admin' }) // returns false
 */

// Define allowed roles as literal types
export type Role = 'user' | 'problem_setter' | 'admin' | 'super_admin';

// Define allowed actions
export type Action = 
  | 'view_dashboard'
  | 'create_problem' 
  | 'edit_own_problem'
  | 'edit_any_problem'
  | 'approve_problem'
  | 'reject_problem'
  | 'delete_problem'
  | 'manage_users'
  | 'set_user_role'
  | 'promote_user'
  | 'demote_user'
  | 'delete_user'
  | 'view_audit_logs'
  | 'approve_requests'
  | 'reject_requests'
  | 'revert_actions'
  | 'request_promotion';

export interface RBACContext {
  targetRole?: Role;
  targetUserId?: string;
  currentUserId?: string;
  [key: string]: any;
}

const rolePermissions: Record<Role, Action[]> = {
  user: ['view_dashboard', 'request_promotion'],
  
  problem_setter: [
    'view_dashboard', 'create_problem', 'edit_own_problem', 'request_promotion'
  ],
  
  admin: [
    'view_dashboard', 'create_problem', 'edit_own_problem', 'edit_any_problem',
    'approve_problem', 'reject_problem', 'delete_problem', 'manage_users',
    'set_user_role', 'promote_user', 'demote_user', 'delete_user', 
    'view_audit_logs', 'approve_requests', 'reject_requests', 'request_promotion'
  ],
  
  super_admin: [
    'view_dashboard', 'create_problem', 'edit_own_problem', 'edit_any_problem',
    'approve_problem', 'reject_problem', 'delete_problem', 'manage_users',
    'set_user_role', 'promote_user', 'demote_user', 'delete_user',
    'view_audit_logs', 'approve_requests', 'reject_requests', 'revert_actions'
  ]
};

// Role hierarchy for inheritance
const roleHierarchy: Role[] = ['user', 'problem_setter', 'admin', 'super_admin'];

function checkDashboardPermission(userRole:Role, action:Action, context: RBACContext = {}):boolean {
  // Role hierarchy - order matters for inheritance
  const roleHierarchy = ['user', 'problem_setter', 'admin', 'super_admin'];
  const currentRoleIndex = roleHierarchy.indexOf(userRole);
  
  // Invalid role check
  if (currentRoleIndex === -1) {
    console.warn(`[RBAC] Invalid role provided: ${userRole}`);
    return false;
  }

  // Define base permissions for each role
  // Higher roles inherit ALL permissions from lower roles
  const rolePermissions: Record<string, string[]> = {
    user: [
      'view_dashboard_basic'  // Basic dashboard access (if needed later)
    ],
    
    problem_setter: [
      'create_problem',       // Can create new problems
      'edit_own_problem',     // Can edit problems they authored
      'view_my_problems',     // Can view their own problems panel
      'request_promotion'     // Can request promotion (with limitations)
    ],
    
    admin: [
      'edit_any_problem',     // Can edit ANY problem regardless of author
      'approve_problem',      // Can approve pending problems
      'reject_problem',       // Can reject problems
      'view_all_problems',    // Can view all problems panel
      'manage_users',         // Can manage user accounts
      'view_all_users',       // Can view all users panel
      'delete_user',          // Can delete users (soft delete)
      'promote_user',         // Can promote users (with restrictions)
      'demote_user',          // Can demote users (with restrictions)
      'set_user_role',        // Can set user roles (with restrictions)
      'view_audit_logs',      // Can view audit logs
      'view_pending_requests', // Can view pending requests
      'request_promotion'     // Can request promotion (with role ceiling)
    ],
    
    super_admin: [
      'delete_problem',       // Can permanently delete problems
      'approve_requests',     // Can approve pending admin requests
      'reject_requests',      // Can reject pending requests
      'revert_actions',       // Can revert audit log actions
      'manage_super_admins'   // Can manage other super admin accounts
    ]
  };

  /**
   * SPECIAL CASE HANDLING - Highest Precedence Rules
   * These rules are checked FIRST before standard inheritance
   */
  
  // Handle promotion request limitations
  if (action === 'request_promotion') {
    const targetRole = context.targetRole || '';
    
    // Super Admin cannot request promotion (no higher role exists)
    if (userRole === 'super_admin') {
      console.log(`[RBAC] Blocked: Super Admin cannot request promotion (no higher role)`);
      return false;
    }
    
    // Role Ceiling: Admin cannot request promotion to Super Admin
    if (userRole === 'admin' && targetRole === 'super_admin') {
      console.log(`[RBAC] Blocked: Admin cannot request promotion to Super Admin (role ceiling)`);
      return false;
    }
    
    // All other promotion requests are allowed (user → problem_setter, problem_setter → admin)
    return true;
  }

  // Handle user management permissions with hierarchy checks
  if (['promote_user', 'demote_user', 'set_user_role', 'delete_user'].includes(action)) {
    // Only admin and super_admin can manage users
    if (!['admin', 'super_admin'].includes(userRole)) {
      return false;
    }
    
    // Additional hierarchy checks can be added here if needed
    // e.g., admin cannot delete super_admin users
  }

  /**
   * PERMISSION INHERITANCE LOGIC
   * Higher roles inherit ALL permissions from lower roles
   */
  
  // Collect all inherited permissions
  const inheritedPermissions = new Set();
  
  // Add permissions from current role and all lower roles in hierarchy
  for (let i = 0; i <= currentRoleIndex; i++) {
    const role = roleHierarchy[i];
    const permissions = rolePermissions[role] || [];
    
    permissions.forEach((permission: any) => {
      inheritedPermissions.add(permission);
    });
  }

  // Check if user has the requested permission
  const hasPermission = inheritedPermissions.has(action);
  
  // Debug logging (can be removed in production)
  console.log(`[RBAC] Permission check: ${userRole} -> ${action} = ${hasPermission}`);
  
  return hasPermission;
}

/**
 * Convenience function to check multiple permissions at once
 * 
 * @param {string} userRole - The user's role
 * @param {string[]} actions - Array of actions to check
 * @param {Object} context - Optional context object
 * @returns {Object} - Object with action names as keys and boolean results as values
 * 
 * @example
 * const permissions = checkMultiplePermissions('admin', ['edit_problem', 'delete_user']);
 * // Returns: { edit_problem: true, delete_user: true }
 */
function checkMultiplePermissions(userRole: any, actions: any, context: any = {}) {
  const results: any = {};
  
  actions.forEach((action: any) => {
    results[action] = checkDashboardPermission(userRole, action, context);
  });
  
  return results;
}

/**
 * Get all available permissions for a given role (including inherited)
 * 
 * @param {string} userRole - The user's role
 * @returns {string[]} - Array of all available permissions
 * 
 * @example
 * const adminPermissions = getRolePermissions('admin');
 * // Returns: ['view_dashboard_basic', 'create_problem', 'edit_own_problem', ...]
 */
function getRolePermissions(userRole: any) {
  const roleHierarchy = ['user', 'problem_setter', 'admin', 'super_admin'];
  const currentRoleIndex = roleHierarchy.indexOf(userRole);
  
  if (currentRoleIndex === -1) {
    return [];
  }

  const rolePermissions: Record<string, string[]> = {
    user: ['view_dashboard_basic'],
    problem_setter: ['create_problem', 'edit_own_problem', 'view_my_problems', 'request_promotion'],
    admin: ['edit_any_problem', 'approve_problem', 'reject_problem', 'view_all_problems', 'manage_users', 'view_all_users', 'delete_user', 'promote_user', 'demote_user', 'set_user_role', 'view_audit_logs', 'view_pending_requests', 'request_promotion'],
    super_admin: ['delete_problem', 'approve_requests', 'reject_requests', 'revert_actions', 'manage_super_admins']
  };

  const allPermissions = new Set();
  
  for (let i = 0; i <= currentRoleIndex; i++) {
    const role = roleHierarchy[i];
    const permissions = rolePermissions[role] || [];
    permissions.forEach((permission: any) => allPermissions.add(permission));
  }
  
  return Array.from(allPermissions);
}

// Export functions for use in other modules
module.exports = {
  checkDashboardPermission,
  checkMultiplePermissions,
  getRolePermissions
};
