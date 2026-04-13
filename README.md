# Weekend Parcours App

## Description
The Weekend Parcours App is a mobile-first web application designed to create an interactive experience for planning a weekend getaway for two. The app guides users through a series of choices, allowing them to select dates, destinations, and accommodations, while also providing alternatives and capturing user feedback.

## Features
- **Introduction Screen**: Welcomes users and presents options to view proposals or decline.
- **Date Selection**: Users can choose from multiple date options or suggest alternative dates.
- **Destination Selection**: Users can select from two beautiful destinations (Lac du Salagou and Rocamadour) or suggest alternatives.
- **Accommodation Options**: Displays Airbnb listings based on the selected destination with options for user feedback.
- **Summary Screen**: Provides a recap of user selections, including dates, destinations, accommodations, and a customizable budget.
- **Email Summary**: Sends a summary of user choices and feedback via email using Formsubmit.
- **Responsive Design**: Built with a mobile-first approach, ensuring a modern and elegant user experience.

## Project Structure
```
weekend-parcours-app
├── assets
│   ├── destinations
│   │   ├── lac-du-salagou.jpg
│   │   └── rocamadour.jpg
│   └── logements
│       ├── salagou-airbnb.jpg
│       └── rocamadour-airbnb.jpg
├── index.html
├── style.css
├── script.js
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd weekend-parcours-app
   ```
3. Open `index.html` in a web browser to view the application.

## Deployment on GitHub Pages
1. Push the project to a GitHub repository.
2. Go to the repository settings on GitHub.
3. Scroll down to the "GitHub Pages" section.
4. Select the main branch as the source and save.
5. Access your application at `https://<username>.github.io/<repository-name>/`.

## Customization
- Modify the email recipient in `script.js` to change where the summary is sent.
- Adjust the program details in `script.js` to customize the weekend itinerary based on selected destinations.

## License
This project is open-source and available under the MIT License.