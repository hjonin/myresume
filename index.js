const fs = require("fs");
const path = require('path');
const moment = require('moment');
const addressFormat = require('address-format');

const Handlebars = require("handlebars");

Handlebars.registerHelper({
    removeProtocol: function (url) {
        return url.replace(/.*?:\/\//g, '');
    },

    concat: function () {
        let res = '';

        for (let arg in arguments) {
            if (typeof arguments[arg] !== 'object') {
                res += arguments[arg];
            }
        }

        return res;
    },

    eq: (a, b) => a === b,

    formatAddress: function (address, city, region, postalCode, countryCode) {
        let addressList = addressFormat({
            address: address,
            city: city,
            subdivision: region,
            postalCode: postalCode,
            countryCode: countryCode
        });


        return addressList.join('<br/>');
    },

    formatDate: function (date) {
        return moment(date).format('MM/YYYY');
    },

    lowercase: str => str.toLowerCase(),

});

function render(resume) {
    const css = fs.readFileSync(__dirname + "/style.css", "utf-8");
    const tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
    const partialsDir = path.join(__dirname, 'partials');
    const filenames = fs.readdirSync(partialsDir);

    filenames.forEach(function (filename) {
        const matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) {
	    return;
	  }
        const name = matches[1];
        const filepath = path.join(partialsDir, filename);
        const template = fs.readFileSync(filepath, 'utf8');

        Handlebars.registerPartial(name, template);
	});
	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};