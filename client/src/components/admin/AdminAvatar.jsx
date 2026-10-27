import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { getImageUrl } from '../../utils/imageUrl';

function initialsFromName(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminAvatar({ avatar, fullName, className = '', imgClassName }) {
  const [broken, setBroken] = useState(false);
  const src = useMemo(() => getImageUrl(avatar), [avatar]);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const showImage = Boolean(src) && !broken;
  const resolvedImgClass = imgClassName || className;

  if (!showImage) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-slate-800 border border-teal-500/50 text-teal-300 font-bold uppercase shrink-0',
          className
        )}
        aria-hidden
      >
        <span className="text-[10px] sm:text-xs">{initialsFromName(fullName)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={fullName ? `${fullName} profile` : 'Profile'}
      className={clsx('object-cover shrink-0', resolvedImgClass)}
      onError={() => setBroken(true)}
    />
  );
}
