const Model = require("objection").Model;

class Member extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "members";
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstName", "lastName", "emailId", "phoneNumber", "role"],

      properties: {
        id: { type: "integer" },
        firstName: { type: "string", minLength: 1, maxLength: 16 },
        lastName: { type: "string", minLength: 1, maxLength: 16 },
        emailId: { type: "string", format: "email" },
        phoneNumber: { type: "string", maxLength: 32 },
        role: { type: "string", enum: ["admin", "regular"] },
        createdAt: { type: "string", format: "date-time" }
      }
    };
  }
}

module.exports = Member;
