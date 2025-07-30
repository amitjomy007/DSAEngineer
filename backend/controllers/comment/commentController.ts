import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../../models/comments';
import CommentVote from '../../models/commentVote';
const User = require("../../models/user");
const Problem = require("../../models/problem");



interface CommentWithVotes {
    _id: mongoose.Types.ObjectId;
    problemId: mongoose.Types.ObjectId;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
        _id: mongoose.Types.ObjectId;
        firstname: string;
        lastname: string;
    };
    upvotes: number;
    downvotes: number;
    netVotes: number;
}

interface ReplyCount {
    _id: mongoose.Types.ObjectId;
    replyCount: number;
}


// Add a new comment or reply
export const addCommentControl = async (req: any, res: any) => {
    try {
        let { slug, authorId, body, parentId } = req.body;
        authorId = authorId.trim().replace(/^"+|"+$/g, "");
        if (!slug || !authorId || !body) {
            return res.status(400).json({
                success: false,
                message: "Slug, Author ID, and body are required"
            });
        }

        // Lookup problemId by slug
        const problem = await Problem.findOne({ titleSlug: slug });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }
        const problemId = problem._id;

        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                return res.status(404).json({
                    success: false,
                    message: "Parent comment not found"
                });
            }

            let processedBody = body;
            if (parentComment.parentId) {
                const parentAuthor = await User.findById(parentComment.authorId).select('firstname');
                if (parentAuthor && !body.startsWith('@')) {
                    processedBody = `@${parentAuthor.firstname} ${body}`;
                }
            }

            const newReply = new Comment({
                problemId,
                authorId,
                body: processedBody,
                parentId
            });

            await newReply.save();

            const populatedReply = await Comment.findById(newReply._id)
                .populate('authorId', 'firstname lastname')
                .populate('parentId', 'authorId');

            return res.status(201).json({
                success: true,
                message: "Reply added successfully",
                comment: populatedReply
            });

        } else {
            const newComment = new Comment({
                problemId,
                authorId,
                body
            });

            await newComment.save();

            const populatedComment = await Comment.findById(newComment._id)
                .populate('authorId', 'firstname lastname');

            return res.status(201).json({
                success: true,
                message: "Comment added successfully",
                comment: populatedComment
            });
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get comments for a problem with reply counts
export const getCommentsControl = async (req: any, res: any) => {
    try {
        const { slug } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required"
            });
        }

        const problem = await Problem.findOne({ titleSlug: slug });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }
        const problemId = problem._id;

        // Fetch comments as before using problemId
        const comments = await Comment.aggregate([
            {
                $match: {
                    problemId: new mongoose.Types.ObjectId(problemId),
                    parentId: null
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $lookup: {
                    from: 'commentvotes',
                    localField: '_id',
                    foreignField: 'commentId',
                    as: 'votes'
                }
            },
            {
                $addFields: {
                    author: { $arrayElemAt: ['$author', 0] },
                    upvotes: {
                        $size: {
                            $filter: {
                                input: '$votes',
                                cond: { $eq: ['$$this.vote', 1] }
                            }
                        }
                    },
                    downvotes: {
                        $size: {
                            $filter: {
                                input: '$votes',
                                cond: { $eq: ['$$this.vote', -1] }
                            }
                        }
                    },
                    netVotes: {
                        $subtract: [
                            {
                                $size: {
                                    $filter: {
                                        input: '$votes',
                                        cond: { $eq: ['$$this.vote', 1] }
                                    }
                                }
                            },
                            {
                                $size: {
                                    $filter: {
                                        input: '$votes',
                                        cond: { $eq: ['$$this.vote', -1] }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    problemId: 1,
                    body: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'author.firstname': 1,
                    'author.lastname': 1,
                    'author._id': 1,
                    upvotes: 1,
                    downvotes: 1,
                    netVotes: 1
                }
            },
            { $sort: { netVotes: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const commentIds = comments.map((comment: CommentWithVotes) => comment._id);
        const replyCounts = await Comment.aggregate([
            {
                $match: {
                    parentId: { $in: commentIds }
                }
            },
            {
                $group: {
                    _id: '$parentId',
                    replyCount: { $sum: 1 }
                }
            }
        ]);

        const commentsWithReplyCounts = comments.map((comment: CommentWithVotes) => {
            const replyCount = replyCounts.find((rc: ReplyCount) => rc._id.toString() === comment._id.toString());
            return {
                ...comment,
                replyCount: replyCount ? replyCount.replyCount : 0
            };
        });

        const totalComments = await Comment.countDocuments({
            problemId: new mongoose.Types.ObjectId(problemId),
            parentId: null
        });

        return res.status(200).json({
            success: true,
            comments: commentsWithReplyCounts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasNext: page < Math.ceil(totalComments / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get replies for a specific comment (no changes needed here)
export const getRepliesControl = async (req: any, res: any) => {
    try {
        const { commentId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: "Comment ID is required"
            });
        }

        const replies = await Comment.aggregate([
            {
                $match: {
                    parentId: new mongoose.Types.ObjectId(commentId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $lookup: {
                    from: 'commentvotes',
                    localField: '_id',
                    foreignField: 'commentId',
                    as: 'votes'
                }
            },
            {
                $addFields: {
                    author: { $arrayElemAt: ['$author', 0] },
                    upvotes: {
                        $size: {
                            $filter: {
                                input: '$votes',
                                cond: { $eq: ['$$this.vote', 1] }
                            }
                        }
                    },
                    downvotes: {
                        $size: {
                            $filter: {
                                input: '$votes',
                                cond: { $eq: ['$$this.vote', -1] }
                            }
                        }
                    },
                    netVotes: {
                        $subtract: [
                            {
                                $size: {
                                    $filter: {
                                        input: '$votes',
                                        cond: { $eq: ['$$this.vote', 1] }
                                    }
                                }
                            },
                            {
                                $size: {
                                    $filter: {
                                        input: '$votes',
                                        cond: { $eq: ['$$this.vote', -1] }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    problemId: 1,
                    parentId: 1,
                    body: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'author.firstname': 1,
                    'author.lastname': 1,
                    'author._id': 1,
                    upvotes: 1,
                    downvotes: 1,
                    netVotes: 1
                }
            },
            { $sort: { createdAt: 1 } }, // Replies sorted by creation time (oldest first)
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalReplies = await Comment.countDocuments({
            parentId: new mongoose.Types.ObjectId(commentId)
        });

        return res.status(200).json({
            success: true,
            replies,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalReplies / limit),
                totalReplies,
                hasNext: page < Math.ceil(totalReplies / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching replies:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// Vote on a comment (no changes needed here)
export const voteCommentControl = async (req: any, res: any) => {
    try {
        let { userId, commentId, vote } = req.body;
        
        // Clean userId and commentId like you do in addCommentControl
        userId = userId.trim().replace(/^"+|"+$/g, "");
        commentId = commentId.trim().replace(/^"+|"+$/g, "");

        if (!userId || !commentId || ![1, -1].includes(vote)) {
            return res.status(400).json({
                success: false,
                message: "User ID, Comment ID, and valid vote (1 or -1) are required"
            });
        }

        // Validate ObjectId format before using
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or Comment ID format"
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const existingVote = await CommentVote.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            commentId: new mongoose.Types.ObjectId(commentId)
        });

        if (existingVote) {
            if (existingVote.vote === vote) {
                await CommentVote.deleteOne({ _id: existingVote._id });
                return res.status(200).json({
                    success: true,
                    message: "Vote removed",
                    action: "removed"
                });
            } else {
                existingVote.vote = vote;
                await existingVote.save();
                return res.status(200).json({
                    success: true,
                    message: "Vote updated",
                    action: "updated",
                    vote: vote
                });
            }
        } else {
            const newVote = new CommentVote({
                userId: new mongoose.Types.ObjectId(userId),
                commentId: new mongoose.Types.ObjectId(commentId),
                vote
            });
            await newVote.save();

            return res.status(201).json({
                success: true,
                message: "Vote added",
                action: "added",
                vote: vote
            });
        }

    } catch (error) {
        console.error("Error voting on comment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

