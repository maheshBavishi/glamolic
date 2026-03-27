export default function LockIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M8 10V8.25C8 6.18 9.78 4.5 12 4.5C14.22 4.5 16 6.18 16 8.25V10"
                stroke={props.stroke || "currentColor"}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="4.75"
                y="10"
                width="14.5"
                height="9.25"
                rx="2"
                stroke={props.stroke || "currentColor"}
                strokeWidth="1.7"
            />
        </svg>
    );
}
