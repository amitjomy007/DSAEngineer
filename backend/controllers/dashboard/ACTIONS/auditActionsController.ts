const AuditLog = require("../../../models/audits");
const User = require("../../../models/user");
const Problem = require("../../../models/problem");
const PendingRequest = require("../../../models/pendingRequests");

// POST /dashboard/audit/revert - Revert audit action
export const revertAuditAction = async (req: any, res: any) => {
  try {
    const { auditId } = req.body;
    
    if (!auditId) {
      return res.status(400).json({
        success: false,
        message: 'Audit ID is required'
      });
    }

    // Find the audit log entry
    const auditLog = await AuditLog.findById(auditId)
      .populate('performedBy', 'firstname lastname email role')
      .populate('targetId');

    if (!auditLog) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }

    // Check if action is reversible
    if (!auditLog.reversible) {
      return res.status(400).json({
        success: false,
        message: 'This action cannot be reverted'
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // Only Super Admin can revert actions
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only Super Admin can revert audit actions'
      });
    }

    // Check if action has already been reverted
    const existingRevert = await AuditLog.findOne({
      action: 'action_reverted',
      'metadata.originalAuditId': auditId
    });

    if (existingRevert) {
      return res.status(400).json({
        success: false,
        message: 'This action has already been reverted'
      });
    }

    // Execute the revert based on action type
    let revertResult = {};
    
    switch (auditLog.action) {
      case 'user_role_changed':
        revertResult = await revertUserRoleChange(auditLog);
        break;
      case 'user_promoted_to_admin':
        revertResult = await revertUserPromotion(auditLog);
        break;
      case 'user_demoted':
        revertResult = await revertUserDemotion(auditLog);
        break;
      case 'problem_approved':
        revertResult = await revertProblemApproval(auditLog);
        break;
      case 'problem_rejected':
        revertResult = await revertProblemRejection(auditLog);
        break;
      case 'problem_soft_deleted':
        revertResult = await revertProblemSoftDelete(auditLog);
        break;
      case 'request_approved':
        revertResult = await revertRequestApproval(auditLog);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Cannot revert action type: ${auditLog.action}`
        });
    }

    // Log the revert action
    await new AuditLog({
      action: 'action_reverted',
      performedBy: currentUser.id || currentUser._id,
      targetType: auditLog.targetType,
      targetId: auditLog.targetId,
      metadata: {
        originalAuditId: auditId,
        originalAction: auditLog.action,
        originalPerformedBy: auditLog.performedBy._id,
        originalTimestamp: auditLog.timestamp,
        revertResult: revertResult,
        revertReason: 'Super Admin revert action'
      },
      reversible: false // Reverts themselves cannot be reverted
    }).save();

    res.status(200).json({
      success: true,
      message: 'Action reverted successfully',
      data: {
        originalAuditId: auditId,
        originalAction: auditLog.action,
        revertResult: revertResult,
        revertedBy: {
          id: currentUser.id || currentUser._id,
          name: `${currentUser.firstname} ${currentUser.lastname}`
        },
        revertedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Revert audit action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revert audit action',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to revert user role change
async function revertUserRoleChange(auditLog: any) {
  try {
    const { oldRole, newRole } = auditLog.metadata;
    const targetUserId = auditLog.targetId;
    
    // Restore the old role
    await User.findByIdAndUpdate(targetUserId, { role: oldRole });
    
    return {
      action: 'user_role_reverted',
      targetUserId: targetUserId,
      revertedFrom: newRole,
      restoredTo: oldRole,
      success: true
    };
  } catch (error:any) {
    return {
      action: 'user_role_revert_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to revert user promotion
async function revertUserPromotion(auditLog: any) {
  try {
    const { oldRole } = auditLog.metadata;
    const targetUserId = auditLog.targetId;
    
    // Restore the old role
    await User.findByIdAndUpdate(targetUserId, { role: oldRole });
    
    return {
      action: 'user_promotion_reverted',
      targetUserId: targetUserId,
      revertedFrom: 'admin',
      restoredTo: oldRole,
      success: true
    };
  } catch (error:any) {
    return {
      action: 'user_promotion_revert_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to revert user demotion
async function revertUserDemotion(auditLog: any) {
  try {
    const { oldRole } = auditLog.metadata;
    const targetUserId = auditLog.targetId;
    
    // Restore the old role
    await User.findByIdAndUpdate(targetUserId, { role: oldRole });
    
    return {
      action: 'user_demotion_reverted',
      targetUserId: targetUserId,
      revertedFrom: auditLog.metadata.newRole,
      restoredTo: oldRole,
      success: true
    };
  } catch (error:any) {
    return {
      action: 'user_demotion_revert_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to revert problem approval
async function revertProblemApproval(auditLog: any) {
  try {
    const problemId = auditLog.targetId;
    
    // Set problem back to pending (isApproved = false)
    await Problem.findByIdAndUpdate(problemId, { 
      isApproved: false,
      problemLastModifiedDate: new Date()
    });
    
    return {
      action: 'problem_approval_reverted',
      problemId: problemId,
      revertedFrom: 'approved',
      restoredTo: 'pending',
      success: true
    };
  } catch (error:any) {
    return {
      action: 'problem_approval_revert_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to revert problem rejection
async function revertProblemRejection(auditLog: any) {
  try {
    const problemId = auditLog.targetId;
    const { previousStatus } = auditLog.metadata;
    
    // Restore to previous status (approved or pending)
    const isApproved = previousStatus === 'approved';
    await Problem.findByIdAndUpdate(problemId, { 
      isApproved: isApproved,
      problemLastModifiedDate: new Date()
    });
    
    return {
      action: 'problem_rejection_reverted',
      problemId: problemId,
      revertedFrom: 'rejected',
      restoredTo: previousStatus,
      success: true
    };
  } catch (error:any) {
    return {
      action: 'problem_rejection_revert_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to revert problem soft delete
async function revertProblemSoftDelete(auditLog: any) {
  try {
    const problemId = auditLog.targetId;
    
    // Restore problem by setting isApproved = true
    await Problem.findByIdAndUpdate(problemId, { 
      isApproved: true,
      problemLastModifiedDate: new Date()
    });
    
    return {
      action: 'problem_soft_delete_reverted',
      problemId: problemId,
      revertedFrom: 'deleted',
      restoredTo: 'approved',
      success: true
    };
  } catch (error:any) {
    return {
      action: 'problem_soft_delete_revert_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to revert request approval
async function revertRequestApproval(auditLog: any) {
  try {
    const requestId = auditLog.targetId;
    const { actionResult } = auditLog.metadata;
    
    // First, undo the action that was performed
    if (actionResult.action === 'role_changed') {
      await User.findByIdAndUpdate(actionResult.targetUserId, { 
        role: actionResult.oldRole 
      });
    }
    
    // Reset request back to pending
    await PendingRequest.findByIdAndUpdate(requestId, {
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null
    });
    
    return {
      action: 'request_approval_reverted',
      requestId: requestId,
      undoneAction: actionResult,
      restoredTo: 'pending',
      success: true
    };
  } catch (error:any) {
    return {
      action: 'request_approval_revert_failed',
      error: error.message,
      success: false
    };
  }
}
