const { addFollowing } = require("./user");
jest.mock("../models/user"); //가짜로  models/user를 만들어주는것
const User = require("../models/user");
//jest.mock이 위에 있어야 가짜 DB로 만들어진 models/user를 가져올 수 있다.

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  //addFollowing함수를ㄹ 보면 id와 params user들도 변수로 사용된다. 그런데 이 변수들은
  //DB에서 가져오는 건데 어떻게? 이것또한 가짜변수를 만드는 것이다.
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();
  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야한다. ", async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        id: 1,
        addFollowings(value) {
          return Promise.resolve(true);
        },
      })
    );
    //이는 가짜의 User 모델의 findOne을 했을 때 가짜 리턴값을 프로미스로서 만들어주는 것이다.
    //
    await addFollowing(req, res, next);

    //addFollowing 함수는 비동기 함수기 때문에 await을 붙여줌으로써
    //addFollowing함수가 실행이 완료되고 나서야 다음 코드가 진행되어야 정상 test가 된다!
    expect(res.send).toBeCalledWith("success");
    //res.send가 기대하는 것이 success이다.
  });
  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출한다.  ", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    //null로 넣어줌으로써 사용자를 못찾았음을 알려준다.
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });
  test("DB에서 error가 발생하면 next(error)를 호출한다.  ", async () => {
    const error = "테스트용 에러";
    User.findOne.mockReturnValue(Promise.reject(error));
    //reject(error)를 해주면 error를 발생시켜 catch문으로 보낸다.
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
