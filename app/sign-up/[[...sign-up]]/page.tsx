import { SignUp } from "@clerk/nextjs";
// import "~/public/auth.css";
import SignUpTitle from "./title";

export default function SignUpPage() {
  return (
    <section
      className={`flex flex-col items-center justify-center min-h-screen p-3 gap-3`}
    >
      <SignUpTitle />
      <SignUp signInForceRedirectUrl={"/"} />
    </section>
  );
}
