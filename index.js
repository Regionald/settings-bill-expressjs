
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingBills = require('./settings-bill');

const app = express();
const settingBill = SettingBills();

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

let print = console.log;
let PORT = process.env.PORT || 8081;

app.get('/', (req, res) => {

    res.render('index',{settings:settingBill.getSettings(),
    totals:settingBill.totals(),warning:settingBill.hasReachedWarningLevel(),
    critical:settingBill.hasReachedCriticalLevel()});
});

app.post('/settings', (req, res) => {
    

    settingBill.setSettings({
        smsCost: req.body.smsCost,
        callCost: req.body.callCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    print(settingBill.getSettings());
    res.redirect('/');

});

app.post('/action', (req, res) => {
    settingBill.recordAction(req.body.actionType)
    res.redirect('/');
});

app.get('/actions', (req, res) => {
    res.render('action',{actions:settingBill.actions()});
});

app.get('/actions/:type', (req, res) => {

    let actionType=req.params.type;
    res.render('action',{actions:settingBill.actionsFor(actionType)});
});


app.listen(PORT, () => {
    print("The server is listening at port:" + PORT);
});

