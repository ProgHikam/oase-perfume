import { resolveImageUrl } from "../utils/resolveImageUrl.js";

function TestimonialAvatar({ name, photo }) {
  const photoUrl = resolveImageUrl(photo);
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base font-semibold text-white">
      {initial}
    </div>
  );
}

export default TestimonialAvatar;
