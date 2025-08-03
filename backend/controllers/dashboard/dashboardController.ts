import { Request, Response } from "express";
const User = require("../../models/user");
const Problem = require("../../models/problem");
// const PendingRequest = require("../models/pendingRequest"); // Uncomment when created
// const AuditLog = require("../models/auditLog"); // Uncomment when created

interface AuthenticatedRequest extends Request {
  user?: any;
}

type UserRole = "super_admin" | "admin" | "problem_setter" | "user";

interface RolePermissions {
  canViewLogs: boolean;
  canManageUsers: boolean;
  canManageProblems: boolean;
  canApproveRequests: boolean;
  canCreateProblems: boolean;
  canDeletePermanently: boolean;
}

interface RoleConfiguration {
  defaultTab: string | null;
  availableTabs: string[];
  permissions: RolePermissions;
}

export const getDashboard = async (req: any, res: any) => {
  try {
    // Get user from JWT token (already verified by middleware)
    const userId = req.user.id || req.user._id;

    // Fetch complete user data from database to get current role
    const user = await User.findById(userId).select("-password -token -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userRole = user.role;

    // Define role-based default tabs and permissions
    const roleConfig = getRoleConfiguration(userRole);

    if (!roleConfig) {
      return res.status(403).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // Fetch default tab data based on role
    const defaultTabData = await getDefaultTabData(userRole, userId);

    res.status(200).json({
      success: true,
      message: "Dashboard initialized successfully",
      data: {
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        roleConfig: roleConfig,
        defaultTab: roleConfig.defaultTab,
        defaultTabData: defaultTabData,
      },
    });
  } catch (error: any) {
    console.error("Dashboard initialization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Fixed function with proper typing
function getRoleConfiguration(role: string): RoleConfiguration | null {
  const configs: Record<UserRole, RoleConfiguration> = {
    super_admin: {
      defaultTab: "requests",
      availableTabs: ["requests", "logs", "problems", "users", "add-problems"],
      permissions: {
        canViewLogs: true,
        canManageUsers: true,
        canManageProblems: true,
        canApproveRequests: true,
        canCreateProblems: true,
        canDeletePermanently: true,
      },
    },
    admin: {
      defaultTab: "requests",
      availableTabs: ["requests", "logs", "problems", "users", "add-problems"],
      permissions: {
        canViewLogs: true,
        canManageUsers: true,
        canManageProblems: true,
        canApproveRequests: false,
        canCreateProblems: true,
        canDeletePermanently: false,
      },
    },
    problem_setter: {
      defaultTab: "add-problems",
      availableTabs: ["add-problems", "problems"],
      permissions: {
        canViewLogs: false,
        canManageUsers: false,
        canManageProblems: false,
        canApproveRequests: false,
        canCreateProblems: true,
        canDeletePermanently: false,
      },
    },
    user: {
      defaultTab: null,
      availableTabs: [],
      permissions: {
        canViewLogs: false,
        canManageUsers: false,
        canManageProblems: false,
        canApproveRequests: false,
        canCreateProblems: false,
        canDeletePermanently: false,
      },
    },
  };

  // Type guard to check if role is a valid UserRole
  if (role in configs) {
    return configs[role as UserRole];
  }

  return null;
}

// Fetch data for the default tab based on role
// Fix the getDefaultTabData function in dashboardController.ts
async function getDefaultTabData(role: string, userId: string) {
  const page = 1;
  const limit = 10;

  switch (role) {
    case 'super_admin':
    case 'admin':
      // Return empty for requests since models don't exist yet
      return { items: [], pagination: null };

    case 'problem_setter':
      // Problem setters see only their own problems
      return await getUserProblemsData(userId, page, limit);

    default:
      return null;
  }
}

// Helper function to get user's problems
async function getUserProblemsData(
  userId: string,
  page: number,
  limit: number
) {
  try {
    const skip = (page - 1) * limit;

    const [problems, totalProblems] = await Promise.all([
      Problem.find({ problemAuthorId: userId })
        .sort("-problemCreatedDate")
        .skip(skip)
        .limit(limit)
        .select("-testcases -__v"),

      Problem.countDocuments({ problemAuthorId: userId }),
    ]);

    return {
      items: problems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProblems / limit),
        totalItems: totalProblems,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(totalProblems / limit),
        hasPrevPage: page > 1,
      },
    };
  } catch (error: any) {
    console.error("Error fetching user problems:", error);
    return { items: [], pagination: null };
  }
}
