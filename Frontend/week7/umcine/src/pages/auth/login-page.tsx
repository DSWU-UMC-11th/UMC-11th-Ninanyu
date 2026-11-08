import { useState } from "react";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;

// 공통 스타일 
const labelClass = "text-[13px] font-extrabold leading-4 text-[#17191E]"; // 13px / 800 / 16px
const fieldClass =
  "box-border flex min-h-12 w-full items-center gap-1 rounded-lg border border-[#E3E6EB] bg-white px-[13px] py-[14px] focus-within:border-[#2563EB]"; // 패딩 14px 13px, gap 4px
const inputClass =
  "w-full bg-transparent px-[2px] py-px text-[14px] leading-[17px] text-[#17191E] outline-none placeholder:text-[#969DA8]"; // 14px / 400 / 17px

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 로그인 API 요청은 다음 단계에서 추가
  };

  return (
    <main className="flex min-h-[calc(100vh-91px)] items-start justify-center bg-[#F6F7F9] px-5 pt-[306px] pb-20 font-['Pretendard']">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[430px] flex-col gap-4"
      >
        <h1 className="text-[34px] leading-[41px] font-bold tracking-[-1.53px] text-[#17191E]">
          로그인
        </h1>

        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className={labelClass}>
            이메일
          </label>
          <div className={fieldClass}>
            <img
              className="size-4 shrink-0"
              src="/icons/mail.svg"
              alt=""
              aria-hidden="true"
            />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className={labelClass}>
            비밀번호
          </label>
          <div className={fieldClass}>
            <img
              className="size-4 shrink-0"
              src="/icons/lock.svg"
              alt=""
              aria-hidden="true"
            />
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{ color: "#ffffff" }}
          className="flex h-12 w-full items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8]"
        >
          로그인
        </button>

        <div className="flex items-end justify-center pt-[5px]">
          <span className="text-[13px] leading-4 text-[#606774]">
            처음이신가요?&nbsp;
          </span>
          <a
            href="/signup"
            className="text-[12px] font-extrabold leading-[14px] text-[#2563EB]"
          >
            회원가입
          </a>
        </div>
      </form>
    </main>
  );
}