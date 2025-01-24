import { login } from "./actions";
import LoginForm from "@/components/login-form";

export const metadata = {
	title: "Log in - Template",
	description: "Log in.",
};

export default async function Page() {
	return (
		<>
			<div className="flex items-center justify-center dark:bg-black h-[100vh] text-white">
				<LoginForm serverAction={login} />
			</div>
		</>
	);
}