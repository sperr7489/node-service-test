const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
              //done(error인자, 로그인 성공했을 때 유저)
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
              //done(error인자, 로그인 실패, 로그인실패했을 때 메시지)
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
            //done(error인자, 로그인 실패, 로그인실패했을 때 메시지)
          }
          //done 함수가 실행이 완료되면 다시 auth.js 의
          // passport.authenticate("local", (authError, user, info) => 로 간다.
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
