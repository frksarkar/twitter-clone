import { useState } from 'react';
import { Eye, EyeOff, Twitter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
	onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');

	const { login, isLoading } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError('Please fill in all fields');
			return;
		}

		const success = await login(email, password);

		if (!success) {
			setError('Invalid email or password');
		}
	};

	const handleDemoLogin = () => {
		setEmail('john@example.com');
		setPassword('password123');
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
					<Twitter size={32} className="text-white" />
				</div>
				<h1 className="text-3xl font-bold mb-2">Sign in to Chirper</h1>
				<p className="text-text-secondary-light dark:text-text-secondary-dark">
					Welcome back! Please sign in to your account.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="email" className="block text-sm font-medium mb-2">
						Email address
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="input"
						placeholder="Enter your email"
						disabled={isLoading}
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium mb-2">
						Password
					</label>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input pr-12"
							placeholder="Enter your password"
							disabled={isLoading}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>

				{error && (
					<div className="bg-error-500/10 border border-error-500/20 text-error-500 px-4 py-3 rounded-lg text-sm">
						{error}
					</div>
				)}

				<button type="submit" disabled={isLoading} className="btn-primary w-full">
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>

				<div className="text-center">
					<button
						type="button"
						onClick={handleDemoLogin}
						className="text-primary-500 hover:underline text-sm"
					>
						Use demo account (john@example.com)
					</button>
				</div>

				<div className="text-center">
					<span className="text-text-secondary-light dark:text-text-secondary-dark">
						Don't have an account?{' '}
					</span>
					<button
						type="button"
						onClick={onSwitchToRegister}
						className="text-primary-500 hover:underline font-medium"
					>
						Sign up
					</button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
