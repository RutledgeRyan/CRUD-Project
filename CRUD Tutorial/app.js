import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from "url";
import methodOverride from 'method-override';


import { setupDatabase, getDBConnection } from './database2.js';
setupDatabase().catch(console.error);



const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files (for Bootstrap)
app.use(express.static('public'));
app.use(express.static(__dirname + "/public")); // make the public folder the default one for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));




app.set('view engine', 'ejs')
global.param1 = null;

const clickHandler = (e) => {
    console.log("Click handler in app ", e);
    alert("CLICK");
}


app.get('/', (req,res) => {
    getDBConnection()
        .then((db) => {
            return db.all('SELECT * FROM meetings');
        })
        .then ((meetings) =>{

    res.render('pages/index', { data : meetings, title : "Scheduled Meetings, Reminders", clickHandler : clickHandler, });
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
});
});


app.get("/admin", async (req, res) => {

    try {
  
      const db = await getDBConnection();
  
      const rows = await db.all('SELECT * FROM meetings');
  
      res.render("pages/admin", { data: rows, title: "Administer Meetings", notification: true, message: "--------" });
  
    }
  
    catch (err) {
  
      console.error(err);
  
      res.status(404).send('An error occurred while getting the data to manage');
  
    }
  
  });

// Route to handle form submission

app.post('/add_meeting', async (req, res) => {
    console.log (req);
console.log (req.body);
    const { topic, mandatory, dateTime, location, parking } = req.body;
   
    let is_mandatory = req.body.mandatory ? 1 : 0;
  
  console.log(`IN ADD MTG - topic ${topic}, mandatory ${is_mandatory}, dateTime ${dateTime}, location ${location}, parking ${parking}`);
  
    try {
  
      const db = await getDBConnection();
  
      await db.run('INSERT INTO meetings (topic, mandatory, dateTime, location, parking) VALUES (?, ?, ?, ?, ?)', [topic, is_mandatory, dateTime, location, parking]);
  
      // redirect to home route
  
      res.redirect('/'); // Redirect back to home route
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).send('An error occurred while submitting the form');
  
    }
  
   });

   app.delete('/delete/:id', async (req, res) => {

    try {
  
        const db = await getDBConnection();
  
        await db.run('DELETE FROM meetings WHERE id = ?', req.params.id);
  
        res.redirect('/'); // Redirect back to home route
  
    } catch (error) {
  
        console.error(error);
  
        res.status(500).send('Error deleting item');
  
    }
  
  });

// Edit route

app.get('/edit/:id', async (req, res) => {

    const db = await getDBConnection();
  
    const sql = `SELECT * FROM meetings WHERE id = ?`;
  
    const row = await db.get(sql, req.params.id);
  
    res.render('pages/edit', { data: row, title: "Change Meeting", notification: true, message: "Meeting being modified" });
  
  });

  
app.post('/edit/:id', async (req, res) => {

    const db = await getDBConnection();
  
    let { topic, mandatory, datetime, location, parking } = req.body;
  
    let is_mandatory = mandatory == undefined ? 0 : 1;
  
    const sql = `UPDATE meetings SET topic = ?, mandatory = ?, dateTime = ?, location = ?, parking = ? WHERE id = ?`;
  
    await db.run(sql, [topic, is_mandatory, datetime, location, parking, req.params.id]);
  
    res.redirect('/'); // Redirect back to home route
  
  }); 
  



app.get('/contact', (req,res) => {
    res.render('pages/contact', { title : "Contact Us"});
});

app.listen(port, () => {
    console.log('App listening at port ${port}')
});
