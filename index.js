const { load } = require('cheerio');
const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const parseFeedback = require('./parseFeedback');

const NUMBER_PATTERN = /^[A-Za-z-]+?(\d+?)\.html$/;

console.log('Starting feedbacks parsing');

const feedbacks = readdirSync(join(__dirname, 'feedbacks')).filter(
  (file) => file !== 'stub.html',
);

console.log(`Found ${feedbacks.length} feedbacks`);

feedbacks.sort((a, b) => {
  const aNumber = parseInt(NUMBER_PATTERN.exec(a)?.[1]);
  const bNumber = parseInt(NUMBER_PATTERN.exec(b)?.[1]);

  return aNumber - bNumber;
});

const feedbacksParsed = feedbacks.map((feedback, index) => {
  console.log(`Parsing feedback '${feedback}'`);

  const path = join(__dirname, 'feedbacks', feedback);
  const reviewNumber = NUMBER_PATTERN.exec(feedback)?.[1] || index + 1;

  const {
    metadata: { seniority, chapter, relationship, externalName },
    content: parsedFeedback,
  } = parseFeedback(path);

  const seniorityNormalized = /(?<=- ).+/.exec(seniority)?.[0];
  const relationshipNormalized = /[a-zA-Z]+/.exec(relationship)?.[0];

  const internalInfo = chapter ? `${seniorityNormalized} (${chapter})` : '';
  const externalInfo = externalName;

  const reviewerInfo = `${
    internalInfo || externalInfo
  } - ${relationshipNormalized}`;

  return `Reviewer ${reviewNumber} - ${reviewerInfo}\n\n${parsedFeedback}`;
});

const report = feedbacksParsed.join('\n\n--------------------\n\n');

writeFileSync(join(__dirname, 'report.txt'), report);

console.log('Done parsing feedbacks');
console.log(`Report generated at 'report.txt'`);
