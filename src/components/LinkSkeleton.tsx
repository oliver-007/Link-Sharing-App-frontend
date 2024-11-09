const LinkSkeleton = () => {
  const linksSkelton = Array(5).fill(
    <p className="bg-zinc-200 h-7 rounded-md w-full animate-pulse "></p>
  );
  return (
    <div className="space-y-4">
      {linksSkelton.map((link, i) => (
        <div key={i}>{link}</div>
      ))}
    </div>
  );
};

export default LinkSkeleton;
