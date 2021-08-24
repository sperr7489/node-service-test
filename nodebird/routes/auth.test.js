const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");

//다음 나올 코드들 전에 전체적으로 한 번 먼저 하는 것.
beforeAll(async () => {
  await sequelize.sync();
  //table들이 생성된 채로 시작하는 것!
});

describe("POST/join", () => {
  test("로그인 안했으면 가입", (done) => {
    request(app) //가짜 요청 보내기 start!
      .post("/auth/join")
      .send({
        email: "sperr@ajou.ac.kr",
        nick: "kichang",
        password: "Rlarlckd12!",
      })
      .expect("Location", "/")
      //메서드 체이닝을 하는 것으로 이 순서는 지켜주어야한다. location/은 302를 받는다.
      .expect(302, done); //async문법에서 await이 없으면 done을 써주어야 비동기가끝이난다.
    /*
    302 Location/ 로 redirect 됨!
    하지만 test를 두번하면 이미 가입이 되어 있기 때문에 이부분에서 다시 실패한다.
    따라서 다른 정보로 가입하면 다시 성공이 뜰 것이다.=> 이런 귀찮은 과정을 생략하기위해
    마지막에 afterAll에서 force:true 속성을 넣어준다!
     */
  });
});

describe("POST /login", () => {
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "sperr@ajou.ac.kr",
        password: "Rlarlckd12!",
      })
      .end(done);
  });
  //before Each는 describe 문에서 존재하는 것들에만 적용시킬 수 있다.
  //describe 밖에 있으면 적용이 안된다.
  test("이미 로그인했으면 redirect /", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "sperr@ajou.ac.kr",
        nick: "kichang",
        password: "Rlarlckd12!",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});
//로그인을 또 만들어준 이유는 밑의 코드들에는 beforeEach를 적용시켜주지 않기 위해서!
describe("POST/login", () => {
  test("가입되지 않은 회원", (done) => {
    const message = encodeURIComponent("가입되지 않은 회원입니다.");
    request(app)
      .post("/auth/login")
      .send({
        password: "Rlarlckd12!",
        email: "sperr7@ajou.ac.kr",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
  test("로그인 수행", (done) => {
    request(app) //가짜 요청 보내기 start!
      .post("/auth/login")
      .send({
        email: "sperr@ajou.ac.kr",
        password: "Rlarlckd12!",
      })
      .expect("Location", "/")
      .expect(302, done); //async문법에서 await이 없으면 done을 써주어야 비동기가끝이난다.
  });
  test("비밀번호 틀림", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "sperr@ajou.ac.kr",
        password: "wrong",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe("GET/logout", () => {
  test("로그인 되어 있지 않으면 403", (done) => {
    //403이뜨는 이유는
    /*
    exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
}; //인증이 안되어있으면 로그인을 요청.
에서 else부분이 실행되기 때문이다. */
    request(app) //가짜 요청 보내기 start!
      .get("/auth/logout")
      .expect(403, done);
  });

  //로그아웃을 검사하기 위해서는 먼저 로그인을 시키는 게 중요!
  const agent = request.agent(app);
  beforeEach((done) => {
    //테스트하기 전에 실행됨.
    agent
      .post("/auth/login")
      .send({ email: "sperr@ajou.ac.kr", password: "Rlarlckd12!" })
      .end(done);
  });
  test("로그아웃을 수행할 때", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    agent.get("/auth/logout").expect("Location", "/").expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
//force:true 속성을 하면 새로 다시 만들 수 있게 하자나!
//그래서 위에 join 테스트를 한번 더해도 신경 쓰게 하지 않을 수 있다.
