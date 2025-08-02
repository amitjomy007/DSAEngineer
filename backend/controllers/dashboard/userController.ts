const User = require("../../models/user");

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

    // Convert and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter - Super Admin sees ALL users
    const filter: any = {};
    
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

    // Date range filter for user registration
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
        .select('-password -token -__v'), // Exclude sensitive fields
      
      User.countDocuments(filter)
    ]);
 

    // Calculate pagination metadata
    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum),
      totalItems: totalUsers,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < Math.ceil(totalUsers / limitNum),
      hasPrevPage: pageNum > 1,
      nextPage: pageNum < Math.ceil(totalUsers / limitNum) ? pageNum + 1 : null,
      prevPage: pageNum > 1 ? pageNum - 1 : null
    };

    // Get user statistics - Super Admin sees all user stats
    const stats = {
      totalUsers: totalUsers,
      superAdmins: await User.countDocuments({ role: 'super_admin' }),
      admins: await User.countDocuments({ role: 'admin' }),
      problemSetters: await User.countDocuments({ role: 'problem_setter' }),
      regularUsers: await User.countDocuments({ role: 'user' }),
      newUsersThisMonth: await User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      allRoles: await User.distinct('role')
    };

    res.status(200).json({
      success: true,
      message: 'Users data fetched successfully for Super Admin',
      data: {
        users: users,
        pagination: pagination,
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
