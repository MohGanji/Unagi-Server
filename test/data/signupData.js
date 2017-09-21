module.exports = {
  "1": {
    data: {
      username: "vincent",
      password: "memento mori",
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
      username: "vincent",
      password: "Scars of the old scream",
      uuid: "1234567812345678"
    },
    expect: 403
  }
};
