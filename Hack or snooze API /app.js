async function getUsers(token) {
  const res = await axios.get(
    "https://hack-or-snooze-v3.herokuapp.com/users?skip=0&limit=50",
    {
      params: { token },
    }
  );
  console.log(res);
}

async function createUser(name, username, password) {
  const res = await axios.post(
    "https://hack-or-snooze-v3.herokuapp.com/signup",
    {
      user: { name, username, password },
    }
  );
  console.log(res);
}
async function loginUser(username, password) {
  const res = await axios.post(
    "https://hack-or-snooze-v3.herokuapp.com/login",
    {
      user: { username, password },
    }
  );
  console.log(res);
  return res.data.token;
}

async function getToken() {
  const token = await loginUser("viktora", "kjdhskjhd2werw3");
  getUsers(token);
}

async function createStory() {
  const token = await loginUser("viktora", "kjdhskjhd2werw3");
  const newStory = {
    token,
    story: {
      author: "Matt Lane",
      title: "The best story ever",
      url: "http://google.com",
    },
  };
  const story = await axios.post(
    "https://hack-or-snooze-v3.herokuapp.com/stories",
    newStory
  );
  console.log(story);
}

getToken();
createStory();
