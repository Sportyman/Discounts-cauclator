
import React, { useState, useMemo, useEffect } from 'react';

// --- Theme Definitions ---
const themes = {
  default: {
    name: 'ברירת מחדל',
    headerColor: '#4c1d95',
    presetButtonBg: '#7c3aed',
    manualButtonBg: '#0ea5e9',
    finalPriceColor: '#0284c7',
    resetButtonBg: '#ec4899',
    bodyBg: 'bg-violet-50',
    containerBg: 'bg-white',
    font: 'font-assistant',
    buttonClasses: 'rounded-lg shadow-md hover:shadow-lg transition-shadow',
    numpadClasses: 'bg-white border border-gray-200 text-gray-800 active:bg-gray-100 rounded-lg',
    priceDisplayClasses: 'border border-gray-200 bg-white rounded-lg',
    headerClasses: 'font-bold',
  },
  cartoon: {
    name: 'מחשבון מצויר',
    headerColor: '#4a4a4a',
    presetButtonBg: '#ff8a80', // Soft red
    manualButtonBg: '#80deea', // Soft cyan
    finalPriceColor: '#d32f2f', // Darker red
    resetButtonBg: '#ef9a9a', // Lighter red
    bodyBg: 'bg-[#fdfaef]', // Creamy background
    containerBg: 'bg-[#fffde7]', // Light yellow paper
    font: 'font-assistant',
    buttonClasses: 'border-2 border-gray-500 shadow-lg rounded-lg transform active:scale-95 transition-transform',
    numpadClasses: 'bg-white border-2 border-gray-400 text-gray-800 active:bg-gray-200 shadow-sm rounded-lg',
    priceDisplayClasses: 'border-2 border-gray-400 bg-[#e0f7fa] rounded-lg', // Light teal
    headerClasses: 'font-extrabold',
  },
  pencilSketch: {
    name: 'סקיצת עיפרון',
    headerColor: '#4a4e69',
    presetButtonBg: '#ffca3a',
    manualButtonBg: '#8ac926',
    finalPriceColor: '#d00000',
    resetButtonBg: '#ff595e',
    bodyBg: 'bg-[#f4f1de]',
    containerBg: 'bg-[#fefae0]',
    font: 'font-patrick-hand',
    buttonClasses: 'rounded-lg transition-transform active:scale-95 text-gray-800 font-bold',
    numpadClasses: 'bg-[#e9ecef] rounded-lg transition-transform active:scale-95 text-gray-800 font-bold',
    priceDisplayClasses: 'bg-[#dee2e6] rounded-lg font-mono',
    headerClasses: 'font-bold text-4xl',
    buttonBorderStyle: {
      borderStyle: 'solid',
      borderWidth: '4px',
      borderImageSlice: 10,
      borderImageRepeat: 'round',
      borderImageSource: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNIDUgNiBDIDE1IDMgMzAgOCA0MCA1IDUwIDIgNjUgNyA3NSA0IDg1IDEgOTUgNiA5NiA1IE0gOTUgNSBDIDk4IDE1IDkzIDMwIDk2IDQwIDk5IDUwIDk0IDY1IDk3IDc1IDEwMCA4NSA5NSA5NSA5NSA5NiBNIDk2IDk1IEMgODUgOTggNzAgOTMgNjAgOTYgNTAgOTkgMzUgOTQgMjUgOTcgMTUgMTAwIDUgOTUgNCA5NSBNIDUgOTYgQyAyIDg1IDcgNzAgNCA2MCAxIDUwIDYgMzUgMyAyNSAwIDE1IDUgNSA1IDQgTSA3IDggQyAxNyA1IDMyIDEwIDQyIDcgNTIgNCA2NyA5IDc3IDYgODcgMyA5NyA4IDk4IDcgTSA5NyA3IEMgMTAwIDE3IDk1IDMyIDk4IDQyIDEwMSA1MiA5NiA2NyA5OSA3NyAxMDIgODcgOTcgOTcgOTcgOTggTSA5OCA5NyBDIDg3IDEwMCA3MiA5NSA2MiA5OCA1MiAxMDEgMzcgOTYgMjcgOTkgMTcgMTAyIDcgOTcgNiA5NyBNIDcgOTggQyA0IDg3IDkgNzIgNiA2MiAzIDUyIDggMzcgNSAyNyAyIDE3IDcgNyA3IDYiIHN0cm9rZT0iIzQ5NTE1NSIgc3Ryb2tlLXdpZHRoPSIxLjgiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')`,
      boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.15)',
    },
  },
  night: {
    name: 'לילה',
    headerColor: '#f1f5f9',
    presetButtonBg: '#059669',
    manualButtonBg: '#6d28d9',
    finalPriceColor: '#22d3ee',
    resetButtonBg: '#be123c',
    bodyBg: 'bg-slate-900',
    containerBg: 'bg-slate-800',
    font: 'font-assistant',
    buttonClasses: 'transition-colors rounded-lg shadow-md shadow-black/20',
    numpadClasses: 'bg-slate-700 border border-slate-600 text-white active:bg-slate-600 rounded-lg',
    priceDisplayClasses: 'border border-slate-600 bg-slate-900 text-white rounded-lg',
    headerClasses: 'font-bold text-slate-100',
  },
  sleek: {
    name: 'אלגנטי',
    headerColor: '#1f2937',
    presetButtonBg: '#f9fafb',
    presetButtonTextColor: '#374151',
    manualButtonBg: '#2563eb',
    manualButtonTextColor: '#FFFFFF',
    finalPriceColor: '#1e40af',
    resetButtonBg: '#4b5563',
    resetButtonTextColor: '#FFFFFF',
    bodyBg: 'bg-slate-50',
    containerBg: 'bg-white',
    font: 'font-assistant',
    buttonClasses: 'rounded-lg shadow-sm border border-gray-200 transition-all transform hover:-translate-y-px active:translate-y-0',
    numpadClasses: 'bg-white border border-gray-200 text-gray-800 active:bg-gray-100 rounded-lg shadow-sm',
    priceDisplayClasses: 'bg-gray-50 border-b-2 border-gray-200 rounded-t-lg',
    headerClasses: 'font-semibold tracking-wide',
  },
  retro: {
    name: 'רטרו',
    headerColor: '#433434',
    presetButtonBg: '#e17055',
    manualButtonBg: '#00b894',
    finalPriceColor: '#0984e3',
    resetButtonBg: '#fdcb6e',
    bodyBg: 'bg-[#fdf6e3]',
    containerBg: 'bg-[#eee8d5]',
    font: 'font-assistant',
    buttonClasses: 'border-b-4 border-black/20 rounded-md active:border-b-2 font-bold text-white',
    numpadClasses: 'bg-[#bdae9c] border-b-4 border-black/20 text-black active:bg-gray-400 rounded-md',
    priceDisplayClasses: 'border-2 border-[#586e75] bg-[#93a1a1] font-mono text-black rounded-sm',
    headerClasses: 'font-bold tracking-wider',
  },
  nature: {
    name: 'טבע',
    headerColor: '#1e4620',
    presetButtonBg: '#55a630',
    manualButtonBg: '#80b918',
    finalPriceColor: '#386641',
    resetButtonBg: '#a3b18a',
    bodyBg: 'bg-[#f2f2f2]',
    containerBg: 'bg-[#fefcfb]',
    font: 'font-assistant',
    buttonClasses: 'transition-all rounded-full shadow-sm hover:shadow-md border border-black/5 transform active:scale-95',
    numpadClasses: 'bg-[#dde5b6] border border-green-200 text-green-900 active:bg-green-200 rounded-full shadow-inner',
    priceDisplayClasses: 'border-0 bg-[#f0ead2] rounded-lg',
    headerClasses: 'font-bold',
  },
  energetic: {
    name: 'אנרגטי',
    headerColor: '#e11d48',
    presetButtonBg: '#8b5cf6',
    manualButtonBg: '#f97316',
    finalPriceColor: '#0891b2',
    resetButtonBg: '#ef4444',
    bodyBg: 'bg-gray-100',
    containerBg: 'bg-white',
    font: 'font-assistant',
    buttonClasses: 'transition-transform active:scale-95 rounded-xl shadow-md font-bold',
    numpadClasses: 'bg-white border-2 border-gray-800 text-gray-800 active:bg-yellow-200 font-bold rounded-xl',
    priceDisplayClasses: 'border-b-4 border-rose-400 bg-white rounded-t-lg',
    headerClasses: 'font-extrabold tracking-tight',
  },
};

