"use strict";
// 서로 다른 정보를 가진 회원 두 명 이상 작성
const members = [
    { id: 1, name: "니나뉴", role: "leader", githubId: "Ninanyu23" },
    { id: 2, name: "지수", role: "member" },
    { id: 3, name: "광수", role: "member", githubId: "gwangsoo" },
];
// 회원의 id를 입력하면 해당 회원의 이름, 역할, GitHub ID를 출력
function introduceMember(memberId) {
    const foundMember = members.find((member) => member.id === memberId);
    if (!foundMember) {
        return "회원을 찾을 수 없습니다.";
    }
    const displayGithubId = foundMember?.githubId ?? "등록되지 않음";
    return (foundMember.name +
        "님은 " +
        foundMember.role +
        "이며, GitHub ID는 " +
        displayGithubId +
        "입니다.");
}
console.log(introduceMember(1));
console.log(introduceMember(2));
console.log(introduceMember(999));
