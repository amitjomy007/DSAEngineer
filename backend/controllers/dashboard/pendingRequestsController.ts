const PendingRequest = require("../../models/pendingRequests");

interface RequestsQuery {
  page?: string;
  limit?: string;
  status?: string;
  requestType?: string;
  requestedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}

export const getRequestsData = async (req: any, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      status = '',
      requestType = '',
      requestedBy = '',
      dateFrom = '',
      dateTo = '',
      sort = '-createdAt'
    } = req.query as RequestsQuery;

    // Convert and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter - Super Admin sees ALL requests
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (requestType) {
      filter.requestType = requestType;
    }
    
    if (requestedBy) {
      filter.requestedBy = requestedBy;
    }

    // Date range filter for request creation
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    console.log("🔍 Pending requests filter for Super Admin:", filter);

    // Execute queries in parallel
    const [requests, totalRequests] = await Promise.all([
      PendingRequest.find(filter)
        .populate('requestedBy', 'firstname lastname email role')
        .populate('reviewedBy', 'firstname lastname email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      
      PendingRequest.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalRequests / limitNum),
      totalItems: totalRequests,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < Math.ceil(totalRequests / limitNum),
      hasPrevPage: pageNum > 1,
      nextPage: pageNum < Math.ceil(totalRequests / limitNum) ? pageNum + 1 : null,
      prevPage: pageNum > 1 ? pageNum - 1 : null
    };

    // Get request statistics - Super Admin sees all request stats
    const stats = {
      totalRequests: totalRequests,
      pendingRequests: await PendingRequest.countDocuments({ status: 'pending' }),
      approvedRequests: await PendingRequest.countDocuments({ status: 'approved' }),
      rejectedRequests: await PendingRequest.countDocuments({ status: 'rejected' }),
      todaysRequests: await PendingRequest.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      requestTypes: await PendingRequest.distinct('requestType'),
      averageProcessingTime: await calculateAverageProcessingTime()
    };

    res.status(200).json({
      success: true,
      message: 'Pending requests fetched successfully for Super Admin',
      data: {
        requests: requests,
        pagination: pagination,
        statistics: stats,
        filters: {
          status,
          requestType,
          requestedBy,
          dateFrom,
          dateTo,
          sort
        }
      }
    });

  } catch (error: any) {
    console.error('Pending requests fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to calculate average processing time
async function calculateAverageProcessingTime() {
  try {
    const processedRequests = await PendingRequest.find({
      status: { $in: ['approved', 'rejected'] },
      reviewedAt: { $exists: true }
    }).select('createdAt reviewedAt');

    if (processedRequests.length === 0) {
      return 0;
    }

    const totalProcessingTime = processedRequests.reduce((total:any, request:any) => {
      const processingTime = new Date(request.reviewedAt).getTime() - new Date(request.createdAt).getTime();
      return total + processingTime;
    }, 0);

    // Return average processing time in hours
    return Math.round((totalProcessingTime / processedRequests.length) / (1000 * 60 * 60) * 100) / 100;
  } catch (error) {
    console.error('Error calculating average processing time:', error);
    return 0;
  }
}
