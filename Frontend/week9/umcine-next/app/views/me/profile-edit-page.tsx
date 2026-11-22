"use client";

import { useState } from "react";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { useMeQuery } from "@/hooks/use-me-query";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { ProfileAvatarField } from "@/components/me/profile-avatar-field";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

// 공통 스타일
const labelClass = "text-[13px] font-extrabold leading-4 text-[#17191E]";
const fieldClass =
  "box-border flex min-h-12 w-full items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-[13px] py-[14px] focus-within:border-[#2563EB]";
const inputClass =
  "w-full bg-transparent px-[2px] py-px text-[14px] leading-[17px] text-[#17191E] outline-none placeholder:text-[#969DA8]";
const textLinkClass =
  "shrink-0 text-[12px] leading-[14px] font-extrabold text-[#2563EB] disabled:cursor-not-allowed disabled:text-[#969DA8]";

const pageClass =
  "min-h-[calc(100vh-91px)] w-full bg-[#F6F7F9] font-['Pretendard']";

// 데이터 조회 담당: 로딩/에러/성공 분기
export function ProfileEditPage() {
  const meQuery = useMeQuery();

  if (meQuery.isLoading) {
    return (
      <main className={`${pageClass} flex items-center justify-center`}>
        <p className="text-[14px] text-[#606774]">불러오는 중...</p>
      </main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <main className={`${pageClass} flex items-center justify-center`}>
        <p className="text-[14px] text-[#DC2626]">
          내 정보를 불러오지 못했어요.
        </p>
      </main>
    );
  }

  return <ProfileEditForm profile={meQuery.data} />;
}

type ProfileEditFormProps = {
  profile: { nickname: string; email: string };
};

// 폼 담당: 데이터가 준비된 뒤 렌더링되므로 useState 초기값에 서버 값을 쓸 수 있음
function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [duplicateCheck, setDuplicateCheck] = useState(
    DEFAULT_DUPLICATE_CHECK,
  );

  const updateMeMutation = useUpdateMeMutation();

  const nickname = nicknameInput.trim();
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  // 현재 닉네임과 같으면 중복 확인도, 저장도 필요 없음
  const isUnchanged = nickname === profile.nickname;

  const canCheck = isNicknameValid && !isUnchanged && !duplicateCheck.isChecking;
  const canSubmit = isNicknameValid && !isUnchanged && duplicateCheck.isAvailable;

  const handleChangeNickname = (value: string) => {
    if (duplicateCheck.isChecking) return;
    // 확인한 값을 바꾸면 다시 중복 확인해야 함
    setDuplicateCheck(DEFAULT_DUPLICATE_CHECK);
    setNicknameInput(value);
  };

  const handleCheckDuplicate = async () => {
    if (!canCheck) return;

    setDuplicateCheck({ isChecking: true, isAvailable: false });

    try {
      const response = await checkNicknameDuplicate(nickname);
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({ ...prev, isAvailable }));
      alert(
        isAvailable
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, isAvailable: false }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, isChecking: false }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <main className={pageClass}>
      <div className="mx-auto flex min-h-[calc(100vh-91px)] w-full max-w-[1440px] flex-col gap-8 px-20 pt-6 pb-7">
        <form
          id="profile-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-[9px]">
              <h1 className="text-[31px] leading-[37px] font-bold tracking-[-1.24px] text-[#17191E]">
                내 정보 수정
              </h1>
              <p className="text-[14px] leading-[22px] text-[#606774]">
                닉네임과 프로필 이미지만 변경할 수 있어요.
              </p>
            </div>
            <button
              type="submit"
              disabled={!canSubmit || updateMeMutation.isPending}
              style={{ color: "#ffffff" }}
              className="inline-flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#2563EB]"
            >
              {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
            </button>
          </div>

          <div className="flex items-start gap-11">
            <ProfileAvatarField />

            <div className="flex flex-1 flex-col gap-[17px]">
              <div className="flex flex-col gap-2">
                <label htmlFor="profile-nickname" className={labelClass}>
                  닉네임
                </label>
                <div className={fieldClass}>
                  <input
                    id="profile-nickname"
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => handleChangeNickname(e.target.value)}
                    disabled={duplicateCheck.isChecking}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    id="profile-nickname-check"
                    onClick={handleCheckDuplicate}
                    disabled={!canCheck}
                    className={textLinkClass}
                  >
                    {duplicateCheck.isChecking ? "확인 중" : "중복 확인"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-px">
                <label htmlFor="profile-email" className={labelClass}>
                  이메일
                </label>
                <div className={fieldClass}>
                  {/* 이메일은 수정할 수 없어서 읽기 전용 */}
                  <input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    readOnly
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* section.danger-zone: 페이지 아래쪽에 고정 */}
        <section className="mt-auto box-border flex items-center justify-between gap-2 rounded-[10px] border border-[#D92D20] bg-[#D92D20]/10 p-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] leading-[17px] font-bold text-[#D92D20]">
              회원 탈퇴
            </h3>
            <p className="text-[11px] leading-4 text-[#D92D20]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          {/* 탈퇴 확인 다이얼로그는 다음 단계에서 연결 */}
          <button
            type="button"
            id="open-delete-dialog"
            className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-lg border border-[#D92D20] bg-white px-4 text-[14px] leading-[17px] font-extrabold text-[#D92D20] hover:bg-[#fdf1f0]"
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}