const AuditLog = require("../../models/audits");

interface LogsQuery {
  page?: string;
  limit?: string;
  action?: string;
  targetType?: string;
  performedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}

export const getLogsData = async (req: any, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      action = '',
      targetType = '',
      performedBy = '',
      dateFrom = '',
      dateTo = '',
      sort = '-timestamp'
    } = req.query as LogsQuery;

    // Convert and validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter - Super Admin sees ALL logs
    const filter: any = {};
    
    if (action) {
      filter.action = { $regex: action, $options: 'i' };
    }
    
    if (targetType) {
      filter.targetType = targetType;
    }
    
    if (performedBy) {
      filter.performedBy = performedBy;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.timestamp = {};
      if (dateFrom) {
        filter.timestamp.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.timestamp.$lte = new Date(dateTo);
      }
    }

    console.log("🔍 Audit logs filter for Super Admin:", filter);

    // Execute queries in parallel
    const [logs, totalLogs] = await Promise.all([
      AuditLog.find(filter)
        .populate('performedBy', 'firstname lastname email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      
      AuditLog.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalLogs / limitNum),
      totalItems: totalLogs,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < Math.ceil(totalLogs / limitNum),
      hasPrevPage: pageNum > 1,
      nextPage: pageNum < Math.ceil(totalLogs / limitNum) ? pageNum + 1 : null,
      prevPage: pageNum > 1 ? pageNum - 1 : null
    };

    // Get log statistics - Super Admin sees all log stats
    const stats = {
      totalLogs: totalLogs,
      todaysLogs: await AuditLog.countDocuments({
        timestamp: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      thisWeekLogs: await AuditLog.countDocuments({
        timestamp: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }),
      actionTypes: await AuditLog.distinct('action'),
      targetTypes: await AuditLog.distinct('targetType'),
      reversibleActions: await AuditLog.countDocuments({ reversible: true }),
      irreversibleActions: await AuditLog.countDocuments({ reversible: false })
    };

    res.status(200).json({
      success: true,
      message: 'Audit logs fetched successfully for Super Admin',
      data: {
        logs: logs,
        pagination: pagination,
        statistics: stats,
        filters: {
          action,
          targetType,
          performedBy,
          dateFrom,
          dateTo,
          sort
        }
      }
    });

  } catch (error: any) {
    console.error('Audit logs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
