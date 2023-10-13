const { load } = require('cheerio');
const { readFileSync } = require('fs');
const { join } = require('path');

const CATEGORIES_SELECTOR = '.kn-form-col';
const LABEL_SELECTOR = '.kn-input-connection .kn-label span:first-of-type';
const VALUE_SELECTOR = '.control .connection';
const RADIO_SELECTOR = 'input[type="radio"]';
const JUSTIFICATION_LABEL_SELECTOR = '.kn-input-paragraph_text label.kn-label';
const JUSTIFICATION_SELECTOR = '.kn-input-paragraph_text';
const SECTION_BREAK_SELECTOR = '.kn-input-section_break';
const OVERALL_NOTES_LABEL_SELECTOR =
  '.kn-form-group:last-of-type .kn-input-paragraph_text:first-of-type label.kn-label';
const OVERALL_NOTES_SELECTOR =
  '.kn-form-group:last-of-type .kn-input-paragraph_text:first-of-type';

const parseFeedback = (path) => {
  const feedback = readFileSync(path, 'utf8');

  const $ = load(feedback);

  $('*[style*="display: none"]').remove();
  $('*[style*="visibility: hidden"]').remove();
  $('*[style*="opacity: 0"]').remove();

  const categories = $(CATEGORIES_SELECTOR)
    .map((i, el) => {
      const label = $(LABEL_SELECTOR, el).text();

      if (!label) return;

      const rating = $(VALUE_SELECTOR, el)
        .map((i, el) => {
          try {
            const value = $(el).attr('value');
            const { id } = JSON.parse(decodeURIComponent(value))[0];

            let foundRating = '';

            $(el)
              .parent()
              .find(RADIO_SELECTOR)
              .each((i, el) => {
                if ($(el).attr('value') === id) {
                  foundRating = `${i + 1}/5`;
                }
              });

            return foundRating;
          } catch (e) {
            console.error(e);
          }
        })
        .get();

      // Remove justification label
      $(JUSTIFICATION_LABEL_SELECTOR, el).remove();

      const justification = $(JUSTIFICATION_SELECTOR, el)
        .text()
        .trim()
        .replace(/\s+/g, ' ');

      return [
        `Category: ${label}`,
        `Rating: ${rating}`,
        `Justification: ${justification}`,
      ].join('\n');
    })
    .get();

  // Remove section break line
  $(SECTION_BREAK_SELECTOR).remove();

  // Remove overall notes label
  $(OVERALL_NOTES_LABEL_SELECTOR).remove();

  const categoriesText = categories.join('\n\n');

  const overallNotes = $(OVERALL_NOTES_SELECTOR)
    .text()
    .trim()
    .replace(/\s+/g, ' ');

  return [categoriesText, `Overall Notes: ${overallNotes}`].join('\n\n');
};

module.exports = parseFeedback;
