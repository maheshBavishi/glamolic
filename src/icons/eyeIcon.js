export default function EyeIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
            <path
                d="M12.9862 9.99993C12.9862 11.6499 11.6529 12.9833 10.0029 12.9833C8.35286 12.9833 7.01953 11.6499 7.01953 9.99993C7.01953 8.34993 8.35286 7.0166 10.0029 7.0166C11.6529 7.0166 12.9862 8.34993 12.9862 9.99993Z"
                stroke={props.stroke || "#121212"}
                strokeOpacity={props.strokeOpacity || "0.7"}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.99792 16.8918C12.9396 16.8918 15.6813 15.1584 17.5896 12.1584C18.3396 10.9834 18.3396 9.00843 17.5896 7.83343C15.6813 4.83343 12.9396 3.1001 9.99792 3.1001C7.05625 3.1001 4.31458 4.83343 2.40625 7.83343C1.65625 9.00843 1.65625 10.9834 2.40625 12.1584C4.31458 15.1584 7.05625 16.8918 9.99792 16.8918Z"
                stroke={props.stroke || "#121212"}
                strokeOpacity={props.strokeOpacity || "0.7"}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
