// controllers/profileController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const User = require('../../models/user');
// The Problem and Submission models are used implicitly by the aggregation pipeline
// const Problem = require('../../models/problem');
// const Submission = require('../../models/submissions');


export const getProfileDetails = async (req: any, res: any) => {
  try {
    // Extract profile owner's userId from params
    const profileUserId = req.params.userId;
    
    // Extract viewing user's userId from headers (to determine if it's their own profile)
    const viewingUserId = req.headers['user-id'] as string;
    
    if (!mongoose.Types.ObjectId.isValid(profileUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // This pipeline gathers all necessary raw data for the frontend.
    // Calculations for solved problem stats (difficulty, tags) are offloaded to the client.
    const pipeline = [
      // Stage 1: Match the specific user
      { 
        $match: { _id: new mongoose.Types.ObjectId(profileUserId) } 
      },
      
      // Stage 2: Lookup all submissions for the user
      { 
        $lookup: { 
          from: "submissions", 
          localField: "_id", 
          foreignField: "userId", 
          as: "userSubmissions" 
        } 
      },

      // Stage 3: Use $facet for efficient, parallel aggregation of different data points
      {
        $facet: {
          // Pipeline 1: Get the base user document fields, excluding sensitive info and unused arrays
          userDetails: [
            { $project: { password: 0, token: 0, solvedProblems: 0, attemptedProblems: 0, bookmarkedProblems: 0 } }
          ],
          
          // Pipeline 2: Calculate all general submission statistics
          submissionStats: [
            { $unwind: { path: "$userSubmissions", preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: null,
                totalSubmissions: { $sum: { $cond: [{ $ne: ["$userSubmissions", null] }, 1, 0] } },
                acceptedSubmissionsCount: { $sum: { $cond: [{ $eq: ["$userSubmissions.verdict", "Accepted"] }, 1, 0] } },
                languageCounts: { $push: "$userSubmissions.language" },
                verdictCounts: { $push: "$userSubmissions.verdict" },
                acceptedSubsDetails: { $push: { $cond: [ { $eq: ["$userSubmissions.verdict", "Accepted"] }, "$userSubmissions", "$$REMOVE" ] } }
              }
            },
            {
              $project: {
                _id: 0,
                totalSubmissions: 1,
                acceptedSubmissions: "$acceptedSubmissionsCount",
                averageRuntime: { $avg: "$acceptedSubsDetails.runtimeMs" },
                averageMemory: { $avg: "$acceptedSubsDetails.memoryKb" },
                languageStats: { $arrayToObject: { $map: { input: { $setUnion: ["$languageCounts"] }, as: "lang", in: { k: "$$lang", v: { $size: { $filter: { input: "$languageCounts", cond: { $eq: ["$$this", "$$lang"] } } } } } } } },
                verdictStats: { $arrayToObject: { $map: { input: { $setUnion: ["$verdictCounts"] }, as: "verdict", in: { k: { $ifNull: ["$$verdict", "Other"] }, v: { $size: { $filter: { input: "$verdictCounts", cond: { $eq: ["$$this", "$$verdict"] } } } } } } } }
              }
            }
          ],
          
          // Pipeline 3: Get the full details of all uniquely solved problems for frontend calculation
          solvedProblemsDetails: [
            { $unwind: "$userSubmissions" },
            { $match: { "userSubmissions.verdict": "Accepted" } },
            { $group: { _id: "$userSubmissions.problemId" } }, // Get unique problem IDs solved
            { $lookup: { from: "problems", localField: "_id", foreignField: "_id", as: "problemDoc" } },
            { $unwind: "$problemDoc" },
            { $replaceRoot: { newRoot: "$problemDoc" } }
          ],
          
          // Pipeline 4: Generate data for the submission activity calendar
          submissionCalendar: [
            { $unwind: "$userSubmissions" },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$userSubmissions.submittedAt" } }, count: { $sum: 1 } } },
            { $project: { _id: 0, date: "$_id", count: "$count" } },
            { $sort: { date: 1 } }
          ],
        }
      },
      
      // Stage 4: Merge results from all facets into a single, clean document
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $arrayElemAt: ["$userDetails", 0] },
              { $arrayElemAt: ["$submissionStats", 0] },
              { solvedProblemsDetails: "$solvedProblemsDetails" }, // This is the crucial new field
              { submissionCalendar: "$submissionCalendar" }
            ]
          }
        }
      },

      // Stage 5: Add final calculated fields and the recent submissions list
      {
        $addFields: {
          fullName: { $concat: ["$firstname", " ", "$lastname"] },
          isOwnProfile: { $eq: [{ $toString: "$_id" }, viewingUserId] },
          recentSubmissions: { 
            $slice: [ 
              { $sortArray: { input: "$userSubmissions", sortBy: { submittedAt: -1 } } }, 
              10 
            ] 
          },
        }
      },

      // Stage 6: Final cleanup of intermediate fields
      { 
        $project: { 
          userSubmissions: 0 // This large array is no longer needed in the final response
        } 
      }
    ];

    const userStats = await User.aggregate(pipeline);

    if (!userStats || userStats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const profileData = userStats[0];
    
    // Ensure arrays and objects exist even if the user has no activity
    profileData.submissionCalendar = profileData.submissionCalendar || [];
    profileData.solvedProblemsDetails = profileData.solvedProblemsDetails || [];
    profileData.recentSubmissions = profileData.recentSubmissions || [];
    
    res.status(200).json({
      success: true,
      message: "Profile details fetched successfully",
      data: profileData
    });

  } catch (error) {
    console.log("Error fetching profile details:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching profile details."
    });
  }
};
