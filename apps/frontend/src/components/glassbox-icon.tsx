export function GlassboxIcon() {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      fill="none"
    >
      <defs>
        {/* Vibrant Gradient: Cyan -> Purple -> Pink */}
        <linearGradient id="mainGrad" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee"/> {/* Cyan 400 */}
          <stop offset="0.5" stopColor="#c084fc"/> {/* Purple 400 */}
          <stop offset="1" stopColor="#f472b6"/> {/* Pink 400 */}
        </linearGradient>
        
        {/* Glossy Reflection */}
        <linearGradient id="glassShine" x1="256" y1="64" x2="256" y2="448" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0.5"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
      
      {/* Isometric Cube Silhouette */}
      <path d="M256 64L448 176V336L256 448L64 336V176L256 64Z" fill="url(#mainGrad)" />
      
      {/* Top Face (Lighter for 3D effect) */}
      <path d="M256 64L448 176L256 288L64 176L256 64Z" fill="white" fillOpacity="0.2" />
      
      {/* Inner "GlassBox" Outline */}
      <path d="M256 192L352 248V360L256 416L160 360V248L256 192Z" stroke="white" strokeWidth="16" strokeOpacity="0.9" strokeLinejoin="round" fill="none"/>
      
      {/* Subtle Overlay for Gloss */}
      <path d="M256 64L448 176V336L256 448L64 336V176L256 64Z" fill="url(#glassShine)" style={{ mixBlendMode: 'overlay' }} />
    </svg>
  );
}