import React from 'react'

export const GoogleMeetIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M47.74 38.65c0 .35-.09.68-.25.98-.16.3-.39.55-.67.72L36 46.43V30.57l10.82 6.08c.28.17.51.42.67.72s.25.63.25.98v.3z" fill="#00AA47"/>
        <path d="M47.74 9.35c0 .35-.09.68-.25.98-.16.3-.39.55-.67.72L36 1.57v15.86l10.82-6.08c.28-.17.51-.42.67-.72a2.031 2.031 0 0 0 .25-1.28v.3z" fill="#FFBA00"/>
        <path d="M36 10.5v27L10.5 44.25V3.75L36 10.5z" fill="#2D7FF9"/>
        <path d="M0 8.25v31.5c0 2.48 2.02 4.5 4.5 4.5h31.5V3.75H4.5C2.02 3.75 0 5.77 0 8.25z" fill="#4485F4"/>
        <path d="M0 31.5V39.75c0 2.48 2.02 4.5 4.5 4.5h6v-12.75H0z" fill="#00AA47"/>
        <path d="M0 8.25v8.25h10.5V3.75H4.5C2.02 3.75 0 5.77 0 8.25z" fill="#EA4335"/>
        <path d="M10.5 31.5h25.5v12.75H10.5V31.5z" fill="#00832D"/>
        <path d="M10.5 3.75v12.75h25.5V3.75H10.5z" fill="#2D7FF9"/>
    </svg>
)

export const RazorpayIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M22.436 0l-11.91 14.033-2.805-4.798-7.721 11.233 4.083 3.532 5.164-10.435 2.803 4.798 12.033-14.831-1.647-3.532z" />
    </svg>
)
