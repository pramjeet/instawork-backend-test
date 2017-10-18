const { check, validationResult } = require("express-validator/check");
const { matchedData } = require("express-validator/filter");

const express = require("express");
const router = express.Router();

const Member = require("../models/Member");

// get all members - no pagination right now
router.get("/", async (req, res, next) => {
  try {
    const members = await Member.query();
    res.json(members);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// add new member
router.post(
  "/",
  //input validation using express-validator
  [
    check("firstName")
      .isLength(1, 16)
      .withMessage("First name can't be blank or more that 16 characters long")
      .trim(),
    check("lastName")
      .isLength(1, 16)
      .withMessage("Last name can't be blank or more that 16 characters long")
      .trim(),
    check("emailId")
      .isEmail()
      .withMessage("must be a valid email")
      .trim()
      .normalizeEmail()
      .custom(emailId => {
        return Member.query()
          .where({ emailId: emailId })
          .then(members => {
            if (members.length > 0) {
              throw new Error("member with this email already exists");
            } else {
              return true;
            }
          });
      }),
    check("phoneNumber")
      .isLength(1, 16)
      .withMessage(
        "Phone number can't be blank or more that 32 characters long"
      )
      .trim()
      .custom(phoneNumber => {
        return Member.query()
          .where({ phoneNumber: phoneNumber })
          .then(members => {
            if (members.length > 0) {
              throw new Error("member with this phone number already exists");
            } else {
              return true;
            }
          });
      }),
    check("role")
      .isIn(["admin", "regular"])
      .withMessage("Role can be 'admin' or 'regular' only")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    try {
      const reqData = matchedData(req);
      const member = await Member.query().insert(reqData);
      res.json(member);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
);

//modify member details
router.put(
  "/:id",
  [
    check("id")
      .isInt()
      .withMessage("invalid member id"),
    check("firstName")
      .isLength(1, 16)
      .withMessage("First name can't be blank or more that 16 characters long")
      .trim()
      .optional(),
    check("lastName")
      .isLength(1, 16)
      .withMessage("Last name can't be blank or more that 16 characters long")
      .trim()
      .optional(),
    check("emailId")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .trim()
      .normalizeEmail()
      .custom((emailId, { req }) => {
        return Member.query()
          .where({ emailId: emailId })
          .whereNot({ id: req.params.id })
          .then(members => {
            if (members.length > 0) {
              throw new Error("another member with this email already exists");
            } else {
              return true;
            }
          });
      })
      .optional(),
    check("phoneNumber")
      .isLength(1, 16)
      .withMessage(
        "Phone number can't be blank or more that 32 characters long"
      )
      .trim()
      .custom((phoneNumber, { req }) => {
        return Member.query()
          .where({ phoneNumber: phoneNumber })
          .whereNot({ id: req.params.id })
          .then(members => {
            if (members.length > 0) {
              throw new Error(
                "another member with this phone number already exists"
              );
            } else {
              return true;
            }
          });
      })
      .optional(),
    check("role")
      .isIn(["admin", "regular"])
      .withMessage("Role can be 'admin' or 'regular' only")
      .optional()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    try {
      let reqData = matchedData(req);
      delete reqData.id;
      const member = await Member.query()
        .patch(reqData)
        .where({ id: req.params.id });
      res.json(reqData);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
);

//delete member
router.delete(
  "/:id",
  [
    check("id")
      .isInt()
      .withMessage("invalid member id")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    try {
      const member = await Member.query()
        .delete()
        .where({ id: req.params.id });
      res.json({ message: "member deleted successfully" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
);

module.exports = router;
