import { useMemo } from "react";
import { Hint } from "../hint";
import { Info } from "lucide-react";

interface Props {
  isDelayed: boolean;
  isFollowersOnly: boolean;
}

export const ChatInfo = ({ isDelayed, isFollowersOnly }: Props) => {
  const hint = useMemo(() => {
    if (isDelayed && !isFollowersOnly) {
      return "Chat is delayed by 3 seconds.";
    }
    if (!isDelayed && isFollowersOnly) {
      return "Only followers can chat.";
    }
    if (isDelayed && isFollowersOnly) {
      return "Only followers can chat. Chat is delayed by 3 seconds.";
    }
    return "";
  }, [isDelayed, isFollowersOnly]);

  const label = useMemo(() => {
    if (isDelayed && !isFollowersOnly) {
      return "Slow mode";
    }
    if (!isDelayed && isFollowersOnly) {
      return "Followers only";
    }
    if (isDelayed && isFollowersOnly) {
      return "Followers only and slow mode";
    }
    return "";
  }, [isDelayed, isFollowersOnly]);

  if (!isDelayed && !isFollowersOnly) return null;

  return (
    <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
      <Hint label={hint}>
        <Info className="w-4 h-4" />
      </Hint>
      <p className="font-semibold text-xs">{label}</p>
    </div>
  );
};
