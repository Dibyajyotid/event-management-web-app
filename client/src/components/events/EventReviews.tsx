"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/types/eventTypes";
import { toast } from "sonner";

interface EventReviewsProps {
  event: Event;
}

export function EventReviews({ event }: EventReviewsProps) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState(event.ratings || []);
  const [averageRating, setAverageRating] = useState(event.averageRating);
  const [totalRatings, setTotalRatings] = useState(event.totalRatings);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const StarRating = ({
    value,
    onChange,
    readonly = false,
  }: {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          } ${!readonly ? "cursor-pointer" : ""}`}
          onClick={() => !readonly && onChange && onChange(star)}
        />
      ))}
    </div>
  );

  const handleSubmitReview = async () => {
    if (!user || rating === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (response.ok) {
        const newReview = await response.json(); // backend should return the new review
        setReviews((prev) => [newReview, ...prev]);
        setTotalRatings((prev) => prev + 1);
        setAverageRating(
          (prevAvg) =>
            (prevAvg * reviews.length + rating) / (reviews.length + 1)
        );

        setShowReviewForm(false);
        setRating(0);
        setComment("");

        toast.success("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write Review
            </Button>
          )}
        </div>
        {totalRatings > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(averageRating)} readonly />
              <span className="text-lg font-semibold">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-muted-foreground">
              ({totalRatings} reviews)
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {showReviewForm && (
          <div className="p-4 border rounded-lg space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Review
              </label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={loading || rating === 0}
              >
                Submit Review
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="flex gap-4 p-4 border rounded-lg"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {review.user.firstName[0]}
                    {review.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet. Be the first to review this event!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
