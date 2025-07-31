// CommentsSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./CommentsSection.css"; // We'll create this for styling
const backendUrl = import.meta.env.VITE_BACKEND_URL || "3000";
console.log("backendUrl:", backendUrl);

interface Author {
  _id: string;
  firstname: string;
  lastname: string;
}

interface Comment {
  _id: string;
  // problemId removed from here since frontend doesn't use it now
  body: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  upvotes: number;
  downvotes: number;
  netVotes: number;
  replyCount?: number;
}

interface CommentResponse {
  success: boolean;
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface RepliesResponse {
  success: boolean;
  replies: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReplies: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const CommentsSection: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [replies, setReplies] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get user info
  const userId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
  const username = Cookies.get("user31d6cfe0d16ae931b73c59d7e0c089c0");

  console.log("CommentsSection - User Info:", { userId, username, slug });

  // Fetch comments by slug
  const fetchComments = useCallback(
    async (page: number = 1) => {
      if (!slug) {
        console.log("No slug available for fetching comments");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching comments for slug:", slug, "page:", page);
        // Note: Backend should accept slug instead of problemId
        const response = await axios.get<CommentResponse>(
          `${backendUrl}/getCommentsBySlug/${slug}?page=${page}&limit=10`
        );

        console.log("Comments response:", response.data);

        if (response.data.success) {
          if (page === 1) {
            setComments(response.data.comments);
          } else {
            setComments((prev) => [...prev, ...response.data.comments]);
          }

          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);

          console.log(
            "Comments updated:",
            response.data.comments.length,
            "comments loaded"
          );
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  // Fetch replies for a comment (no change needed here)
  const fetchReplies = async (commentId: string) => {
    try {
      console.log("Fetching replies for comment:", commentId);
      const response = await axios.get<RepliesResponse>(
        `${backendUrl}/comments/getReplies/${commentId}?page=1&limit=20`
      );

      console.log("Replies response:", response.data);

      if (response.data.success) {
        setReplies((prev) => ({
          ...prev,
          [commentId]: response.data.replies,
        }));
        setShowReplies((prev) => ({
          ...prev,
          [commentId]: true,
        }));

        console.log(
          "Replies loaded for comment:",
          commentId,
          response.data.replies.length,
          "replies"
        );
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  // Add new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.log("User not logged in");
      alert("Please login to comment");
      return;
    }

    if (!newComment.trim() || !slug) {
      console.log("Missing comment text or slug");
      return;
    }

    setSubmitting(true);
    try {
      console.log("Adding comment:", {
        slug,
        authorId: userId,
        body: newComment.trim(),
      });

      const response = await axios.post(`${backendUrl}/comments/addComment`, {
        slug, // Send slug instead of problemId
        authorId: userId,
        body: newComment.trim(),
      });

      console.log("Add comment response:", response.data);

      if (response.data.success) {
        setNewComment("");
        // Refresh comments
        await fetchComments(1);
        console.log("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Add reply to comment
  const handleAddReply = async (commentId: string) => {
    if (!userId) {
      console.log("User not logged in");
      alert("Please login to reply");
      return;
    }

    const replyText = replyTexts[commentId];
    if (!replyText?.trim() || !slug) {
      console.log("Missing reply text or slug");
      return;
    }

    try {
      console.log("Adding reply:", {
        slug,
        authorId: userId,
        body: replyText.trim(),
        parentId: commentId,
      });

      const response = await axios.post(`${backendUrl}/comments/addComment`, {
        slug, // Send slug instead of problemId
        authorId: userId,
        body: replyText.trim(),
        parentId: commentId,
      });

      console.log("Add reply response:", response.data);

      if (response.data.success) {
        // Clear reply text
        setReplyTexts((prev) => ({
          ...prev,
          [commentId]: "",
        }));

        // Refresh replies for this comment
        await fetchReplies(commentId);
        console.log("Reply added successfully");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply");
    }
  };

  // Vote on comment/reply (no change needed here, as vote by commentId)
  const handleVote = async (commentId: string, vote: 1 | -1) => {
    if (!userId) {
      console.log("User not logged in");
      alert("Please login to vote");
      return;
    }

    try {
      console.log("Voting on comment:", { userId, commentId, vote });

      const response = await axios.post(`${backendUrl}/comments/voteComment`, {
        userId,
        commentId,
        vote,
      });

      console.log("Vote response:", response.data);

      if (response.data.success) {
        // Refresh comments to show updated vote counts
        await fetchComments(1);

        // Refresh replies if any are shown
        const repliesShown = Object.keys(showReplies).filter(
          (id) => showReplies[id]
        );
        for (const commentIdWithReplies of repliesShown) {
          await fetchReplies(commentIdWithReplies);
        }

        console.log(
          "Vote processed:",
          response.data.action,
          response.data.vote
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId: string) => {
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    } else {
      fetchReplies(commentId);
    }
  };

  // Load comments when slug changes
  useEffect(() => {
    if (slug) {
      console.log("Slug available, fetching comments");
      fetchComments(1);
    }
  }, [slug, fetchComments]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (!userId) {
    return (
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="login-prompt">
          <p>Please login to view and post comments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="add-comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting || !newComment.trim()}>
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {loading && comments.length === 0 ? (
          <div className="loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="author">
                  {comment.author.firstname} {comment.author.lastname}
                </span>
                <span className="timestamp">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              <div className="comment-body">{comment.body}</div>

              <div className="comment-actions">
                <button
                  onClick={() => handleVote(comment._id, 1)}
                  className="vote-btn upvote"
                >
                  ↑ {comment.upvotes}
                </button>
                <button
                  onClick={() => handleVote(comment._id, -1)}
                  className="vote-btn downvote"
                >
                  ↓ {comment.downvotes}
                </button>
                <span className="net-votes">Net: {comment.netVotes}</span>

                {comment.replyCount && comment.replyCount > 0 && (
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="toggle-replies-btn"
                  >
                    {showReplies[comment._id] ? "Hide" : "Show"}{" "}
                    {comment.replyCount} replies
                  </button>
                )}
              </div>

              {/* Reply Form */}
              <div className="reply-form">
                <textarea
                  value={replyTexts[comment._id] || ""}
                  onChange={(e) =>
                    setReplyTexts((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  rows={2}
                />
                <button
                  onClick={() => handleAddReply(comment._id)}
                  disabled={!replyTexts[comment._id]?.trim()}
                >
                  Reply
                </button>
              </div>

              {/* Replies */}
              {showReplies[comment._id] && replies[comment._id] && (
                <div className="replies-container">
                  {replies[comment._id].map((reply) => (
                    <div key={reply._id} className="reply-item">
                      <div className="comment-header">
                        <span className="author">
                          {reply.author.firstname} {reply.author.lastname}
                        </span>
                        <span className="timestamp">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>

                      <div className="comment-body">{reply.body}</div>

                      <div className="comment-actions">
                        <button
                          onClick={() => handleVote(reply._id, 1)}
                          className="vote-btn upvote"
                        >
                          ↑ {reply.upvotes}
                        </button>
                        <button
                          onClick={() => handleVote(reply._id, -1)}
                          className="vote-btn downvote"
                        >
                          ↓ {reply.downvotes}
                        </button>
                        <span className="net-votes">Net: {reply.netVotes}</span>
                      </div>

                      {/* Reply to Reply Form */}
                      <div className="reply-form">
                        <textarea
                          value={replyTexts[reply._id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({
                              ...prev,
                              [reply._id]: e.target.value,
                            }))
                          }
                          placeholder="Reply to this comment..."
                          rows={2}
                        />
                        <button
                          onClick={() => handleAddReply(reply._id)}
                          disabled={!replyTexts[reply._id]?.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Load More Comments */}
        {currentPage < totalPages && (
          <button
            onClick={() => fetchComments(currentPage + 1)}
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? "Loading..." : "Load More Comments"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
