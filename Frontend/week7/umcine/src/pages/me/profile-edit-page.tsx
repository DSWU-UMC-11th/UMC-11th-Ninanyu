import { useState } from "react";

// 임시 데이터 (API 연동 전까지 화면 확인용)
const PROFILE = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

// 공통 스타일
const labelClass = "text-[13px] font-extrabold leading-4 text-[#17191E]";
const fieldClass =
  "box-border flex min-h-12 w-full items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-[13px] py-[14px] focus-within:border-[#2563EB]";
const inputClass =
  "w-full bg-transparent px-[2px] py-px text-[14px] leading-[17px] text-[#17191E] outline-none placeholder:text-[#969DA8]";

export function ProfileEditPage() {
  const [nickname, setNickname] = useState(PROFILE.nickname);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      alert("5MB 이하의 이미지만 올릴 수 있어요.");
      return;
    }
    // 선택한 이미지를 바로 미리보기로 반영
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 내 정보 수정 API 요청은 다음 단계에서 추가
  };

  return (
    // 배경은 화면 전체, 내용은 최대 1440px로 가운데 정렬
    <main className="min-h-[calc(100vh-91px)] w-full bg-[#F6F7F9] font-['Pretendard']">
      {/* main.profile-shell: 패딩 24px 80px, 간격 32px */}
      <div className="mx-auto flex min-h-[calc(100vh-91px)] w-full max-w-[1440px] flex-col gap-8 px-20 pt-6 pb-7">
      <form
        id="profile-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-8"
      >
        {/* div.profile-head */}
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
            style={{ color: "#ffffff" }}
            className="inline-flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8]"
          >
            변경사항 저장
          </button>
        </div>

        <div className="flex items-start gap-11">
          {/* 프로필 이미지 */}
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

          {/* 닉네임 / 이메일 (Frame 6, 간격 17px) */}
          <div className="flex flex-1 flex-col gap-[17px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-nickname" className={labelClass}>
                닉네임
              </label>
              <div className={fieldClass}>
                <input
                  id="profile-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  id="profile-nickname-check"
                  disabled={!isNicknameValid}
                  className="shrink-0 text-[12px] leading-[14px] font-extrabold text-[#2563EB] disabled:cursor-not-allowed disabled:text-[#969DA8]"
                >
                  중복 확인
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
                  value={PROFILE.email}
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