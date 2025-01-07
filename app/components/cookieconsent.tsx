import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sprawdź, czy zgoda na ciasteczka została już zaakceptowana
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Zapisz zgodę w localStorage
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center z-50">
          <p>
            Używamy ciasteczek, aby zapewnić prawidłowe działanie naszej strony. Szczegółowe informacje znajdziesz w naszym{" "}
            <a href="/rules" className="underline">
              regulaminie
            </a>.
          </p>
          <button
            onClick={acceptCookies}
            className="bg-[#7b6b63] hover:bg-[#8c7970] text-white px-4 py-2 rounded"
          >
            Akceptuję
          </button>
        </div>
      )}
    </>
  );
}
