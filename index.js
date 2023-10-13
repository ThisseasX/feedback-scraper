const { load } = require('cheerio');
const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const parseFeedback = require('./parseFeedback');

const feedbacks = readdirSync(join(__dirname, 'feedbacks')).filter(
  (file) => file !== 'stub.html',
);

feedbacks.sort((a, b) => {
  const numberPattern = /^[A-Za-z]+?(\d+?)\.html$/;
  const aNumber = parseInt(numberPattern.exec(a)?.[1]);
  const bNumber = parseInt(numberPattern.exec(b)?.[1]);

  return aNumber - bNumber;
});

const feedbacksParsed = feedbacks.map((feedback, index) => {
  const path = join(__dirname, 'feedbacks', feedback);
  const parsedFeedback = parseFeedback(path);
  return `Reviewer ${index + 1}\n\n${parsedFeedback}`;
});

const report = feedbacksParsed.join('\n\n--------------------\n\n');

writeFileSync(join(__dirname, 'report.txt'), report);
