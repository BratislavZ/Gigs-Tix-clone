import * as actions from '@/actions';
import AuthForm from '@/components/auth/AuthForm';

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-7 container items-center p-2">
      <h1 className="text-2xl font-bold">Create new account</h1>
      <AuthForm serverAction={actions.signUp} buttonText="Create" />
    </div>
  );
}