type ThemeName = keyof typeof themes;

type HistoryEntry = {
  id: string;
  originalPrice: number;
  appliedDiscounts: number[];
  finalPrice: number;
  timestamp: number;
};


// --- Main Application Component ---

const App: React.FC = () => {
  const [priceStr, setPriceStr] = useState<string>('');
  const [manualDiscountStr, setManualDiscountStr] = useState<string>('');
  const [discounts, setDiscounts] = useState<{ id: number; value: number; active: boolean }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [theme, rawSetTheme] = useState<ThemeName>(() => {
    try {
        const savedTheme = localStorage.getItem('calculator-theme') as ThemeName;
        return savedTheme && themes[savedTheme] ? savedTheme : 'default';
    } catch (error) {
        console.error("Could not access localStorage:", error);
        return 'default';
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const savedHistory = localStorage.getItem('calculator-history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Could not load history from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('calculator-history', JSON.stringify(history));
    } catch (error) {
      console.error("Could not save history to localStorage:", error);
    }
  }, [history]);

  const setTheme = (newTheme: ThemeName) => {
    try {
        localStorage.setItem('calculator-theme', newTheme);
    } catch (error) {
        console.error("Could not save theme to localStorage:", error);
    }
    rawSetTheme(newTheme);
  };

  const currentTheme = themes[theme];

  const presetDiscounts = [80, 70, 60, 50, 40, 30, 20, 10];
  const numpadLayout = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
  
  const currentMonth = new Date().toLocaleString('he-IL', { month: 'long' });

  const adUnitCode = `
    <div style="text-align:center; padding: 16px; color: #555; background-color: #e0e0e0; font-size: 14px;">
      שטח המיועד לפרסומת באנר
    </div>
  `;

  const handleNumpad = (value: string) => {
    if (value === '⌫') {
      setPriceStr(current => current.slice(0, -1));
    } else if (value === '.') {
      if (!priceStr.includes('.')) {
        setPriceStr(current => (current === '' ? '0.' : current + '.'));
      }
    } else {
        if(priceStr.length < 10) {
            setPriceStr(current => current + value);
        }
    }
  };

  const addDiscount = (value: number) => {
    if (isNaN(value) || value < 0 || value > 100) {
      alert('אנא הזן אחוז הנחה חוקי (0-100).');
      return;
    }
    setDiscounts(current => [...current, { id: nextId, value, active: true }]);
    setNextId(prev => prev + 1);
  };
  
  const handleManualDiscountAdd = () => {
    const value = parseFloat(manualDiscountStr);
    addDiscount(value);
    setManualDiscountStr('');
  };
  
  const handleManualDiscountKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleManualDiscountAdd();
    }
  };
  
  const toggleDiscount = (id: number) => {
    setDiscounts(current =>
      current.map(d => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const removeDiscount = (id: number) => {
    setDiscounts(current => current.filter(d => d.id !== id));
  };
  
  const finalPrice = useMemo(() => {
    const initialPrice = parseFloat(priceStr) || 0;
    if (initialPrice === 0) return 0;

    return discounts.reduce((currentPrice, discount) => {
      if (discount.active) {
        return currentPrice * (1 - discount.value / 100);
      }
      return currentPrice;
    }, initialPrice);
  }, [priceStr, discounts]);

  const handleResetCalculation = () => {
    const originalPrice = parseFloat(priceStr);
    const activeDiscounts = discounts.filter(d => d.active).map(d => d.value);

    if (originalPrice > 0 && activeDiscounts.length > 0) {
      const newEntry: HistoryEntry = {
        id: `calc-${Date.now()}`,
        originalPrice: originalPrice,
        appliedDiscounts: activeDiscounts,
        finalPrice: finalPrice,
        timestamp: Date.now(),
      };
      setHistory(current => [newEntry, ...current]);
    }

    setPriceStr('');
    setDiscounts([]);
    setManualDiscountStr('');
  };

  return (
    <div className={`flex justify-center ${currentTheme.bodyBg} ${currentTheme.font}`}>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} aria-hidden="true">
          <div
            className="absolute top-0 right-0 h-full w-72 bg-white shadow-xl p-6 z-50 transform transition-transform translate-x-0"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-title"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 id="menu-title" className="text-2xl font-bold text-gray-800">תפריט</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
             <div className="border-b mb-4 pb-4">
                <button
                    onClick={() => {
                        setIsHistoryOpen(true);
                        setIsMenuOpen(false);
                    }}
                    className="w-full text-right p-3 rounded-lg transition-colors hover:bg-gray-100 font-semibold text-gray-700"
                >
                    היסטוריית מחירים
                </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">ערכות נושא</h3>
              <div className="space-y-2">
                {(Object.keys(themes) as ThemeName[]).map(themeKey => (
                   <button
                      key={themeKey}
                      onClick={() => {
                        setTheme(themeKey);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-right p-3 rounded-lg transition-colors ${
                        theme === themeKey ? 'bg-sky-100 text-sky-800 font-bold' : 'hover:bg-gray-100'
                      }`}
                   >
                      {themes[themeKey].name}
                   </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-center" onClick={() => setIsHistoryOpen(false)}>
            <div
            className={`absolute top-0 right-0 h-full w-full max-w-[420px] shadow-2xl p-6 z-50 transform transition-transform translate-x-0 flex flex-col ${currentTheme.bodyBg} ${currentTheme.containerBg}`}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
            >
            <div className="flex justify-between items-center mb-6">
                <h2 id="history-title" className="text-2xl font-bold" style={{ color: currentTheme.headerColor }}>היסטוריית מחירים</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="Close history">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {history.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">אין היסטוריה להצגה.</p>
                ) : (
                history.map(entry => (
                    <div key={entry.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-400 mb-2">{new Date(entry.timestamp).toLocaleString('he-IL')}</p>
                    <p className="text-sm text-gray-600">
                        מחיר מקורי: <span className="font-semibold">{entry.originalPrice.toLocaleString('he-IL')} ₪</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        הנחות: <span className="font-semibold">{entry.appliedDiscounts.join('%, ')}%</span>
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ color: currentTheme.finalPriceColor }}>
                        מחיר סופי: {entry.finalPrice.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪
                    </p>
                    </div>
                ))
                )}
            </div>
            {history.length > 0 && (
                <div className="mt-4 flex-shrink-0">
                <button
                    onClick={() => {
                    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?')) {
                        setHistory([]);
                    }
                    }}
                    className={`w-full py-3 font-semibold text-white rounded-lg ${currentTheme.buttonClasses}`}
                    style={{ backgroundColor: currentTheme.resetButtonBg, color: (currentTheme as any).resetButtonTextColor || 'white', }}
                >
                    נקה היסטוריה
                </button>
                </div>
            )}
            </div>
        </div>
        )}


      <div className={`w-full max-w-[420px] mx-auto flex flex-col h-screen overflow-hidden shadow-2xl ${currentTheme.containerBg}`}>
        <header className="relative p-4 text-center mt-4 flex-shrink-0">
          <h1 className={`text-3xl ${currentTheme.headerClasses}`} style={{color: currentTheme.headerColor}}>מחשבון הנחות</h1>
          <button onClick={() => setIsMenuOpen(true)} className="absolute top-5 left-4 p-2 text-gray-600 hover:text-gray-900" aria-label="Open settings menu">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
          </button>
        </header>

        <main className="flex-grow p-2 flex flex-col gap-2">
          <div className="grid grid-cols-8 gap-1.5">
            {presetDiscounts.map(discount => (
              <button
                key={discount}
                onClick={() => addDiscount(discount)}
                className={`flex-shrink-0 w-full h-10 flex items-center justify-center p-1 font-semibold ${currentTheme.buttonClasses}`}
                style={{
                  backgroundColor: currentTheme.presetButtonBg,
                  color: (currentTheme as any).presetButtonTextColor || 'white',
                  ...((currentTheme as any).buttonBorderStyle || {}),
                }}
              >
                {discount}%
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="decimal"
              value={manualDiscountStr}
              onChange={(e) => setManualDiscountStr(e.target.value)}
              onKeyPress={handleManualDiscountKeyPress}
              placeholder="% הנחה"
              className={`flex-grow p-2 text-lg border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-sky-500`}
              aria-label="Manual discount percentage"
            />
            <button
              onClick={handleManualDiscountAdd}
              className={`px-4 py-2 font-semibold hover:opacity-90 active:opacity-80 ${currentTheme.buttonClasses}`}
              style={{
                backgroundColor: currentTheme.manualButtonBg,
                color: (currentTheme as any).manualButtonTextColor || 'white',
                ...((currentTheme as any).buttonBorderStyle || {}),
              }}
            >
              הוספה ידנית
            </button>
          </div>
          
          <div className={`p-2 text-4xl h-14 flex items-center justify-end font-sans ${currentTheme.priceDisplayClasses}`}
            style={{...((currentTheme as any).buttonBorderStyle || {})}}
          >
            {priceStr ? (
              <span className="text-gray-800">{priceStr}</span>
            ) : (
              <span className="text-gray-400 w-full text-right text-lg">הזינו מחיר</span>
            )}
          </div>

          {discounts.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50 min-h-[44px]">
              {discounts.map((discount, index) => (
                <div
                  key={discount.id}
                  onClick={() => toggleDiscount(discount.id)}
                  className={`relative flex items-center justify-center p-2 px-3 rounded-md cursor-pointer transition-colors ${
                    discount.active ? 'bg-sky-200' : 'bg-gray-300'
                  }`}
                >
                  <span className={`font-semibold text-sm ${discount.active ? 'text-sky-800' : 'text-gray-600'}`}>
                    {discount.value}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDiscount(discount.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                    aria-label={`Remove ${discount.value}% discount`}
                  >
                    X
                  </button>
                  <span className="absolute top-0 left-1 text-xs font-bold text-gray-500">{index + 1}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center py-1">
            <span className="text-2xl font-bold text-gray-800">מחיר סופי: </span>
            <span className="text-3xl font-extrabold" style={{color: currentTheme.finalPriceColor}}>
              {finalPrice.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="font-bold"> ₪</span>
            </span>
          </div>

          <button
            onClick={handleResetCalculation}
            className={`w-full text-xl font-bold py-3 hover:opacity-90 active:opacity-80 ${currentTheme.buttonClasses}`}
            style={{
              backgroundColor: currentTheme.resetButtonBg,
              color: (currentTheme as any).resetButtonTextColor || 'white',
              ...((currentTheme as any).buttonBorderStyle || {}),
            }}
          >
            איפוס חישוב
          </button>

          <div className="grid grid-cols-3 gap-2 flex-grow">
             {numpadLayout.map(key => (
              <button
                key={key}
                onClick={() => handleNumpad(key)}
                className={`text-3xl h-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${currentTheme.numpadClasses}`}
                aria-label={`Numpad ${key}`}
                style={{...((currentTheme as any).buttonBorderStyle || {})}}
              >
                {key}
              </button>
            ))}
          </div>
        </main>
        
        <footer className="mt-auto flex-shrink-0">
          <div className="bg-amber-100 border-t border-amber-200 p-3 text-center">
            <a href="https://s.click.aliexpress.com/e/_oEcAHoN" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline">🎁 קופונים עדכניים • {currentMonth}</a>
          </div>
          <div 
            className="bg-gray-200"
            dangerouslySetInnerHTML={{ __html: adUnitCode }} 
          />
        </footer>
      </div>
    </div>
  );
};

export default App;
