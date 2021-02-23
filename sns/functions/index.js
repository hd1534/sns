function partialBind(func, ...argsBound) {
  return function (...args) {
    return func.call(this, ...argsBound, ...args);
  };
}

const emailChecker = (email) => {
  // 이메일의 길이가 40을 넘기거나 포멧이 맞지 않으면 false
  if (email.length > 40) return false;
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(email);
};
const passwordChecker = (password) => {
  // 적어도 1개 이상의 숫자, 특수문자, 영문자로 구성되어 7 ~ 15글자
  const re = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  return re.test(password);
};

module.exports = {
  partialBind,
  emailChecker,
  passwordChecker,
};
