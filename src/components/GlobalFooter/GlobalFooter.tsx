import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import './GlobalFooter.css';

interface GlobalFooterProps {
  text?: string;
}

// Normalize text: lowercase everything, then uppercase the first letter of each word.
const toWordStartUpper = (s: string) =>
    (s ?? '')
    .toLowerCase()
    // word start: after start or any non-letter/number/' or ’, uppercase the next letter
    .replace(/(^|[^\p{L}\p{N}'’])(\p{L})/gu, (_m, p1, p2) => p1 + p2.toUpperCase());

const GlobalFooter: React.FC<GlobalFooterProps> = ({ text }) => {
  const location = useLocation();
  const [zoneId, setZoneId] = useState<string>(() => {
    const p = new URLSearchParams(location.search).get('zoneId');
    return p || 'default';
  });

  useEffect(() => {
    const p = new URLSearchParams(location.search).get('zoneId');
    setZoneId(p || 'default');
  }, [location.search]);

  const displayText = useMemo(() => toWordStartUpper(text || ''), [text]);

  return (
    <div
      className={`global-footer ${zoneId} bg-brand-gray h-[30px] lg:h-[50px] w-[100vw] fixed z-1 bottom-0 flex text-[24px] lg:text-[30px] text-brand-forest items-center justify-center`}
    >
      <Marquee className="h-full flex items-center global-footer-marquee">
        <span className="flex items-center h-full global-footer-text">
          {displayText}
        </span>
      </Marquee>
    </div>
  );
};

export default GlobalFooter;
