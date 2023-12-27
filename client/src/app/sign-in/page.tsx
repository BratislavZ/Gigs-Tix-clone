import AuthForm from '@/components/auth/AuthForm';
import * as actions from '@/actions';

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-7 container items-center p-2">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <AuthForm serverAction={actions.signIn} buttonText="Submit" />
    </div>
  );
}
