type Props = {
  className?: string;
  mirrored?: boolean;
  color?: string;
};

/** Decorative running/hiking traveler silhouette — pure SVG. */
const TravelerSilhouette = ({ className, mirrored, color = "currentColor" }: Props) => (
  <svg
    viewBox="0 0 400 500"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
    aria-hidden="true"
    fill={color}
  >
    {/* head */}
    <circle cx="230" cy="70" r="42" />
    {/* backpack */}
    <rect x="120" y="150" width="110" height="150" rx="28" transform="rotate(-12 175 225)" />
    {/* torso */}
    <path d="M180 130 Q260 130 280 200 Q295 260 250 300 L200 320 Q150 305 145 250 Q145 180 180 130 Z" />
    {/* front arm raised */}
    <path d="M270 180 Q330 170 360 110 Q370 95 360 85 Q345 80 330 100 Q300 145 260 150 Z" />
    {/* back arm */}
    <path d="M165 215 Q120 240 95 295 Q85 315 100 325 Q115 330 130 310 Q160 270 195 260 Z" />
    {/* front leg striding */}
    <path d="M240 290 Q300 350 320 430 Q325 460 305 470 Q285 470 275 445 Q255 380 220 340 Z" />
    {/* back leg lifted */}
    <path d="M195 300 Q150 360 110 400 Q90 415 105 435 Q125 445 145 425 Q190 380 230 350 Z" />
  </svg>
);

export default TravelerSilhouette;
