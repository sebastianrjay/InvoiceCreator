var Products = {
  "Portfolio Website": { msrp: "$300" },
  "Personal Business Website": { msrp: "$3000" },
  "Small Business Website": { msrp: "$10000" },
  "Medium Business Website": { msrp: "$30000" },
  "Large Business Website": { msrp: "$100000" },
  "Corporate Website": { msrp: "$1000000" },
  "google.com": { msrp: "$515970000000"}
};

var loremIpsum = ("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed" +
"do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"+
"veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo" +
"consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum" +
"dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident," +
"sunt in culpa qui officia deserunt mollit anim id est laborum").split(' ');

loremIpsum.forEach(function(string) {
  Products[string] = { msrp: (10000 * Math.random()) };
});

module.exports = Products;
