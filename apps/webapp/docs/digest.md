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

## Handling Long Content with Expand/Collapse

Since the "body" content can sometimes exceed the mobile screen height, we need a UX solution that maintains the immersive, full-screen card experience. After evaluating several options, we recommend **collapse/expand within the same view**. This method preserves context and minimizes disruptive navigation while allowing users to access more details inline.

---

### Expand/Collapse Approach

- **Initial State (Collapsed):**  
  The body content is truncated to fit within the mobile viewport, showing a teaser or preview. At the bottom of the preview, display a subtle gradient or an indicator (like a "Read More" label) to signal that additional content is available.

- **User Interaction:**  
  Tapping on the "Read More" indicator smoothly expands the collapsed section inline, revealing the full content. A "Collapse" or "Show Less" option appears to allow users to return to the original truncated view.

- **Animation & Transition:**  
  Use smooth, spring-like animations for the expand and collapse transitions. This keeps the experience fluid and maintains the immersive feel of the full-screen card.

- **Scroll Handling:**  
  - **Collapsed View:**  
    The truncated content fits exactly within the mobile screen.
  - **Expanded View:**  
    If the expanded content exceeds the screen height, it becomes scrollable.  
    Ensure that the scroll area is clearly bounded to avoid conflicts with the vertical swipe navigation used for switching between digests.
  - **Visual Cues:**  
    Clearly demarcate the expanded content area (with padding or borders) so users can differentiate between scrolling within content and swiping to the next digest.

---

### Pros & Cons

#### Pros
- **Maintains Immersion:**  
  Keeps users within the same full-screen card, avoiding disruptive navigation to a separate view.
- **Smooth Interaction:**  
  Inline expansion/collapse is natural and minimizes context switching.
- **User Control:**  
  Users can choose to read more or collapse the content based on their interest.

#### Cons
- **Potential Overwhelm:**  
  Expanded content may be lengthy, so it’s crucial to handle nested scrolling properly to prevent gesture conflicts.
- **Complexity:**  
  Requires careful management of animation and scroll boundaries to ensure a seamless experience.

---

### Why Expand/Collapse?

This approach is optimal because it:
- **Preserves the Full-Screen Experience:**  
  Users remain within the digest card, which is key to the TikTok-like immersive experience.
- **Ensures Easy Navigation:**  
  The inline expansion is straightforward, allowing users to seamlessly read more content without switching contexts.
- **Balances Information and Engagement:**  
  It provides just enough information initially while giving users the option to dive deeper, thereby managing content density effectively.


### Implementation Considerations

- **Animation:**  
  Utilize hardware-accelerated CSS transitions for a responsive, smooth animation during the expand/collapse process.
  
- **Scroll Handling:**  
  Make sure the expanded area’s scroll is isolated from the card’s swipe gesture. Consider disabling the vertical swipe for navigating between digests when the user is scrolling the expanded content.
  
- **Visual Indicators:**  
  A gradient fade or an arrow at the bottom of the collapsed content can signal additional content. Once expanded, include a clear "Collapse" button to let users easily revert to the truncated view.
  
- **Fallback for Extreme Cases:**  
  If the expanded content is still too long for a comfortable mobile reading experience, consider offering an additional option to navigate to a dedicated view for the full article.

This expand/collapse solution strikes the best balance between maintaining an immersive, swipeable digest view and providing access to detailed content in a mobile-friendly manner.

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