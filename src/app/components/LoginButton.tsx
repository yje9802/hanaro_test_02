type LoginButtonProps = {
    text: string;
    onClick: () => void;
};

const LoginButton = ({ text, onClick }: LoginButtonProps) => (
    <button
        className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
        onClick={onClick}
    >
        {text}
    </button>
);

export default LoginButton;
