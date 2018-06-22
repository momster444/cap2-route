const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = { };

Schema.createSchema = () => {
  const UserSchema = mongoose.Schema({
    email: {
      type: String,
      default: '',
    },
    hashed_password: {
      type: String,
      required: true,
      default: '',
    },
    name: {
      type: String,
      index: 'hashed',
      default: '',
    },
    salt: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      index: {
        unique: false,
      },
      default: Date.now,
    },
    updated_at: {
      type: Date,
      index: {
        unique: false,
      },
      default: Date.now,
    },
    routes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'route',
    }],
  });

  UserSchema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
      return this._password;
    });

  UserSchema
    .method('encryptPassword', function(plainText, inSalt) {
      const salt = inSalt || this.salt;
      return crypto.createHmac('sha1', salt).update(plainText).digest('hex');
    });

  UserSchema
    .method('makeSalt', function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    });

  UserSchema
    .method('authenticate', function(plainText, inSalt, hashed_password) {
      if (inSalt) {
        return this.encryptPassword(plainText, inSalt) === hashed_password;
      } else {
        return this.encryptPassword(plainText, this.encryptPassword(plainText), this.hashed_password);
      }
    });

  const validatePresenceOf = (value) => {
    return value && value.length;
  };

  UserSchema
    .pre('save', function(next) {
      if (!this.isNew) return next();

      if (!validatePresenceOf(this.password)) {
        next(new Error('유효하지 않은 password 필드입니다.'));
      } else {
        next();
      }
    });

  UserSchema
    .path('email')
    .validate(function(email) {
      return email.length;
    }, 'email 칼럼의 값이 없습니다.');

  UserSchema
    .path('hashed_password')
    .validate(function(hashed_password) {
      return hashed_password.length;
    }, 'hashed_password 칼럼의 값이없습니다.');

  UserSchema
    .static('findByEmail', function(email, callback) {
      return this.find({ email }, callback);
    });

  UserSchema
    .static('findAll', function(callback) {
      return this.find({}, callback);
    });

  return UserSchema;
};

module.exports = Schema;





