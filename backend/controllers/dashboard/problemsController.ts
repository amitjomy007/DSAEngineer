const Problem = require("../../models/problem");

interface ProblemsQuery {
  page?: string;
  limit?: string;
  difficulty?: string;
  isApproved?: string;
  authorId?: string;
  tags?: string;
  search?: string;
  sort?: string;
}

export const getProblemsData = async (req: any, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      difficulty = '',
      isApproved = '',
      authorId = '',
      tags = '',
      search = '',
      sort = '-problemCreatedDate'
    } = req.query as ProblemsQuery;

    // Convert and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter - Super Admin sees ALL problems
    const filter: any = {};
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (isApproved !== '') {
      filter.isApproved = isApproved === 'true';
    }
    
    if (authorId) {
      filter.problemAuthorId = authorId;
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log("🔍 Problems filter for Super Admin:", filter);

    // Execute queries in parallel
    const [problems, totalProblems] = await Promise.all([
      Problem.find(filter)
        .populate('problemAuthorId', 'firstname lastname email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-testcases -__v'), // Exclude heavy fields
      
      Problem.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalProblems / limitNum),
      totalItems: totalProblems,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < Math.ceil(totalProblems / limitNum),
      hasPrevPage: pageNum > 1,
      nextPage: pageNum < Math.ceil(totalProblems / limitNum) ? pageNum + 1 : null,
      prevPage: pageNum > 1 ? pageNum - 1 : null
    };

    // Get problem statistics - Super Admin sees all stats
    const stats = {
      totalProblems: totalProblems,
      approvedProblems: await Problem.countDocuments({ isApproved: true }),
      pendingProblems: await Problem.countDocuments({ isApproved: false }),
      easyProblems: await Problem.countDocuments({ difficulty: 'Easy' }),
      mediumProblems: await Problem.countDocuments({ difficulty: 'Medium' }),
      hardProblems: await Problem.countDocuments({ difficulty: 'Hard' }),
      allTags: await Problem.distinct('tags'),
      allDifficulties: await Problem.distinct('difficulty')
    };

    res.status(200).json({
      success: true,
      message: 'Problems data fetched successfully for Super Admin',
      data: {
        problems: problems,
        pagination: pagination,
        statistics: stats,
        filters: {
          difficulty,
          isApproved,
          authorId,
          tags,
          search,
          sort
        }
      }
    });

  } catch (error: any) {
    console.error('Problems fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
