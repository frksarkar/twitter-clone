import { useState } from 'react';
import { Search, Settings, ChevronDown, Send, Image, Smile, Calendar } from 'lucide-react';

// Mock conversation data
const conversationsData = [
	{
		id: '1',
		user: {
			name: 'Jane Smith',
			username: 'janesmith',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		lastMessage: 'That sounds great! Looking forward to it.',
		time: '2h',
		unread: true,
	},
	{
		id: '2',
		user: {
			name: 'Alex Johnson',
			username: 'alexj',
			avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		lastMessage: 'Did you see the latest announcement from Apple?',
		time: '5h',
		unread: false,
	},
	{
		id: '3',
		user: {
			name: 'Sarah Wilson',
			username: 'sarahw',
			avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		lastMessage: 'Thanks for the recommendation!',
		time: '1d',
		unread: false,
	},
	{
		id: '4',
		user: {
			name: 'Tech News',
			username: 'technews',
			avatar: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=60',
		},
		lastMessage: 'We appreciate your feedback on our latest article.',
		time: '2d',
		unread: false,
	},
];

// Mock messages for the selected conversation
const mockMessages = [
	{
		id: 'm1',
		senderId: 'user2',
		text: "Hey there! How's your day going?",
		timestamp: '2025-04-20T10:30:00Z',
	},
	{
		id: 'm2',
		senderId: 'self',
		text: 'Pretty good, thanks! Just working on some new design projects. How about you?',
		timestamp: '2025-04-20T10:32:00Z',
	},
	{
		id: 'm3',
		senderId: 'user2',
		text: "I'm doing well. Did you see the latest announcement from Apple? They're releasing some really cool new features.",
		timestamp: '2025-04-20T10:35:00Z',
	},
	{
		id: 'm4',
		senderId: 'self',
		text: "No, I haven't seen that yet. What did they announce?",
		timestamp: '2025-04-20T10:37:00Z',
	},
	{
		id: 'm5',
		senderId: 'user2',
		text: "They're introducing a new AR platform for developers and the next generation of Apple Glass. It looks amazing!",
		timestamp: '2025-04-20T10:40:00Z',
	},
];

const MessagesPage = () => {
	const [selectedConversation, setSelectedConversation] = useState(conversationsData[0]);
	const [messageText, setMessageText] = useState('');
	const [messages, setMessages] = useState(mockMessages);

	const handleSendMessage = () => {
		if (messageText.trim()) {
			const newMessage = {
				id: `m${messages.length + 1}`,
				senderId: 'self',
				text: messageText,
				timestamp: new Date().toISOString(),
			};

			setMessages([...messages, newMessage]);
			setMessageText('');
		}
	};

	const formatTime = (timeString: string) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<div className="flex flex-col min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex justify-between items-center">
				<h1 className="font-bold text-xl">Messages</h1>
				<div className="flex space-x-2">
					<button className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
						<Settings size={20} />
					</button>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Conversations List - Hidden on small screens */}
				<div className="hidden md:flex md:w-2/5 flex-col border-r border-secondary-100 dark:border-secondary-800">
					<div className="p-3">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
							</div>
							<input
								type="text"
								placeholder="Search Direct Messages"
								className="bg-secondary-50 dark:bg-secondary-800 text-text-primary-light dark:text-text-primary-dark rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
							/>
						</div>
					</div>

					{/* Conversations */}
					<div className="flex-1 overflow-y-auto">
						{conversationsData.map((conversation) => (
							<div
								key={conversation.id}
								className={`p-3 flex items-start hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors ${
									selectedConversation?.id === conversation.id
										? 'bg-secondary-50 dark:bg-secondary-800'
										: ''
								}`}
								onClick={() => setSelectedConversation(conversation)}
							>
								<img
									src={conversation.user.avatar}
									alt={conversation.user.name}
									className="w-12 h-12 rounded-full object-cover mr-3"
								/>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-baseline">
										<span className="font-bold truncate">{conversation.user.name}</span>
										<span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
											{conversation.time}
										</span>
									</div>
									<div className="text-text-secondary-light dark:text-text-secondary-dark text-sm truncate">
										@{conversation.user.username}
									</div>
									<div className="flex items-center justify-between">
										<p
											className={`text-sm truncate ${
												conversation.unread
													? 'font-semibold text-text-primary-light dark:text-text-primary-dark'
													: 'text-text-secondary-light dark:text-text-secondary-dark'
											}`}
										>
											{conversation.lastMessage}
										</p>
										{conversation.unread && (
											<span className="h-2 w-2 bg-primary-500 rounded-full"></span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Message Thread */}
				<div className="flex-1 flex flex-col">
					{/* Conversation Header */}
					<div className="p-3 border-b border-secondary-100 dark:border-secondary-800 flex items-center">
						<img
							src={selectedConversation?.user.avatar}
							alt={selectedConversation?.user.name}
							className="w-10 h-10 rounded-full object-cover mr-3"
						/>
						<div className="flex-1">
							<div className="font-bold">{selectedConversation?.user.name}</div>
							<div className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
								@{selectedConversation?.user.username}
							</div>
						</div>
						<button className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
							<ChevronDown size={20} />
						</button>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.senderId === 'self' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
										message.senderId === 'self'
											? 'bg-primary-500 text-white'
											: 'bg-secondary-100 dark:bg-secondary-800'
									}`}
								>
									<p>{message.text}</p>
									<p
										className={`text-xs mt-1 ${
											message.senderId === 'self'
												? 'text-white/70'
												: 'text-text-secondary-light dark:text-text-secondary-dark'
										}`}
									>
										{formatTime(message.timestamp)}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Message Input */}
					<div className="p-3 border-t border-secondary-100 dark:border-secondary-800">
						<div className="flex items-center bg-secondary-50 dark:bg-secondary-800 rounded-full px-4 py-2">
							<div className="flex space-x-2 text-primary-500">
								<button className="p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
									<Image size={20} />
								</button>
								<button className="p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
									<Smile size={20} />
								</button>
								<button className="p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
									<Calendar size={20} />
								</button>
							</div>
							<input
								type="text"
								placeholder="Start a new message"
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 mx-3"
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage();
									}
								}}
							/>
							<button
								onClick={handleSendMessage}
								disabled={!messageText.trim()}
								className={`p-1 rounded-full ${
									messageText.trim()
										? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-secondary-700'
										: 'text-text-secondary-light dark:text-text-secondary-dark'
								} transition-colors`}
							>
								<Send size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
