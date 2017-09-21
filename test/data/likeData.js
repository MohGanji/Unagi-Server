module.exports = {
  "1": {
    data: {
      type: "like",
      uuid: "1234567812345678",
      postId: "12345678"
    },
    expect: 200
  },
  "2": {
    data: {
      type: "like",
      uuid: "1234567887654321",
      postId: "12345678"
    },
    expect: 403
  },
  "3": {
    data: {
      type: "unlike",
      uuid: "1234567812345678",
      postId: "12345678"
    },
    /// 403 ?
    expect: 200
  },
  "4": {
    data: {
      type: "unlike",
      uuid: "1234567812345678",
      postId: "1234567812345678"
    },
    expect: 403
  }
};
