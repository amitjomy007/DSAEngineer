/**
 * problem.controller.js
 * * This file contains the controller logic for fetching problems.
 * It uses a sophisticated MongoDB aggregation pipeline for high performance
 * and to prevent the N+1 query problem.
 */

const mongoose = require("mongoose");
const Problem = require("../../models/problem");
// const Submission = require("../models/submission"); // Adjust path as needed
// const ProblemUpVote = require("../models/problemUpVote"); // Adjust path as needed
// const ProblemDownVote = require("../models/problemDownVote"); // Adjust path as needed

/**
 * @route   GET /api/problems
 * @desc    Get a paginated list of approved problems with aggregated data
 * @access  Public (or Private, depending on your auth middleware)
 * @query   page - The page number to fetch (defaults to 1)
 * @query   limit - The number of problems per page (defaults to 9)
 * * This controller fetches problems and, for each problem, aggregates:
 * - Total successful and failed submission counts.
 * - Upvote and downvote counts.
 * - The current user's status on the problem (solved, attempted, unattempted).
 * - The current user's vote status (upvoted, downvoted, or none).
 */
export const getProblemsControl = async (req: any, res: any) => {
  try {
    // --- 1. INPUT VALIDATION & PREPARATION ---

    // Get the current user's ID from the request.
    // ASSUMPTION: Your authentication middleware attaches the user object to `req`.
    // If the user is not logged in, we can proceed without user-specific data.
    const userId = req.headers["user-id"];

    // Sanitize and get pagination parameters from query string
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    // --- 2. MONGODB AGGREGATION PIPELINE ---
    // This pipeline is the core of the logic. It performs all data fetching
    // and processing in a single, efficient database query.

    const pipeline = [
      // STAGE 1: Filter for approved problems only.
      // This is the most important first step for performance.
      {
        $match: { isApproved: true },
      },

      // STAGE 2: Sort problems. Here, we sort by problemNumber.
      // You could also sort by creation date or difficulty.
      {
        $sort: { problemNumber: 1 },
      },

      // STAGE 3: Handle pagination (Skip and Limit)
      // We use $facet to run two parallel operations:
      // 1. Get the total count of all approved problems (for pagination metadata).
      // 2. Get the paginated subset of problems for the current page.
      {
        $facet: {
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                page: page,
                totalPages: { $ceil: { $divide: ["$total", limit] } },
              },
            },
          ],
          data: [
            { $skip: skip },
            { $limit: limit },

            // STAGE 4: Lookups - Join with other collections
            // We use $lookup to pull in related data from other collections.
            {
              $lookup: {
                from: "submissions", // The actual collection name in MongoDB
                localField: "_id",
                foreignField: "problemId",
                as: "submissions",
              },
            },
            {
              $lookup: {
                from: "problemupvotes", // Collection name for upvotes
                localField: "_id",
                foreignField: "problemId",
                as: "upvotes",
              },
            },
            {
              $lookup: {
                from: "problemdownvotes", // Collection name for downvotes
                localField: "_id",
                foreignField: "problemId",
                as: "downvotes",
              },
            },

            // STAGE 5: Data Shaping & Aggregation with $addFields
            // This is where we compute all the counts and user-specific statuses.
            {
              $addFields: {
                // --- Submission Counts ---
                successfulSubmissionCount: {
                  $size: {
                    $filter: {
                      input: "$submissions",
                      as: "sub",
                      cond: { $eq: ["$$sub.verdict", "Accepted"] },
                    },
                  },
                },
                failedSubmissionCount: {
                  $size: {
                    $filter: {
                      input: "$submissions",
                      as: "sub",
                      cond: { $ne: ["$$sub.verdict", "Accepted"] },
                    },
                  },
                },

                // --- Vote Counts ---
                upvoteCount: { $size: "$upvotes" },
                downvoteCount: { $size: "$downvotes" },

                // --- User-Specific Status (Problem) ---
                // This logic determines if the current user has solved, attempted, or not attempted the problem.
                userProblemStatus: {
                  $cond: {
                    if: { $not: [userId] }, // If user is not logged in
                    then: "unattempted",
                    else: {
                      $let: {
                        vars: {
                          userSubmissions: {
                            $filter: {
                              input: "$submissions",
                              as: "sub",
                              cond: { $eq: ["$$sub.userId", userId] },
                            },
                          },
                        },
                        in: {
                          $cond: {
                            if: { $eq: [{ $size: "$$userSubmissions" }, 0] },
                            then: "unattempted",
                            else: {
                              $cond: {
                                if: {
                                  $anyElementTrue: [
                                    {
                                      $map: {
                                        input: "$$userSubmissions",
                                        as: "sub",
                                        in: {
                                          $eq: ["$$sub.verdict", "Accepted"],
                                        },
                                      },
                                    },
                                  ],
                                },
                                then: "solved",
                                else: "attempted",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                // --- User-Specific Status (Vote) ---
                // This logic determines if the current user has upvoted, downvoted, or not voted.
                userVoteStatus: {
                  $cond: {
                    if: { $not: [userId] }, // If user is not logged in
                    then: "none",
                    else: {
                      $cond: {
                        if: { $in: [userId, "$upvotes.userId"] },
                        then: "upvoted",
                        else: {
                          $cond: {
                            if: { $in: [userId, "$downvotes.userId"] },
                            then: "downvoted",
                            else: "none",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },

            // STAGE 6: Final Projection ($project)
            // Clean up the output to only send necessary fields.
            // We remove the large arrays we looked up earlier.
            {
              $project: {
                // Exclude fields we don't need to send to the client
                submissions: 0,
                upvotes: 0,
                downvotes: 0,
                // You can also explicitly exclude other large fields if not needed on the list page
                // For example: testcases: 0, editorialId: 0
              },
            },
          ],
        },
      },
    ];

    // --- 3. EXECUTE THE PIPELINE ---
    const results = await Problem.aggregate(pipeline);
    
    // The result from a $facet pipeline is an array containing the faceted results.
    const problems = results[0].data;
    const metadata = results[0].metadata[0] || {
      total: 0,
      page: 1,
      totalPages: 0,
    };

    // If no problems are found for the page, `data` will be empty.
    // `metadata` might also be empty if there are no approved problems at all.

    // --- 4. SEND THE RESPONSE ---
    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems: problems,
      pagination: {
        totalProblems: metadata.total,
        currentPage: metadata.page,
        totalPages: metadata.totalPages,
        hasNextPage: metadata.page < metadata.totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching problems.",
      error: error,
    });
  }
};
