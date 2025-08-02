const PendingRequest = require("../../../models/pendingRequests");
const User = require("../../../models/user");
const AuditLog = require("../../../models/audits");

// PUT /dashboard/request/approve - Approve pending request
export const approveRequest = async (req: any, res: any) => {
  try {
    const { requestId } = req.body;
    
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    // Find the pending request
    const request = await PendingRequest.findById(requestId)
      .populate('requestedBy', 'firstname lastname email role')
      .populate('targetId');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // Only Super Admin can approve requests
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only Super Admin can approve requests'
      });
    }

    // Execute the requested action based on request type
    let actionResult = {};
    
    switch (request.requestType) {
      case 'user_role_change':
        actionResult = await executeRoleChange(request);
        break;
      case 'user_demotion':
        actionResult = await executeDemotion(request);
        break;
      case 'admin_promotion':
        actionResult = await executeAdminPromotion(request);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown request type: ${request.requestType}`
        });
    }

    // Update request status
    await PendingRequest.findByIdAndUpdate(requestId, {
      status: 'approved',
      reviewedBy: currentUser.id || currentUser._id,
      reviewedAt: new Date()
    });

    // Log the approval in audit logs
    await new AuditLog({
      action: 'request_approved',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'request',
      targetId: requestId,
      metadata: {
        requestType: request.requestType,
        requestedBy: request.requestedBy._id,
        originalRequest: {
          reason: request.reason,
          createdAt: request.createdAt
        },
        actionResult: actionResult
      },
      reversible: true // Request approvals can be reverted
    }).save();

    // Also log the actual action that was performed
    await new AuditLog({
      action: `${request.requestType}_executed`,
      performedBy: currentUser.id || currentUser._id,
      targetType: request.targetType,
      targetId: request.targetId,
      metadata: {
        executedViaRequest: requestId,
        ...actionResult
      },
      reversible: true
    }).save();

    res.status(200).json({
      success: true,
      message: 'Request approved and executed successfully',
      data: {
        requestId,
        requestType: request.requestType,
        actionResult: actionResult,
        approvedBy: {
          id: currentUser.id || currentUser._id,
          name: `${currentUser.firstname} ${currentUser.lastname}`
        },
        approvedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// PUT /dashboard/request/reject - Reject pending request
export const rejectRequest = async (req: any, res: any) => {
  try {
    const { requestId, rejectionReason } = req.body;
    
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    // Find the pending request
    const request = await PendingRequest.findById(requestId)
      .populate('requestedBy', 'firstname lastname email role');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // Only Super Admin can reject requests
    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only Super Admin can reject requests'
      });
    }

    // Update request status
    await PendingRequest.findByIdAndUpdate(requestId, {
      status: 'rejected',
      reviewedBy: currentUser.id || currentUser._id,
      reviewedAt: new Date(),
      reason: rejectionReason ? `${request.reason} | REJECTION REASON: ${rejectionReason}` : request.reason
    });

    // Log the rejection in audit logs
    await new AuditLog({
      action: 'request_rejected',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'request',
      targetId: requestId,
      metadata: {
        requestType: request.requestType,
        requestedBy: request.requestedBy._id,
        originalRequest: {
          reason: request.reason,
          createdAt: request.createdAt
        },
        rejectionReason: rejectionReason || 'No reason provided',
        rejectedBy: {
          id: currentUser.id || currentUser._id,
          name: `${currentUser.firstname} ${currentUser.lastname}`
        }
      },
      reversible: false // Request rejections are final
    }).save();

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: {
        requestId,
        requestType: request.requestType,
        rejectionReason: rejectionReason || 'No reason provided',
        rejectedBy: {
          id: currentUser.id || currentUser._id,
          name: `${currentUser.firstname} ${currentUser.lastname}`
        },
        rejectedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to execute role change
async function executeRoleChange(request: any) {
  try {
    // Extract new role from request reason or metadata
    const reasonParts = request.reason.split(' ');
    const newRole = reasonParts[reasonParts.length - 1]; // Assumes format "Role change from X to Y"
    
    const oldUser = await User.findById(request.targetId);
    const oldRole = oldUser.role;
    
    // Update user role
    await User.findByIdAndUpdate(request.targetId, { role: newRole });
    
    return {
      action: 'role_changed',
      targetUserId: request.targetId,
      oldRole: oldRole,
      newRole: newRole,
      success: true
    };
  } catch (error:any) {
    console.error('Execute role change error:', error);
    return {
      action: 'role_change_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to execute demotion
async function executeDemotion(request: any) {
  try {
    const user = await User.findById(request.targetId);
    const currentRole = user.role;
    
    // Define demotion map
    const demotionMap = {
      'super_admin': 'admin',
      'admin': 'problem_setter',
      'problem_setter': 'user'
    };
    
    const newRole = demotionMap[currentRole as keyof typeof demotionMap];
    
    if (!newRole) {
      throw new Error(`Cannot demote from role: ${currentRole}`);
    }
    
    // Update user role
    await User.findByIdAndUpdate(request.targetId, { role: newRole });
    
    return {
      action: 'user_demoted',
      targetUserId: request.targetId,
      oldRole: currentRole,
      newRole: newRole,
      success: true
    };
  } catch (error:any) {
    console.error('Execute demotion error:', error);
    return {
      action: 'demotion_failed',
      error: error.message,
      success: false
    };
  }
}

// Helper function to execute admin promotion
async function executeAdminPromotion(request: any) {
  try {
    const user = await User.findById(request.targetId);
    const currentRole = user.role;
    
    // Update user role to admin
    await User.findByIdAndUpdate(request.targetId, { role: 'admin' });
    
    return {
      action: 'user_promoted_to_admin',
      targetUserId: request.targetId,
      oldRole: currentRole,
      newRole: 'admin',
      success: true
    };
  } catch (error:any) {
    console.error('Execute admin promotion error:', error);
    return {
      action: 'admin_promotion_failed',
      error: error.message,
      success: false
    };
  }
}
