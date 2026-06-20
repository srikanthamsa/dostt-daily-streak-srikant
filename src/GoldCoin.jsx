export default function GoldCoin({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#D97706" />
      <circle cx="12" cy="12" r="9.5" fill="#F59E0B" />
      <circle cx="12" cy="12" r="7.5" fill="#FCD34D" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="900" fontFamily="sans-serif">₹</text>
    </svg>
  )
}
