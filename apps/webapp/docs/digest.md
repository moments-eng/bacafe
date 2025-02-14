    # Mobile News Digest Layout and UX Description

    The digest page is designed as a full-screen card optimized for mobile devices. Users can swipe vertically (à la TikTok) to transition between individual digests. Each card displays key information while ensuring that interactive elements (share, like, dislike) are always accessible.

    ## Overall Concept

    - **Full-Screen Cards:**  
      Each digest occupies the entire mobile screen, ensuring a focused, immersive experience.
    - **Swipe Navigation:**  
      Users can swipe vertically to move from one digest to another with smooth, spring-like animations.
    - **Interactive Elements:**  
      Integrated like, dislike, and share buttons provide immediate feedback and social engagement opportunities.

    ## Layout Structure

    ### 1. Header Area
    - **Category & Title:**
      - Positioned at the top over a semi-transparent overlay or within a dedicated header bar on the background image.
      - Ensures legibility regardless of the underlying image brightness.
    - **Action Buttons:**
      - **Share Button:** Located in the top right corner for quick access.
      - **Like/Dislike Buttons:**  
        - **Option 1:** Positioned alongside the share button in the header for immediate visibility.  
        - **Option 2:** Alternatively, included in a sticky footer if that better suits the interaction model.
    - **Consideration:**
      - The header should remain visible (either fixed or with a parallax effect) so users always know which digest they’re viewing.

    ### 2. Main Visual Area
    - **Background Image:**
      - Occupies the top third or half of the screen, setting the mood for the digest.
    - **Gradient Overlay:**
      - A subtle gradient overlay (top-to-bottom) ensures that any overlaid text remains readable against the image.

    ### 3. Content Section (Mid to Lower Area)
    - **Teaser & Highlights:**
      - Placed immediately under the visual area, displaying a brief teaser and a bullet/numbered list of key highlights.
    - **Body Content:**
      - **Short Content:**  
        - Displayed fully if the text is brief.
      - **Long Content:**  
        - For lengthy articles, implement a scrollable container within the card.
      - **Constraints:**
        - The scrollable container must be visually distinct from the swipe navigation area.
        - Use a “read more” button or a fading gradient cue to indicate additional content.
        - Ensure clear boundaries (via padding/margin) to avoid gesture conflicts between internal scrolling and swiping to the next digest.
    - **Typography:**
      - Utilize a legible font size with ample line spacing.
      - Employ visual hierarchy with bold or larger fonts for titles and slightly smaller fonts for the body text.

    ### 4. Footer Area
    - **Metadata:**
      - Includes details such as read time, published date, or other relevant info.
    - **Persistent Action Bar (Optional):**
      - If not already in the header, a sticky footer can house the like, dislike, and share buttons.
      - **Button States:**
        - **Like/Dislike:**  
          - Tapping should visually change the button (e.g., filled icon) while disabling the alternate choice.
          - Include a brief animation (e.g., a bounce) to confirm the action.
        - **Share:**  
          - Tapping opens the device’s native sharing dialog with a smooth transition.

    ## Interaction and Behaviors

    - **Vertical Swipe Navigation:**
      - Entire cards are swipeable with smooth, spring-like transitions.
      - **Nested Scrolling:**
        - Differentiate clearly between a swipe meant for scrolling within long body content and swiping between digests.
        - Use a distinct boundary or a “handle” at the top of the scrollable content container.
        - Optionally, disable swipe-to-navigate when the pointer is within the body’s scrollable area, re-enabling it only when scrolled to the top.
    - **Action Button Feedback:**
      - **Like/Dislike:**  
        - Provide immediate visual feedback by changing the state of the tapped button (e.g., color change, fill effect).
      - **Share:**  
        - Should trigger the mobile device’s native sharing interface seamlessly.
    - **Handling Long Content:**
      - **Expandable Area:**  
        - If the body text is lengthy, show an initial preview with a “read more” option. On tap, the full content is revealed (via slide or fade-in).
      - **Scroll Indicator:**  
        - Include a subtle indicator (fading gradient or arrow) to suggest additional content is available.
    - **Performance & Consistency:**
      - Optimize images for mobile using lazy or progressive loading.
      - Ensure all animations and transitions are hardware-accelerated (e.g., using CSS transforms) for a smooth experience.

    ## Constraints and Key Considerations

    - **Mobile-First Design:**
      - Ensure all elements are touch-friendly, with buttons having a minimum touch area of about 44x44 points.
      - Text must be legible under various lighting conditions through appropriate contrast and overlays.
    - **Accessibility:**
      - Interactive elements should be navigable via screen readers.
      - Use semantic HTML and ARIA roles where necessary.
      - Support high-contrast modes.
    - **Visual Hierarchy:**
      - Prioritize critical information (title, teaser, highlights) over extended body content.
      - Use color, spacing, and typography to naturally guide users through the digest.
    - **Gesture Handling & Behavioral Conflicts:**
      - Ensure a clear distinction between scrolling within content and swiping between cards.
      - Extensive testing on real devices is crucial to refine gesture recognition and avoid conflicts.
    - **Content Overflow:**
      - Design an intuitive solution for long content, ensuring users can easily access additional details without compromising the full-screen experience.

    ## Final Thoughts

    This design employs an immersive, full-screen card layout with intuitive vertical swipe navigation, allowing for seamless transitions between digests. Interactive elements such as like, dislike, and share buttons are always accessible, providing immediate feedback and enhancing user engagement. Detailed attention to touch targets, nested scrolling behavior, and performance optimization ensures a stellar mobile experience.

    This document should serve as a comprehensive guide for the frontend team to implement an engaging and high-performance news digest page.