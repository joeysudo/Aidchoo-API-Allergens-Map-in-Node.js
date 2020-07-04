var expect = require("chai").expect;
var assert = require("chai").assert;
var should = require("chai").should;
var sinon = require("sinon");
var userController = require("../../controllers/userController");

// Usually imported in test cases. Move later.
const users = require("../../models/user");

describe("#testing the getUserByID() function", function () {
  context("test without arguments", function () {
    it("getUserByID() should throw error", () => {
      return new Promise((resolve, reject) => {
        userController.getUserByID();
      }).to.expect(500)(TypeError, "getUserByID() expects a user ID");
    });
  });

  context("test with argument - valid", function () {
    it("getUserByID() should return user", function () {});
  });

  context("test with argument - invalid", function () {
    it("getUserByID() should throw error", function () {});
  });
});

describe("#testing the getUserByEmail() function", function () {
  context("test without arguments", function () {
    it("getUserByEmail() should throw error", () => {
      return new Promise((resolve, reject) => {
        userController.getUserByEmail();
      }).to.expect(500)(TypeError, "getUserByID() expects a user ID");
    });
  });

  context("test with argument - valid", function () {
    it("getUserByEmail() should return user", function () {});
  });

  context("test with argument - invalid", function () {
    it("getUserByEmail() should throw error", function () {});
  });
});

describe("#testing the addUser() function", function () {
  context("test without arguments", function () {
    it("getUserByEmail() should throw error", () => {
      return new Promise((resolve, reject) => {
        userController.getUserByEmail();
      }).to.expect(500)(TypeError, "getUserByID() expects a user ID");
    });
  });

  context("test with argument - valid", function () {
    it("getUserByEmail() should return user", function () {});
  });

  context("test with argument - invalid", function () {
    it("getUserByEmail() should throw error", function () {});
  });
});

describe("#testing the getProfile() function", function () {
  context("test without arguments", function () {
    it("getUserByEmail() should throw error", () => {
      return new Promise((resolve, reject) => {
        userController.getUserByEmail();
      }).to.expect(500)(TypeError, "getUserByID() expects a user ID");
    });
  });

  context("test with argument - valid", function () {
    it("getUserByEmail() should return user", function () {});
  });

  context("test with argument - invalid", function () {
    it("getUserByEmail() should throw error", function () {});
  });
});

describe("#testing the updateUser() function", function () {
  context("test without arguments", function () {
    it("getUserByEmail() should throw error", () => {
      return new Promise((resolve, reject) => {
        userController.getUserByEmail();
      }).to.expect(500)(TypeError, "getUserByID() expects a user ID");
    });
  });

  context("test with argument - valid", function () {
    it("getUserByEmail() should return user", function () {});
  });

  context("test with argument - invalid", function () {
    it("getUserByEmail() should throw error", function () {});
  });
});

describe("#testing the deleteUser() function", function () {
  context("test without arguments", function () {
    it("getUserByEmail() should throw error", () => {
      return new Promise((resolve, reject) => {
        userController.getUserByEmail();
      }).to.expect(500)(TypeError, "getUserByID() expects a user ID");
    });
  });

  context("test with argument - valid", function () {
    it("getUserByEmail() should return user", function () {});
  });

  context("test with argument - invalid", function () {
    it("getUserByEmail() should throw error", function () {});
  });
});
