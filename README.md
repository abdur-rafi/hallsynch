
<h1 align="center"> HallSync BackEnd</h1><br />

### table of contents
   * [Overview](#overview)
   * [Configuring backend](#configuring-backend)
   * [Languages, Tools and Frameworks](#tools)
   * [Project Scope](#scope)
   * [Mock UI](#mock)
   * [Project Architecture](#archi)
   * [API Reference](#api-reference)
   * [Modules & Features](#features)
   * [60% Video Demonstration](#video-demonstration)
   * [Contributors](#contribute)
   * [Supervisor](#super)


## Overview<a name="overview"></a>
   This is the backend of CSE 408 Software Development term project <b>HallSync</b> By <b>Syed Jarullah Hisham (1805004)</b>, <b>Abdur Rafi (1805008)</b> & <b>A.H.M Osama Haque (1805002)</b> <br />
   <b>To see frontend of this project, please use this link: </b> [HallSync FrontEnd](https://github.com/hishamcse/hallsync_frontend)

## Configuring backend<a name="configuring-backend"></a>
   1. clone this repository or download the repository as zip and unzip it
   2. typescript should be installed if not already installed. to install typescript globally, run 
       ```bash
         npm install -g typescript
       ```
   3. use terminal inside the project and run
       ```bash
         npm install
       ```
   4. ensure postgres database is ready with a new schema
   5. create a .env file at the root folder. In this file, add an arbitrary value for variable <b>JWTSECRET</b>
      for example:  
      ```bash
        JWTSECRET="helloworld"
      ```
   6. also add the postgres database url variable <b>DATABASE_URL</b>
      for example:  
      ```bash
        DATABASE_URL="postgresql://postgres:hisham@localhost:5432/hallsync_v2?schema=public"
      ```
   7. From terminal, Run
      ```bash
         npx prisma migrate dev
      ```
   8. at the src folder, there is a generateData.ts file which will generate dummy data. From terminal, Run
      ```bash
         ts-node src/generateData.ts
      ```
   9. lastly, run
      ```bash
        npm start
      ```
      This project should work perfectly now on "http://localhost:3000"

## Languages, Tools and Frameworks:<a name="tools"></a>
### frontend:
typescript, reactjs, nextjs, scss, apollo, graphql, react-bootstrap, material ui, recharts

### backend: 
typescript, nodejs, express, apollo, graphql, postgres, prisma

## Project Scope<a name="scope"></a>
* [Scope Presentation](https://docs.google.com/presentation/d/1HZqs8L87hZMDl6vFIrbbXwTb2OujFEmvzw0N6ZqaqfQ/edit?usp=sharing)

## Mock UI<a name="mock"></a>
* [Mock UI Presentation](https://docs.google.com/presentation/d/1im97rgSKxvw3j7o39X7TL8qRPl1_rPDF7WTA1r100UM/edit?usp=sharing)

## Project Architecture<a name="archi"></a>
* [Architecture Presentation](https://docs.google.com/presentation/d/1rpH56H3i_tuJjli4yfSajR5Ape0ViHmi9psTVnRxats/edit?usp=sharing)

## API Reference:<a name="api-reference"></a>
* [Sample API Reference](https://docs.google.com/spreadsheets/d/1bzbqjXmUxGidomrpJ0jKK2NfvzD0NaEjbHeG4WBwJVg/edit?usp=sharing)

## Modules & Features:<a name="features"></a>
* [Full Features Demo](https://docs.google.com/presentation/d/1hdAMp-Ch___syEhl3d1bdcaObi3pzTZ3jvrld7EXEGo/edit?usp=sharing)
   
## 60% Video Demonstration:<a name="video-demonstration"></a>
* [Demo](https://drive.google.com/file/d/1_rRpJUIOU9zjPquxmX92mtss_2Ztj1dl/view)
* Rest 40% part with this 60% all demonstrated in the presentation provided in [Modules & Features](#features) section
 
## Contributors:<a name="contribute"></a>
   * [Syed Jarullah Hisham (1805004)](https://hishamcse.github.io/)
   * [Abdur Rafi (1805008)](https://github.com/abdur-rafi)
   * [A.H.M Osama Haque (1805008)](https://github.com/Osama00112)

## Supervisor:<a name="super"></a>
   * [Dr. Mahmuda Naznin](https://cse.buet.ac.bd/faculty_list/detail/mahmudanaznin) <br />
     Professor <br />
     Department Of Computer Science And Engineering <br />
     Bangladesh University Of Engineering and Technology
     
