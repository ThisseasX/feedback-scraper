# feedback-scraper

Scraping feedback from html.

# Usage

## 1. Clone the project

```sh
> git clone https://github.com/ThisseasX/feedback-scraper.git
```

## 2. Download depencencies

```sh
> npm install
```

## 3. Gather feedback

Go to your desired feedback app and copy the outer html of the feedback page.

## 4. Remove stub

Remove the file `stub.html` from the `/feedbacks` directory.

## 5. Create html feedback

Paste the html into a file called `feedback1.html` inside the `/feedbacks` directory.

## 6. Repeat html creation

Repeat step 5 for as many feedback pages as you want to scrape, incrementing the number in the name by 1.

## 7. Run or watch

Run the project with:

```sh
> npm start
```

Or watch for file changes with:

```sh
> npm run dev
```

This will scrape the feedback off the html files.

## 8. Report

The collected feedbacks will be saved in a file called `report.txt` at the root of the project.
