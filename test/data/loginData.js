module.exports = {
  "1": {
    data: {
      username: "superUser",
      password: "superPass",
      uuid: "1234567812345678",
      location: {
        longitude: 47,
        latitude: 30
      }
    },
    expect: 200
  },
  "2": {
    data: {
      username: "superUser",
      password: "Hello kitty you're so pretty",
      uuid: "1234567812345678",
      location: {
        longitude: 47,
        latitude: 30
      }
    },
    expect: 403
  },
  "3": {
    data: {
      username: "kitty",
      password: "nightmare",
      uuid: "1234567812345678",
      location: {
        longitude: 47,
        latitude: 30
      }
    },
    expect: 403
  }
};
