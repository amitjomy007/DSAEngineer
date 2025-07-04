const Problem = require("../../models/problem"); // Adjust path

/**
 * @route   GET /api/problems/:slug
 * @desc    Get a single approved problem by its titleSlug with all aggregated data
 * @access  Public (or Private, depending on auth)
 */
export const getProblemControl = async (req: any, res: any) => {
  try {
    // --- 1. INPUT VALIDATION & PREPARATION ---
    console.log("reqparam:", req.params);
    const slug = req.params.slug;
    console.log("Slug is : ", slug);
    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Problem slug is required." });
    }

    // Get the current user's ID from the request (from your auth middleware)
    const userId = req.headers["user-id"];
    console.log("user id: ", userId);

    // --- 2. MONGODB AGGREGATION PIPELINE ---
    const pipeline = [
      // STAGE 1: Match the specific problem by its slug.
      // This is the most important step for performance. We also ensure it's approved.
      {
        $match: {
          titleSlug: slug,
          // isApproved: true,       //this condition is not necessary ig
        },
      },
      // Add a limit of 1, as a safeguard, since slug should be unique.
      { $limit: 1 },

      // STAGE 2: Lookups - Join with other collections.
      // These are identical to the getProblems controller but will only run for the single matched problem.
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "problemId",
          as: "submissions",
        },
      },
      {
        $lookup: {
          from: "problemupvotes",
          localField: "_id",
          foreignField: "problemId",
          as: "upvotes",
        },
      },
      {
        $lookup: {
          from: "problemdownvotes",
          localField: "_id",
          foreignField: "problemId",
          as: "downvotes",
        },
      },
      // STAGE 3: Lookup the Editorial for the problem.
      {
        $lookup: {
          from: "editorials", // Mongoose collection name for the Editorial model
          localField: "editorialId",
          foreignField: "_id",
          as: "editorial",
        },
      },

      // STAGE 4: Data Shaping & Aggregation with $addFields
      {
        $addFields: {
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
          upvoteCount: { $size: "$upvotes" },
          downvoteCount: { $size: "$downvotes" },
          userProblemStatus: {
            $cond: {
              if: { $not: [userId] },
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
                                  in: { $eq: ["$$sub.verdict", "Accepted"] },
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
          userVoteStatus: {
            $cond: {
              if: { $not: [userId] },
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
          // Convert the editorial array (which should have 0 or 1 elements) into an object or null.
          editorial: { $arrayElemAt: ["$editorial", 0] },
        },
      },

      // STAGE 5: Final Projection ($project)
      // Clean up the output to only send necessary fields.
      // As requested, we remove the submissions array.
      {
        $project: {
          submissions: 0,
          upvotes: 0,
          downvotes: 0,
        },
      },
    ];

    // --- 3. EXECUTE THE PIPELINE ---
    const results = await Problem.aggregate(pipeline);
    //console.log("result from aggreagate: ", results);
    // --- 4. SEND THE RESPONSE ---
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Problem not found or is not approved.",
      });
    }

    // The result is an array with a single element
    const problem = results[0];
    //console.log("Sending response: ", problem);
    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem: problem,
    });
  } catch (error) {
    console.error(
      `Error fetching problem by slug (${req.params.slug}):`,
      error
    );
    //console.log("SEnding response: ", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the problem.",
      error: error,
    });
  }
};
