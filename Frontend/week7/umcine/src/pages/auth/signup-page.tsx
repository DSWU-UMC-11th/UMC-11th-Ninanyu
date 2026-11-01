import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 공통 스타일 (Figma 값 기준)
const labelClass =
  "text-[13px] font-extrabold leading-4 text-[#17191E]"; // 13px / 800 / 16px
const fieldBase =
  "box-border flex min-h-12 w-full items-center rounded-lg border bg-white px-[13px] py-[14px] focus-within:border-[#2563EB]"; // 패딩 14px 13px, radius 8px
const inputClass =
  "w-full bg-transparent px-[2px] py-px text-[14px] leading-[17px] text-[#17191E] outline-none placeholder:text-[#969DA8]"; // 14px / 400 / 17px
const textLinkClass =
  "shrink-0 text-[12px] font-extrabold leading-[14px] text-[#2563EB] disabled:cursor-not-allowed disabled:text-[#969DA8]"; // 12px / 800 / 14px
const errorClass = "-mt-1 text-[12px] leading-[14px] text-[#DC2626]";

const borderOf = (hasError: boolean) =>
  hasError ? "border-[#DC2626]" : "border-[#E3E6EB]";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 3.4에서 회원가입 API 요청 추가
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    // main.auth-pane: 헤더(91px)를 뺀 영역, 폼은 가운데 정렬
    <main className="flex min-h-[calc(100vh-91px)] items-start justify-center bg-[#F6F7F9] px-5 pt-[211px] pb-20 font-['Pretendard']">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[430px] flex-col gap-4"
      >
        {/* h1: 34px / 700 / 41px / -1.53px */}
        <h1 className="text-[34px] leading-[41px] font-bold tracking-[-1.53px] text-[#17191E]">
          회원가입
        </h1>

        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-email" className={labelClass}>
            이메일
          </label>
          <div className={`${fieldBase} gap-[9px] ${borderOf(showEmailError)}`}>
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => handleCheckDuplicate("email")}
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              className={textLinkClass}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className={errorClass}>올바른 이메일 형식을 입력해 주세요.</p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-nickname" className={labelClass}>
            닉네임
          </label>
          <div className={`${fieldBase} gap-[9px] ${borderOf(showNicknameError)}`}>
            <input
              id="signup-nickname"
              type="text"
              placeholder="2–12자"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => handleCheckDuplicate("nickname")}
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              className={textLinkClass}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className={errorClass}>닉네임은 2자 이상 12자 이하로 입력해 주세요.</p>
          )}
        </div>

        {/* 비밀번호 + 안내문구 (Frame 5, gap 4px) */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password" className={labelClass}>
              비밀번호
            </label>
            <div className={`${fieldBase} ${borderOf(showPasswordError)}`}>
              <input
                id="signup-password"
                type="password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className={inputClass}
              />
            </div>
            {showPasswordError && (
              <p className={errorClass}>비밀번호를 다시 확인해 주세요.</p>
            )}
          </div>
          {/* 11px / 400 / 13px / #969DA8 */}
          <p className="text-[11px] leading-[13px] text-[#969DA8]">
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-password-confirm" className={labelClass}>
            비밀번호 확인
          </label>
          <div className={`${fieldBase} ${borderOf(showPasswordConfirmError)}`}>
            <input
              id="signup-password-confirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              className={inputClass}
            />
          </div>
          {showPasswordConfirmError && (
            <p className={errorClass}>비밀번호가 일치하지 않아요.</p>
          )}
        </div>

        {/* button.btn: 높이 48px, #2563EB, radius 8px, 14px / 800 */}
        <button
          type="submit"
          disabled={!canSubmit}
          style={{ color: "#ffffff" }}
          className="flex h-12 w-full items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold transition-opacity hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#2563EB]"
        >
          가입하기
        </button>

        {/* div.auth-footer: 13px / #606774, 링크 12px / 800 */}
        <div className="flex items-end justify-center">
          <span className="text-[13px] leading-4 text-[#606774]">
            이미 계정이 있나요?&nbsp;
          </span>
          <a
            href="/login"
            className="text-[12px] font-extrabold leading-[14px] text-[#2563EB]"
          >
            로그인
          </a>
        </div>
      </form>
    </main>
  );
}