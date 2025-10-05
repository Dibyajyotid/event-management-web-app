"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send } from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  likes: string[];
  replies?: Comment[];
  createdAt: string;
}

interface EventCommentsProps {
  eventId: string;
}

export function EventComments({ eventId }: EventCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/social/events/${eventId}/comments`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/social/events/${eventId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleSubmitReply = async (
    e: React.FormEvent,
    parentCommentId: string
  ) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/social/events/${eventId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: replyContent,
            parentComment: parentCommentId,
          }),
        }
      );

      if (response.ok) {
        setReplyContent("");
        setReplyTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/social/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this event..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button type="submit" disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="space-y-3">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.user.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {comment.user.firstName[0]}
                      {comment.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.user.firstName} {comment.user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                          user && comment.likes.includes(user._id)
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                        {comment.likes.length}
                      </button>
                      {user && (
                        <button
                          onClick={() =>
                            setReplyTo(
                              replyTo === comment._id ? null : comment._id
                            )
                          }
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Reply
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment._id && (
                      <form
                        onSubmit={(e) => handleSubmitReply(e, comment._id)}
                        className="space-y-2 ml-4"
                      >
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            disabled={!replyContent.trim()}
                          >
                            Reply
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setReplyTo(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="flex space-x-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={reply.user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback className="text-xs">
                                {reply.user.firstName[0]}
                                {reply.user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-xs">
                                    {reply.user.firstName} {reply.user.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs">{reply.content}</p>
                              </div>
                              <button
                                onClick={() => handleLikeComment(reply._id)}
                                className={`flex items-center gap-1 text-xs mt-1 hover:text-red-500 transition-colors ${
                                  user && reply.likes.includes(user._id)
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                <Heart className="h-3 w-3" />
                                {reply.likes.length}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
