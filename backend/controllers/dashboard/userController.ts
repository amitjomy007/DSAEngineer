const User = require("../../models/user");
const Problem = require("../../models/problem");
interface UsersQuery {
  page?: string;
  limit?: string;
  role?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}

export const getUsersData = async (req: any, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      role = '',
      search = '',
      dateFrom = '',
      dateTo = '',
      sort = '-createdAt'
    } = req.query as UsersQuery;

    const allProblems = await Problem.find({})
      .select('_id title problemAuthorId difficulty isApproved')
      .lean(); 
    
    // Convert and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter - exclude deleted users
    const filter: any = {
      deleted: { $ne: true }
    };
    
    if (role) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { firstname: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    console.log("🔍 Users filter for Super Admin:", filter);

    // Execute queries in parallel
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-password -token -__v'),
      
      User.countDocuments(filter)
    ]);

    // ✅ NEW: Get problem statistics for each user
    const usersWithProblemStats = await Promise.all(
      users.map(async (user:any) => {
        const [
          problemsAuthored,
          problemsSolved, 
          problemsAttempted,
          problemsBookmarked
        ] = await Promise.all([
          // Count problems authored by this user
          Problem.countDocuments({ problemAuthorId: user._id }),
          
          // Count problems in user's solvedProblems array (if it has data)
          user.solvedProblems?.length || 0,
          
          // Count problems in user's attemptedProblems array (if it has data)  
          user.attemptedProblems?.length || 0,
          
          // Count problems in user's bookmarkedProblems array (if it has data)
          user.bookmarkedProblems?.length || 0
        ]);

        return {
          ...user.toObject(),
          problemsAuthored,
          actualSolvedCount: problemsSolved,
          actualAttemptedCount: problemsAttempted,
          actualBookmarkedCount: problemsBookmarked
        };
      })
    );

    // Calculate user statistics
    const stats = {
      totalUsers: totalUsers,
      superAdmins: await User.countDocuments({ role: 'super_admin', deleted: { $ne: true } }),
      admins: await User.countDocuments({ role: 'admin', deleted: { $ne: true } }),
      problemSetters: await User.countDocuments({ role: 'problem_setter', deleted: { $ne: true } }),
      regularUsers: await User.countDocuments({ role: 'user', deleted: { $ne: true } }),
      newUsersThisMonth: await User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        deleted: { $ne: true }
      }),
      allRoles: await User.distinct('role', { deleted: { $ne: true } })
    };

    const printuu = {
      success: true,
      message: 'Users data fetched successfully for Super Admin',
      data: {
        users: usersWithProblemStats, // ✅ Now includes problem statistics
        allProblems: allProblems, 
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalUsers / limitNum),
          totalItems: totalUsers,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(totalUsers / limitNum),
          hasPrevPage: pageNum > 1,
          nextPage: pageNum < Math.ceil(totalUsers / limitNum) ? pageNum + 1 : null,
          prevPage: pageNum > 1 ? pageNum - 1 : null
        },
        statistics: stats,
        filters: {
          role,
          search,
          dateFrom,
          dateTo,
          sort
        }
      }
    }
    res.status(200).json({
      success: true,
      message: 'Users data fetched successfully for Super Admin',
      data: {
        users: usersWithProblemStats, // ✅ Now includes problem statistics
        allProblems: allProblems, 
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalUsers / limitNum),
          totalItems: totalUsers,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(totalUsers / limitNum),
          hasPrevPage: pageNum > 1,
          nextPage: pageNum < Math.ceil(totalUsers / limitNum) ? pageNum + 1 : null,
          prevPage: pageNum > 1 ? pageNum - 1 : null
        },
        statistics: stats,
        filters: {
          role,
          search,
          dateFrom,
          dateTo,
          sort
        }
      }
    });

  } catch (error: any) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
