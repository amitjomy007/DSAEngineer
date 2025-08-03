const Problem = require("../../../models/problem");
const AuditLog = require("../../../models/audits");

// DELETE /dashboard/problem/delete - Delete problem
export const deleteProblem = async (req: any, res: any) => {
  try {
    const { problemId } = req.body;
    
    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID is required'
      });
    }

    // Find the problem first
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Get current user info from JWT
    const currentUser = req.user;
    
    // For Super Admin: Permanently delete from database
    // For Admin: Set isApproved to false (soft delete)
    let deletionAction = '';
    
    if (currentUser.role === 'super_admin') {
      // Permanent deletion
      await Problem.findByIdAndDelete(problemId);
      deletionAction = 'permanently_deleted';
    } else {
      // Soft delete (set isApproved to false)
      await Problem.findByIdAndUpdate(problemId, { isApproved: false });
      deletionAction = 'soft_deleted';
    }

    // Log the action in audit logs
    await new AuditLog({
      action: `problem_${deletionAction}`,
      performedBy: currentUser.id || currentUser._id,
      targetType: 'problem',
      targetId: problemId,
      metadata: {
        problemTitle: problem.title,
        problemAuthor: problem.problemAuthorId,
        deletionType: deletionAction
      },
      reversible: deletionAction === 'soft_deleted' // Only soft deletes are reversible
    }).save();

    res.status(200).json({
      success: true,
      message: `Problem ${deletionAction === 'permanently_deleted' ? 'permanently deleted' : 'moved to deleted status'}`,
      data: {
        problemId,
        action: deletionAction
      }
    });

  } catch (error: any) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete problem',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// GET /dashboard/problem/edit/:problemId - Edit problem page
export const getEditProblem = async (req: any, res: any) => {
  try {
    const { problemId } = req.params;
    
    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID is required'
      });
    }

    // Find the problem with full details
    const problem = await Problem.findById(problemId)
      .populate('problemAuthorId', 'firstname lastname email role');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // Check permissions: Super Admin/Admin can edit any problem, Problem Setter can edit only their own
    if (currentUser.role === 'problem_setter' && 
        problem.problemAuthorId._id.toString() !== (currentUser.id || currentUser._id).toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own problems'
      });
    }

    // Get available tags and difficulties for form options
    const [allTags, allDifficulties] = await Promise.all([
      Problem.distinct('tags'),
      Problem.distinct('difficulty')
    ]);

    res.status(200).json({
      success: true,
      message: 'Problem details fetched for editing',
      data: {
        problem: problem,
        formOptions: {
          availableTags: allTags,
          availableDifficulties: allDifficulties,
          allowedLanguages: ["javascript", "python", "java", "cpp", "c", "csharp"]
        },
        userPermissions: {
          canEdit: true,
          canDelete: currentUser.role === 'super_admin' || currentUser.role === 'admin',
          canApprove: currentUser.role === 'super_admin' || currentUser.role === 'admin'
        }
      }
    });

  } catch (error: any) {
    console.error('Get edit problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem for editing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// PUT /dashboard/problem/approve - Approve problem
export const approveProblem = async (req: any, res: any) => {
  try {
    const { problemId } = req.body;
    
    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID is required'
      });
    }

    // Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if already approved
    if (problem.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Problem is already approved'
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // Update problem approval status
    await Problem.findByIdAndUpdate(problemId, { 
      isApproved: true,
      problemLastModifiedDate: new Date()
    });

    // Log the action in audit logs
    await new AuditLog({
      action: 'problem_approved',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'problem',
      targetId: problemId,
      metadata: {
        problemTitle: problem.title,
        problemAuthor: problem.problemAuthorId,
        previousStatus: 'pending'
      },
      reversible: true // Approvals can be reverted
    }).save();

    res.status(200).json({
      success: true,
      message: 'Problem approved successfully',
      data: {
        problemId,
        newStatus: 'approved'
      }
    });

  } catch (error: any) {
    console.error('Approve problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve problem',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// PUT /dashboard/problem/reject - Reject problem
export const rejectProblem = async (req: any, res: any) => {
  try {
    const { problemId, reason } = req.body;
    
    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID is required'
      });
    }

    // Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if already rejected
    if (!problem.isApproved && problem.problemLastModifiedDate) {
      return res.status(400).json({
        success: false,
        message: 'Problem is already rejected/pending'
      });
    }

    // Get current user info
    const currentUser = req.user;
    
    // Update problem to rejected status
    await Problem.findByIdAndUpdate(problemId, { 
      isApproved: false,
      problemLastModifiedDate: new Date()
    });

    // Log the action in audit logs
    await new AuditLog({
      action: 'problem_rejected',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'problem',
      targetId: problemId,
      metadata: {
        problemTitle: problem.title,
        problemAuthor: problem.problemAuthorId,
        rejectionReason: reason || 'No reason provided',
        previousStatus: problem.isApproved ? 'approved' : 'pending'
      },
      reversible: true // Rejections can be reverted
    }).save();

    res.status(200).json({
      success: true,
      message: 'Problem rejected successfully',
      data: {
        problemId,
        newStatus: 'rejected',
        reason: reason || 'No reason provided'
      }
    });

  } catch (error: any) {
    console.error('Reject problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject problem',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Add to problemActionsController.ts
export const updateProblem = async (req: any, res: any) => {
  try {
    const { problemId, updateData } = req.body;
    
    if (!problemId || !updateData) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID and update data are required'
      });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      problemId, 
      { ...updateData, problemLastModifiedDate: new Date() }, 
      { new: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Log the update
    const currentUser = req.user;
    await new AuditLog({
      action: 'problem_updated',
      performedBy: currentUser.id || currentUser._id,
      targetType: 'problem',
      targetId: problemId,
      metadata: {
        updatedFields: Object.keys(updateData),
        problemTitle: updatedProblem.title
      },
      reversible: false
    }).save();

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: updatedProblem
    });

  } catch (error: any) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update problem',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
