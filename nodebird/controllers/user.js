const User = require("../models/user");

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowings(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
//미들웨어의 마지막 부분을 일반적으로 컨트롤러라고 칭한다. 이런 것들을 따로 폴더로 만들어주면
//테스트 파일을 작성할 때 굉장히 쉽게 작성할 수 있다.
