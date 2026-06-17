import React, { useState, useMemo } from 'react';
import ReviewerView from './components/ReviewerView';
import FeedbackPanel from './components/FeedbackPanel';
import { SLIDE_DECKS } from './data/slideDecks';

const TUTORIAL_SLIDES = [
  {
    id: 'tutorial-1',
    type: 'tutorial',
    label: 'Welcome to Homework App',
    title: 'Client Review Mode',
    body: 'Hi Bertrand! This app allows you to review the 211 Truebadour slides asynchronously. For each slide, you can rate how it makes you feel, leave text notes, and dictate audio feedback directly to us.',
    subtext: 'Your expert guidance, without the meetings.',
    quote: 'Time is the most valuable thing a man can spend.',
    author: 'Theophrastus',
    ratio: 'Tutorial',
    image: '',
    accent: '#aa3bff',
  },
  {
    id: 'tutorial-2',
    type: 'tutorial',
    label: 'How it works',
    title: 'The Feedback Loop',
    body: 'Swipe left/right or use the "Next Slide" buttons to move through the curriculum. At the bottom, click "Start Dictation" to speak your thoughts. They will be transcribed automatically. Finally, hit Approve or Disapprove to lock in your feedback for that slide.',
    subtext: 'Feedback is automatically saved locally to your device.',
    quote: 'Feedback is the breakfast of champions.',
    author: 'Ken Blanchard',
    ratio: 'Tutorial',
    image: '',
    accent: '#aa3bff',
  }
];

export default function App() {
  const allSlides = useMemo(() => {
    let curriculum = [];
    // Load all 12 chapters (or however many exist in SLIDE_DECKS)
    Object.keys(SLIDE_DECKS).sort((a,b) => Number(a) - Number(b)).forEach(key => {
      curriculum = curriculum.concat(SLIDE_DECKS[key]);
    });
    return [...TUTORIAL_SLIDES, ...curriculum];
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  const currentSlide = allSlides[currentIndex];

  const handleNext = () => {
    if (currentIndex < allSlides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFeedbackOpen(false); // Close feedback when moving to next slide
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFeedbackOpen(false); // Close feedback when moving to prev slide
    }
  };

  if (!currentSlide) return <div className="p-8 text-white">Loading...</div>;

  const exportData = () => {
    const data = localStorage.getItem('bertrand-homework-feedback');
    if (!data) {
      alert("No feedback saved yet!");
      return;
    }
    const feedbackArray = JSON.parse(data);
    
    // Format it nicely
    let report = "BERTRAND MASTERCLASS REVIEW NOTES\n";
    report += "=================================\n\n";
    
    feedbackArray.forEach(item => {
      report += `Slide ID: ${item.slideId}\n`;
      report += `Voice Match: ${item.styleScore || 'N/A'}/10\n`;
      report += `Verdict: ${item.approval || 'N/A'}\n`;
      if (item.transcription) report += `Dictated Notes: ${item.transcription}\n`;
      if (item.comment) report += `Written Comments: ${item.comment}\n`;
      report += `Time: ${new Date(item.timestamp).toLocaleString()}\n`;
      report += `---------------------------------\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bertrand-review-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      
      {/* Top Header */}
      <div className="flex justify-between items-center p-3 bg-slate-900 border-b border-slate-800 shrink-0 z-20">
         <div className="font-bold text-indigo-400">Homework Review</div>
         <button 
           onClick={exportData}
           className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-bold text-white transition-colors"
         >
           Export Review Data
         </button>
      </div>

      {/* Main Content Area (Full Screen) */}
      <div 
        className="flex-1 relative bg-black/50 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
         <ReviewerView slide={currentSlide} onNext={handleNext} onPrev={handlePrev} />

         {/* Floating Evaluate Button */}
         {!isFeedbackOpen && (
           <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]">
             <button 
               onClick={() => setIsFeedbackOpen(true)}
               style={{ touchAction: 'manipulation' }}
               className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(79,70,229,0.8)] border-2 border-indigo-400 active:bg-indigo-500 whitespace-nowrap flex items-center gap-2"
             >
               📝 Evaluate Slide
             </button>
           </div>
         )}

         {/* Feedback Overlay Drawer */}
         {isFeedbackOpen && (
           <>
             {/* Backdrop */}
             <div 
               className="absolute inset-0 bg-black/60 z-30"
               onClick={() => setIsFeedbackOpen(false)}
             />
             
             {/* Drawer */}
             <div className="fixed inset-x-0 bottom-0 h-[80dvh] md:h-[70dvh] bg-slate-900 border-t-2 border-slate-700 shadow-2xl z-[110] rounded-t-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
                {/* Drawer Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900 shrink-0">
                   <h3 className="font-bold text-white text-lg">📝 Evaluate: {currentSlide.id}</h3>
                   <button 
                     onClick={() => setIsFeedbackOpen(false)} 
                     className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors font-medium text-sm"
                   >
                     Close
                   </button>
                </div>
                
                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto pb-12">
                   <FeedbackPanel 
                     slideId={currentSlide.id} 
                     onNext={handleNext} 
                   />
                </div>
             </div>
           </>
         )}
      </div>
    </div>
  );
}
