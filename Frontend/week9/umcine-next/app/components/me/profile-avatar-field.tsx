"use client";

import { useState } from "react";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfileAvatarField() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      alert("5MB 이하의 이미지만 올릴 수 있어요.");
      return;
    }
    // 이전 미리보기 URL 메모리 해제 후 새 이미지 반영
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex h-[164px] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        <label className="relative cursor-pointer">
          <span className="flex size-[82px] items-center justify-center overflow-hidden rounded-full bg-[#E3E6EB]">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="프로필 이미지 미리보기"
                className="size-full object-cover"
              />
            ) : (
              <img
                className="size-12"
                src="/icons/person.svg"
                alt=""
                aria-hidden="true"
              />
            )}
          </span>

          <img
            className="absolute right-0 bottom-0 size-6"
            src="/icons/edit.svg"
            alt=""
            aria-hidden="true"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="sr-only"
          />
        </label>
        <span className="text-[15px] leading-[18px] font-bold text-[#17191E]">
          프로필 이미지
        </span>
        <span className="text-[11px] leading-[13px] text-[#969DA8]">
          선택 사항 · 최대 5MB
        </span>
      </div>
    </div>
  );
}