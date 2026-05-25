import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * REUSABLE MODAL COMPONENT
 * 
 * Why use React Portals?
 * ========================
 * 1. AVOIDS STACKING CONTEXT ISSUES
 *    - Normally, modals inherit stacking context from parent components
 *    - If parent has "position: relative" or any transform, z-index doesn't work across stacking contexts
 *    - Portals render into document.body, creating a NEW stacking context
 *    - This ensures our modal always appears on top, regardless of parent styling
 *
 * 2. SOLVES Z-INDEX CONFLICTS
 *    - Navbar is z-50, but if modal is inside nav, z-index no longer matters
 *    - Portals bypass parent DOM hierarchy, so z-index rules apply universally
 *
 * 3. CLEANER MARKUP
 *    - Modals aren't nested inside page/navbar components
 *    - Easier to debug, style, and manage
 *
 * How children works:
 * ===================
 * The 'children' prop contains the modal content passed by parent components
 * Example: <Modal isOpen={true}><LogoutContent /></Modal>
 * The 'children' destructured from props is then rendered inside the modal container
 */
const Modal = ({ isOpen, onClose, children, closeOnBackdropClick = true }) => {
  useEffect(() => {
    // BODY SCROLL LOCK
    // When modal is open, prevent page scrolling
    // This improves UX by keeping focus on the modal
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // ESC KEY CLOSE SUPPORT
    // Listen for ESC key press and close modal
    // Common UX pattern users expect
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // PORTAL RENDERING
  // createPortal(component, targetDOM)
  // This renders the modal into document.body instead of its parent component
  // This breaks the stacking context and ensures proper z-index layering
  return createPortal(
    <>
      {/* BACKDROP OVERLAY */}
      {/* 
        - Fixed positioning: covers entire viewport
        - z-40: Below modal (which is z-50)
        - Smooth fade animation using opacity transition
        - backdrop-blur-md: Blurs background content for focus
        - closeOnBackdropClick: Click outside to close (UX pattern)
      */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300 ease-out"
        onClick={closeOnBackdropClick ? onClose : undefined}
        role="presentation"
      />

      {/* MODAL CONTAINER */}
      {/*
        - Fixed positioning for viewport-relative placement
        - z-50: Above backdrop, visible to user
        - Flex centering: Centers modal both horizontally and vertically
        - Smooth scale and fade animation on open
      */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        {/* 
          MODAL CONTENT WRAPPER
          - pointer-events-auto: Re-enable click events for modal content
          - animate-in: Smooth scale-up animation (Tailwind CSS)
          - Prevents clicks from passing through to backdrop
        */}
        <div
          className="bg-[#0b0f0d] border border-white/20 rounded-2xl shadow-2xl max-w-sm w-full"
          onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking modal
        >
          {/* children: Modal content (header, body, buttons) */}
          {children}
        </div>
      </div>
    </>,
    document.body // Render this portal into document.body, not parent component
  );
};

export default Modal;
