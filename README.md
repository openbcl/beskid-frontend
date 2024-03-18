> [!CAUTION]
> *At the moment this web application and corresponding api are only intended for test purposes. Results of calculated tasks will only provide random data!*
> *This site will be available for productive use as soon as the <a href="https://www.beskid-projekt.de/en/projekt/modellierung">modeling project phase</a> has been successfully completed.*

<img src="https://www.beskid-projekt.de/@@project-logo/Logo_text_500px.png" width="35%" alt="BESKID Logo"/><br>

**BE**messungsbrandsimulationen in **S**chienenfahrzeugen mittels **KI**-basierter **D**aten

Design fire simulation in railway vehicles using AI-based data

# BESKID Web App
The goal of the [BESKID](https://www.beskid-projekt.de/en) project, funded by the Federal Ministry of Education and Research (BMBF), is to develop and experimentally validate AI-based methods for calculating design fires. The project started in 2022.

Previous approaches to detailed modeling of fire spread in rail vehicles have required a large number of experiments, extensive optimization, and extensive variant calculations. In this project, two complementary AI approaches, KIM (Material AI System) and KIB (Fire AI System), are being researched and implemented. KIM aims to completely reduce the optimization calculations required for determining material parameters, allowing for the determination of necessary material parameters solely from data obtained from a few tests, such as the Cone Calorimeter. This test is already used for the fire protection assessment of all relevant components of rail vehicles, as required by the European standard (EN 45545-2), so the proposed AI approach (KIM) will eliminate the need for additional effort in design fire simulations in the future. KIB aims to significantly shorten the high computational cost for variation calculations of the entire vehicle and focuses on fast calculation of fire spread variations. The goal is to replace the cost-intensive traditional models used for variant calculations of design fires with the KIB AI system.

This website allows you to use the AI system "KIM" and determine material parameters by creating tasks and uploading your input data.

## How to get this app
```bash
# Clone this repository 
git clone https://github.com/openbcl/beskid-frontend.git
```

Make sure that *Node.js* is installed.

## Configuration
You will find two files under the path "src/environments" in which the address to the backend can be stored for the development and production mode respectively.

## Running the app

```bash
# development watch mode
# (The application will automatically reload if you change any of the source files.)
$ npm run start:dev

# dev-production mode
$ npm run start
```

Open your browser and visit http://localhost:4200/

## Build the app

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
