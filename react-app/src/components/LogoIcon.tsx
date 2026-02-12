export function LogoIcon() {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: '8px' }}
    >
      {/* Main background circle */}
      <circle cx="20" cy="20" r="18" fill="#667eea" opacity="0.1" />
      
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" fill="none" stroke="#667eea" strokeWidth="1.5" />
      
      {/* Hub center circle */}
      <circle cx="20" cy="20" r="8" fill="#667eea" />
      
      {/* Connected dots */}
      <circle cx="20" cy="8" r="2.5" fill="#764ba2" />
      <circle cx="28" cy="12" r="2.5" fill="#764ba2" />
      <circle cx="32" cy="20" r="2.5" fill="#764ba2" />
      <circle cx="28" cy="28" r="2.5" fill="#764ba2" />
      <circle cx="20" cy="32" r="2.5" fill="#764ba2" />
      <circle cx="12" cy="28" r="2.5" fill="#764ba2" />
      <circle cx="8" cy="20" r="2.5" fill="#764ba2" />
      <circle cx="12" cy="12" r="2.5" fill="#764ba2" />
      
      {/* Connection lines */}
      <line x1="20" y1="20" x2="20" y2="8" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="28" y2="12" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="32" y2="20" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="28" y2="28" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="20" y2="32" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="12" y2="28" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="8" y2="20" stroke="#667eea" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="20" x2="12" y2="12" stroke="#667eea" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
