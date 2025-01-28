    # Product Specification: Daily Digest Reading Flow

    ## 1. Purpose
    Provide a streamlined, customizable reading experience for the user’s daily digest.  
    Focus on:
    - Quick scanning of daily news highlights  
    - In-line feedback/tuning features  
    - Seamless navigation through multiple sections  

    ## 2. Scope
    This specification covers:
    - **Digest Overview Layout**: How to present the day’s highlights  
    - **Section Details**: Each topic/section’s structure  
    - **Reading Flow & Interaction**: Collapsing sections, feedback, and navigation  
    - **Proposed JSON Enhancements**: Fields missing from the current data structure  

    ---
    ## 3. Proposed Reading Flow

    ### 3.1 Digest Overview (Landing)
    - **Hero / Dashboard**:  
      - Displays an at-a-glance view of the day’s important topics.  
      - Should include minimal text: highlight each section’s title and a short teaser (one-liner).  
      - Include a progress indicator or “x sections to explore” label.  

    - **Quick Navigation**:  
      - A horizontal (or vertical on mobile) navbar or floating menu listing each section’s title.  
      - Clicking/tapping a section anchor scrolls or jumps the user to that section.  

    ### 3.2 Section Cards
    - **Collapsible Cards**:  
      - By default, each section shows a concise summary (teaser).  
      - On expand, display the full body text and article links.  
    - **Body Text**:  
      - Provide short bullet points or a short paragraph.  
      - Include optional inline images or icons for visual appeal.  
    - **Article Links**:  
      - Display each link with a short preview (e.g., “Headline: ...”).  
      - Offer a “Read More” button that opens the link in a new tab/window.  

    ### 3.3 In-Line Tuning and Feedback
    - **Feedback Controls**:  
      - For each section, provide a quick rating mechanism (thumbs up/down, star rating, or “More like this / Less like this” toggle).  
      - Optional: A text field or short select box to specify reasons (e.g., “Too long”, “Not relevant”).  
    - **Adaptive Layout**:  
      - Users can reorder sections (drag-and-drop) or mark a section as “skip” to hide it from the overview.  
    - **Instant Updates**:  
      - If a user gives feedback, show a small confirmation toast or message: “We’ll adjust future digests.”  

    ### 3.4 Progress & Completion
    - **Progress Bar**:  
      - Shows how many sections are left.  
      - Resides at the top or bottom of the digest.  
    - **Completion Screen**:  
      - After all sections are read (or marked complete), display a short summary: “Thanks for reading! You can always tweak your preferences in Settings.”  

    ---
    ## 4. Proposed JSON Enhancements

    The current JSON structure:
    ```json
    {
      "sections": [
        {
          "article_links": [...],
          "body": [...],
          "title": "..."
        },
        ...
      ]
    }
    ```
    **Missing Fields**:
    1. **Teaser**  
       - A short summary for each section to be displayed in the overview.  
       - Example: `"teaser": "קצר וקולע, סיכום של הנקודות העיקריות..."`
    2. **Category / Tag**  
       - Indicates the type of content (e.g., “News”, “Food”, “Tech”).  
       - Useful for filtering, reordering, or theming each section.  
       - Example: `"category": "Politics"`  
    3. **Highlights**  
       - A bullet list of 1–3 main points in each section.  
       - Example: `"highlights": ["Point A", "Point B", "Point C"]`  
    4. **Reading Preferences** (Optional)  
       - Could store user-specific feedback or ratings for each section.  
       - Example: `"userFeedback": { "likeLevel": 3, "reason": "Interesting" }`
    5. **Thumbnail / Icon** (Optional)  
       - A small image or icon representing each section.  
       - Example: `"iconUrl": "https://mysite.com/images/news-icon.png"`  

    **Enhanced JSON Example**:
    ```json
    {
      "sections": [
        {
          "category": "News",
          "title": "חדשות חמות: עימותים וחשיפות",
          "teaser": "עימותים בוועדת החוץ, גל אלימות ורשת ריגול ישראלית...",
          "highlights": [
            "עימות סוער בוועדת החוץ והביטחון",
            "3 מקרי רצח ביממה",
            "חשיפת רשת ריגול למילואימניקים"
          ],
          "body": [
            "היום בחדשות, עימותים סוערים... (full text)"
          ],
          "article_links": [
            "https://www.ynet.co.il/news/article/r1hidghdyg",
            "https://www.ynet.co.il/news/article/hkbktezruye",
            "https://www.ynet.co.il/news/article/hj2khmrokl"
          ],
          "iconUrl": "https://mysite.com/icons/news-hot.png"
        },
        ...
      ]
    }
    ```

    ---
    ## 5. Technical Implementation Notes

    1. **UI Rendering**  
       - Use collapsible panels for each section.  
       - Display “teaser” in the collapsed state; display “body” and “article_links” in the expanded state.  

    2. **Feedback Handling**  
       - Each time a user interacts with a feedback control, make an asynchronous call to update user preferences in your backend.  
       - Use immediate UI feedback (e.g., a toast message).  

    3. **Navigation**  
       - Provide a sticky nav or a floating menu with all section titles.  
       - Each title is linked to the relevant section anchor for quick jumps.  

    4. **Responsive Design**  
       - On mobile, implement swipe gestures to move between sections.  
       - Maintain collapsible behavior to reduce scrolling.  

    5. **Versioning**  
       - If the JSON format changes, ensure backward compatibility or provide version identifiers in your API responses.  

    ---
    ## 6. Next Steps

    1. **Finalize JSON Structure**: Decide on the optional fields (teaser, category, highlights, etc.).  
    2. **Design Mockups**: Create wireframes and/or high-fidelity designs for the reading flow on both desktop and mobile.  
    3. **Prototype User Feedback**: Test different rating mechanisms (thumbs, sliders, etc.) to see which yields the best engagement.  
    4. **Iterate**: Gather user feedback, refine UI/UX, and repeat.  

    ---
    ## 7. Conclusion
    Implementing the above reading flow ensures a quick, intuitive, and highly personalized user experience. By enhancing the JSON structure, we gain flexibility in presenting concise teasers, highlights, and category-based layouts—leading to a more engaging and user-friendly daily digest.