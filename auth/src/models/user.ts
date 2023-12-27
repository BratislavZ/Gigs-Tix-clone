import mongoose from 'mongoose';
import { PasswordManager } from '../services/password-manager';

// TypeScript and Mongoose aren't the best of friends,
// so we need to create an interface for the User model
// and later a function that will create a new User.
interface UserAttrs {
  email: string;
  password: string;
}

// In order to make TypeScript aware of the build function, for User.build({...})
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// When creating a new User, we get createdAt and updatedAt fields that we don't want,
// so we remove them from the Doc, now user.createdAt is not possible
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // transform is a function that is called when toJSON is called on a user
        // ret is what is returned when toJSON is called on a user
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v; // this can be done with versionKey: false in the schema
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  // We want to hash the password only if it is modified, not every time the user is saved
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
