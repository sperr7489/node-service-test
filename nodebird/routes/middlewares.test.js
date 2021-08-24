const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
//test 파일을 만들때는 웬만하면 es5문법으로 import 시켜주도록 하자.
describe("isLoggendIn", () => {
  const res = {
    status: jest.fn(() => res),
    //res를 return 하면 res.status(403)을 했을 때 res를 chainig하여 send를 바로 사용할 수 있다.
    //res.status(403).send("로그인 필요")
    //res.status했을때 res를 리턴하고 res.send 받아줌.
    send: jest.fn(),
  };
  const next = jest.fn(); //next라는 가짜함수를 만든느 것이다.

  test("로그인이 되어 있으면 isLoggedIn 이 next를 호출해야함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
      //true를 return 하여 if (req.isAuthenticated())가 실행되도록 하면 next()가 호출될 수 있다.
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1); //몇번 호출됐는지를 확인하는 함수가 toBeCalledTimes
  });
  test("로그인이 되어 있지 않으면 isLoggedIn 이 error를 호출해야함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    //false를 return 하여 else문을 받도록 한다.
    isLoggedIn(req, res, next);
    //error가 발생한다고 했을 때 middleware를 보면 로그인 안되어있을 때
    // res의 status는 403으로 호출되어야하고
    // res의 send는 '로그인 필요' 로 보내져야 하는 것을 알 수 있다.=>chaining을 사용!

    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});
describe("insNotLoggedIn", () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("로그인이 되어 있으면 isNotLoggedIn 이 error를 호출해야함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("로그인한 상태입니다.");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });
  test("로그인이 되어 있지않으면 isNotLoggedIn 이 next를 호출해야함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);

    expect(next).toBeCalledTimes(1);
  });
});
//이런식으로 비슷한 묶음끼리 단위테스트를 할 수가 있다.
