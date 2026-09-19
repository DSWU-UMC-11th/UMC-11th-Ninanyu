      console.log("Hello, Web!");

      const student = {
        name: "주세은",
        skills: ["TypeScript", "React", "Docker"],
      };

      function printSkills(skills) {
        for (const skill of skills) {
          if (skill === "Docker") {
            console.log(
              `${skill}: 컨테이너화를 통해 애플리케이션을 쉽게 배포하고 관리합니다.`,
            );
          } else {
            console.log(skill);
          }
        }
      }

      console.log(student.name);
      printSkills(student.skills);

      const message = document.querySelector("#message");
      const greetingButton = document.querySelector("#greeting-button");

      greetingButton.addEventListener("click", function () {
        message.textContent = "웹 개발을 시작합니다!";
      });